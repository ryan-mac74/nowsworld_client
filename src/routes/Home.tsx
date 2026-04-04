import { useState, useEffect, useRef } from "react";
import useAuth from "@/hooks/useAuth";
import AppHeader from "@/components/layout/AppHeader";
import NewsFeedSkeleton from "@/components/skeleton/NewsFeedSkeleton";
import NewsFeed from "@/components/layout/NewsFeed";
import type { User } from "@/components/layout/NewsFeed";
import Button from "@/components/ui/Button";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { user, logout, deactivateAccount, activateAccount } = useAuth();

  const VITE_API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000/api";

  const userLimit = Number(import.meta.env.VITE_USER_LIMIT) || 5;
  const postLimit = Number(import.meta.env.VITE_POST_LIMIT) || 10;

  const fetchUsersRequest = async (pageToFetch: number) => {
    const res = await fetch(`${VITE_API_URL}/users?page=${pageToFetch}&userLimit=${userLimit}&postLimit=${postLimit}`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`❌ HTTP ${res.status}`);
    }

    return res.json() as Promise<User[]>;
  };

  const refetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Refetch 1st page of users
      const data = await fetchUsersRequest(1);

      setUsers(data);
      setPage(1);

      if (data.length < userLimit) {
        // No more users to load
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
      setError("❌ Failed to refresh users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch users for a page
  useEffect(() => {
    if (!hasMore) {
      return;
    }

    // Prevent state updates on unmounted component
    // by React Strict Mode
    let ignore = false;

    const fetchUsers = async () => {
      setLoading(true);

      try {
        const data = await fetchUsersRequest(page);

        if (!ignore) {
          // Append new users to the list
          setUsers(prev => [...prev, ...data]);

          if (data.length < userLimit) {
            // No more users to load
            setHasMore(false);
          }

          setLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setError("❌ Failed to load users");
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      ignore = true;
    };
  }, [page]);

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

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 bg-white dark:bg-neutral-900">
      <AppHeader
        user={user}
        logout={async () => await logout()}
        deactivateAccount={async () => {
          await deactivateAccount();
          await refetchUsers();
        }}
        activateAccount={async () => {
          await activateAccount();
          await refetchUsers();
        }}
      />

      {page === 1 ? (
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
              onClick={refetchUsers}
              className="
                bg-red-600 hover:bg-red-700 text-white 
                mt-2 transition active:scale-95
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
                    mt-2 transition active:scale-95
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
        <div ref={loaderRef} className="h-4 w-full flex justify-center items-center">
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
    </div >
  );
}
