import { useState, useEffect, useRef, useCallback } from "react";
import NewsFeedSkeleton from "@/components/skeleton/NewsFeedSkeleton";
import NewsFeed from "@/components/layout/NewsFeed";
import type { User } from "@/components/layout/NewsFeed";
import Button from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

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
    setUsers([]);
    setError(null);
    setPage(1);
    setHasMore(true);
  }, []);

  // Fetch users for a page
  useEffect(() => {
    if (isAuthenticated === null) {
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
  }, [page, isAuthenticated]);

  // Infinite scroll observer
  useEffect(() => {
    // Exit if no loader or no more users to fetch or already loading
    if (!loaderRef.current || !hasMore || loading) {
      return;
    }

    // Callback whenever the loader is visible
    const observer = new IntersectionObserver(
      (entries, obs) => {
        if (entries[0].isIntersecting) {
          obs.unobserve(entries[0].target);
          setPage((prev) => prev + 1);
        }
      },
      // Trigger callback before visibility
      { rootMargin: "250px" }
    );

    // Start observing the loader element
    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [loaderRef, hasMore, loading]);

  // Listen for manual refetch triggers
  useEffect(() => {
    const handleRefetch = () => refetchFeed();
    window.addEventListener("refetch-feed", handleRefetch);

    // Cleanup listener on unmount
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
                  onClick={() => setPage((prev) => prev)}
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

      {!error && hasMore && !loading && (
        <div
          ref={loaderRef}
          className="h-4 w-full flex justify-center items-center"
        >
          <span className="text-neutral-500 dark:text-neutral-400">
            Scroll to load more
          </span>
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
