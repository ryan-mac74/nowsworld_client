import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/ui/ThemeToggle";
import StatusDialog from "@/ui/Dialogs/StatusDialog";
import LoginDialog from "@/ui/Dialogs/LoginDialog";
import LogoutDialog from "@/ui/Dialogs/LogoutDialog";
import getInitials from "@/utils/getInitials";
import useAuth from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/ui/Dropdown-menu";
import Button from "@/ui/Button";
import MenuIcon from "@/ui/MenuIcon";
import { FiUser, FiSettings } from "react-icons/fi";

type Post = {
  id: number;
  content: string;
  published: boolean;
  createdAt: string;
  _count: {
    likes: number;
    comments: number;
  };
};

type User = {
  id: number;
  email?: string;
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  is_active: boolean,
  is_verified: boolean,
  is_superuser: boolean,
  posts: Post[];
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: "Profile", path: "/profile", icon: FiUser },
    { label: "Settings", path: "/settings", icon: FiSettings },
  ];

  const menuItemClass = `
    w-full h-8 flex items-center justify-center
    bg-neutral-100 dark:bg-neutral-800
    hover:bg-neutral-200 dark:hover:bg-neutral-700
    gap-2 cursor-pointer
  `;

  const VITE_API_URL = import.meta.env.VITE_API_URL || '';

  const limitUser = 10;
  const limitPost = 5;

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
        const res = await fetch(`${VITE_API_URL}/users?page=${page}&limitUser=${limitUser}&limitPost=${limitPost}`);
        if (!res.ok) {
          throw new Error(`❌ HTTP ${res.status}`);
        }

        const data: User[] = await res.json();

        if (!ignore) {
          // Append new users to the list
          setUsers(prev => [...prev, ...data]);

          if (data.length < limitUser) {
            // No more users to load
            setHasMore(false);
          }
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setError("❌ Failed to load users");
        }
      } finally {
        if (!ignore) {
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
      { rootMargin: "200px" }
    );

    // Start observing the loader element
    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [loaderRef, hasMore, loading]);

  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-8 bg-white dark:bg-neutral-900">
      <div className="w-full max-w-2xl flex items-center justify-between">
        <ThemeToggle />

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="w-10 h-10 flex items-center justify-center font-bold rounded-full bg-neutral-900 dark:bg-white text-neutral-100 dark:text-neutral-900 shrink-0 p-0.5">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={getInitials(user.name)}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-base">{getInitials(user.name)}</span>
                )}
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="
              bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700
                flex gap-1 flex-col
              "
            >
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <DropdownMenuItem key={item.path} asChild>
                    <Button
                      className={menuItemClass}
                      onClick={() => navigate(item.path)}
                    >
                      <MenuIcon Icon={Icon} />
                      {item.label}
                    </Button>
                  </DropdownMenuItem>
                );
              })}

              <DropdownMenuItem asChild>
                <LoginDialog
                  user={user}
                  className={menuItemClass}
                />
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <LogoutDialog
                  className={menuItemClass}
                  onLogout={() => logout()}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <LoginDialog
            user={user}
            className={menuItemClass}
          />
        )}
      </div>

      {loading && page === 1 ? (
        <StatusDialog
          type="loading"
          title="Loading users..."
          message="Please, wait a moment"
        />
      ) : error ? (
        <StatusDialog
          type="error"
          title="Error loading users"
          message={error}
          onRetry={() => window.location.reload()}
        />
      ) : (
        <>
          {users.map((user) => (
            <div
              key={user.id}
              className="w-full max-w-2xl border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 shadow-md bg-white dark:bg-neutral-800"
            >
              {/* User Info */}
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center justify-center gap-2 text-center">
                <div className="w-10 h-10 flex items-center justify-center font-bold rounded-full bg-neutral-900 dark:bg-white text-neutral-100 dark:text-neutral-900 shrink-0 p-0.5">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={getInitials(user.name)}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-base">{getInitials(user.name)}</span>
                  )}
                </div>
                <span>{user.name}</span>
                <span className="text-neutral-500 dark:text-neutral-300 text-lg font-normal">
                  @{user.username}
                </span>
              </h2>
              {user.email && !user.email.endsWith(".oauth") && (
                <p className="text-neutral-600 dark:text-neutral-300 text-m">{user.email}</p>
              )}
              {user.bio && (
                <p className="text-neutral-600 dark:text-neutral-200 mt-2 italic">{user.bio}</p>
              )}

              {/* User Posts */}
              <div className="mt-6">
                {user.posts.length === 0 ? (
                  <p className="text-neutral-500 dark:text-neutral-400">No posts yet</p>
                ) : (
                  <ul className="space-y-4">
                    {user.posts.map((post) => (
                      <li
                        key={post.id}
                        className="border border-neutral-200 dark:border-neutral-700 rounded p-4 bg-neutral-50 dark:bg-neutral-900"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-neutral-500">
                            {new Date(post.createdAt).toLocaleString()}
                          </span>

                          {!post.published && (
                            <span className="text-xs text-orange-800 dark:text-orange-200 bg-orange-100 dark:bg-orange-800/30 px-2 py-0.5 rounded">
                              Draft
                            </span>
                          )}
                        </div>

                        <p className="text-neutral-800 dark:text-neutral-200 mt-2">
                          {post.content}
                        </p>

                        {/*
                        
                        <div className="flex gap-4 mt-3 text-sm text-neutral-400">
                          <span>❤️ {post._count.likes}</span>
                          <span>💬 {post._count.comments}</span>
                        </div>
                        
                        */}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}

          {hasMore && (
            <div ref={loaderRef} className="h-8 w-full flex justify-center items-center">
              <span className="text-neutral-500 dark:text-neutral-400">Loading more users...</span>
            </div>
          )}

          {!hasMore && users.length > 0 && (
            <p className="text-neutral-500 dark:text-neutral-400 text-center mt-4">No more users to load</p>
          )}
        </>
      )}
    </div >
  );
}
