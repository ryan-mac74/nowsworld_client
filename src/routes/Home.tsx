import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import NewsFeedSkeleton from "@/components/skeleton/NewsFeedSkeleton";
import NewsFeed from "@/components/layout/NewsFeed";
import type { User } from "@/components/layout/NewsFeed";
import Button from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";

// Module-level cache to preserve state across tab navigation
let cachedUsers: User[] = [];
let cachedPage = 1;
let cachedFetchedPage = 0;
let cachedHasMore = true;
let cachedScrollPosition = 0;

export default function Home() {
  const location = useLocation();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [users, setUsers] = useState<User[]>(cachedUsers);
  const [loading, setLoading] = useState(cachedUsers.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(cachedPage);
  const [hasMore, setHasMore] = useState(cachedHasMore);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [prevAuth, setPrevAuth] = useState<boolean | null>(null);
  const [retryCounter, setRetryCounter] = useState(0);

  // Disable browser's default scroll restoration to manage it manually
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  const VITE_API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000/api";

  const userLimit = Number(import.meta.env.VITE_USER_LIMIT) || 5;
  const postLimit = Number(import.meta.env.VITE_POST_LIMIT) || 10;

  const fetchFeedRequest = async (pageToFetch: number) => {
    const endpoint = isAuthenticated ? "/private/feed" : "/public/feed";

    const res = await fetch(
      `${VITE_API_URL}${endpoint}?page=${pageToFetch}&userLimit=${userLimit}&postLimit=${postLimit}`,
      {
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error(`❌ HTTP ${res.status}`);
    }

    return res.json() as Promise<User[]>;
  };

  const refetchFeed = useCallback(() => {
    cachedUsers = [];
    cachedPage = 1;
    cachedFetchedPage = 0;
    cachedHasMore = true;
    cachedScrollPosition = 0;

    setUsers([]);
    setError(null);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    setRetryCounter((prev) => prev + 1); // to trigger useEffect when "refetch-feed" event occurs
  }, []);

  // Reset feed when user logs in or out
  if (!isAuthLoading) {
    if (prevAuth === null) {
      setPrevAuth(isAuthenticated);
    } else if (prevAuth !== isAuthenticated) {
      setPrevAuth(isAuthenticated);
      refetchFeed();
    }
  }

  // Sync state to module-level cache
  useEffect(() => {
    cachedUsers = users;
    cachedPage = page;
    cachedHasMore = hasMore;
  }, [users, page, hasMore]);

  // Restore scroll position when users are loaded
  useEffect(() => {
    if (users.length === 0 || cachedScrollPosition === 0) {
      return;
    }

    // Double requestAnimationFrame ensures the browser has fully painted the DOM
    // and React Router has finished its navigation scroll resets
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: cachedScrollPosition, behavior: "auto" });
      });
    });
  }, [users, location.key]); // "location.key" changes on every navigation => scroll restoration

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Save current scroll position to cache on scroll
      cachedScrollPosition = window.scrollY;
    };

    // "passive" => browser can keep scrolling without waiting for the event handler
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup event listener on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch users for a page
  useEffect(() => {
    // Wait for auth to resolve to prevent wrong endpoint requests
    if (isAuthLoading) {
      return;
    }

    // Prevent refetching for already fetched pages
    if (page <= cachedFetchedPage) {
      return;
    }

    let ignore = false; // to prevent state updates on unmounted component (React Strict Mode)

    const fetchFeed = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchFeedRequest(page);

        if (!ignore) {
          if (page === 1) {
            setUsers(data);
            setHasMore(true);
          } else {
            // Only add new users not in the list yet
            setUsers((prev) => {
              const newUsers = data.filter(
                (newUser) => !prev.some((existing) => existing.id === newUser.id)
              );

              return [...prev, ...newUsers];
            });
          }

          if (data.length < userLimit) {
            // No more users to load
            setHasMore(false);
          }

          // Mark the page as fetched
          cachedFetchedPage = page;

          setLoading(false);
        }
      } catch (error) {
        if (!ignore) {
          console.error(error);

          setError(
            (page === 1) ? (
              "❌ Failed to refresh users"
            ) : (
              "❌ Failed to load users"
            )
          );

          setLoading(false);
        }
      }
    };

    fetchFeed();

    return () => {
      ignore = true;
    };
  }, [page, isAuthenticated, isAuthLoading, retryCounter]);

  // Infinite scroll observer
  useEffect(() => {
    // Exit if no loader or no more users to fetch
    if (!loaderRef.current || !hasMore) {
      return;
    }

    // Callback whenever the loader is visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setLoading(true);
          setPage((prev) => prev + 1);
        }
      },
      // Trigger callback before visibility
      { rootMargin: "250px" }
    );

    // Start observing the loader element
    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  // Listen for manual refetch triggers
  useEffect(() => {
    const handleRefetch = () => refetchFeed();
    window.addEventListener("refetch-feed", handleRefetch);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("refetch-feed", handleRefetch);
  }, [refetchFeed]);

  return (
    <main className="w-full flex-1 flex flex-col items-center gap-4 pt-2 pb-2">
      {(page === 1) ? (
        error ? (
          <div
            className="
              w-full max-w-2xl flex flex-col items-center text-center 
              mt-4 p-4 rounded-lg border border-red-200 dark:border-red-800 
              bg-red-50 dark:bg-red-800/20 shadow-sm
            "
          >
            <div className="text-2xl mb-2">⚠️</div>

            <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">
              Something went wrong
            </h2>

            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>

            <Button
              onClick={refetchFeed}
              className="
                bg-red-600 hover:bg-red-700 text-white 
                mt-2 active:scale-95
              "
            >
              Try again
            </Button>
          </div>
        ) : loading ? (
          [...Array(2)].map((_, i) => <NewsFeedSkeleton key={i} />)
        ) : (
          <NewsFeed users={users} />
        )
      ) : (
        <>
          <NewsFeed users={users} />

          {loading ? (
            [...Array(1)].map((_, i) => <NewsFeedSkeleton key={i} />)
          ) : (
            error && (
              <div className="w-full max-w-2xl flex flex-col items-center">
                <p className="mt-2 text-sm text-red-500">
                  {error}
                </p>

                <Button
                  onClick={() => {
                    setError(null);
                    setRetryCounter((prev) => prev + 1);
                  }}
                  className="
                    bg-blue-500 hover:bg-blue-700 text-white 
                    mt-2 active:scale-95
                  "
                >
                  Load more
                </Button>
              </div>
            )
          )}
        </>
      )}

      {!error && hasMore && (
        <div
          ref={loaderRef} // to observe when into the viewport for infinite scroll
          className="h-4 w-full flex justify-center items-center"
        >
          {!loading && (
            <span className="text-neutral-500 dark:text-neutral-400">
              Scroll to load more
            </span>
          )}
        </div>
      )}

      {!error && loading && page > 1 && (
        <p className="text-neutral-500 dark:text-neutral-400 text-center m-2">
          Loading more users...
        </p>
      )}

      {!error && !hasMore && users.length > 0 && (
        <p className="text-neutral-500 dark:text-neutral-400 text-center m-2">
          No more users to load
        </p>
      )}
    </main>
  );
}
