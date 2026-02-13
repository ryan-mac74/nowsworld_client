import { useState, useEffect } from "react";
import StatusDialog from "@/ui/StatusDialog";

type Comment = {
  id: number;
  content: string;
  userId: number;
  createdAt: string;
};

type Like = {
  id: number;
  userId: number;
};

type Post = {
  id: number;
  content: string;
  published: boolean;
  createdAt: string;
  userId: number;
  comments: Comment[];
  likes: Like[];
};

type User = {
  id: number;
  email: string;
  username: string;
  name: string;
  bio: string | null;
  posts: Post[];
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${API_URL}/api/users`);
        if (!res.ok) throw new Error(`❌ HTTP ${res.status}`);

        const data: User[] = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError("❌ Failed to load users");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [API_URL]);

  if (loading) {
    return (
      <StatusDialog
        type="loading"
        title="Loading users..."
        message="Please, wait a moment"
      />
    );
  }

  if (error) {
    return (
      <StatusDialog
        type="error"
        title="Error loading users"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen p-8 flex flex-col items-center gap-8">
      {users.map((user) => (
        <div
          key={user.id}
          className="w-full max-w-2xl border border-neutral-700 rounded-lg p-6 shadow-md bg-neutral-800"
        >
          {/* User Info */}
          <h2 className="text-2xl font-bold text-neutral-100 flex items-center justify-center gap-2 text-center">
            <span>{user.name}</span>
            <span className="text-neutral-300 text-lg font-normal">
              @{user.username}
            </span>
          </h2>
          <p className="text-neutral-250 text-m">{user.email}</p>
          {user.bio && (
            <p className="text-neutral-200 mt-2 italic">{user.bio}</p>
          )}

          {/* Post List */}
          <div className="mt-6">
            {user.posts.length === 0 ? (
              <p className="text-neutral-400">No posts yet</p>
            ) : (
              <ul className="space-y-4">
                {user.posts.map((post) => (
                  <li
                    key={post.id}
                    className="border border-neutral-700 rounded p-4 bg-neutral-900"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-neutral-500">
                        {new Date(post.createdAt).toLocaleString()}
                      </span>

                      {!post.published && (
                        <span className="text-xs text-orange-200 bg-orange-800/30 px-2 py-0.5 rounded">
                          Draft
                        </span>
                      )}
                    </div>

                    <p className="text-neutral-200 mt-2">
                      {post.content}
                    </p>

                    {/*
                    
                    <div className="flex gap-4 mt-3 text-sm text-neutral-400">
                      <span>❤️ {post.likes.length}</span>
                      <span>💬 {post.comments.length}</span>
                    </div>
                    
                    */}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
