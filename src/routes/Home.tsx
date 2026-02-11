import { useState, useEffect } from "react";
import StatusDialog from "@/ui/StatusDialog";

type Post = {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
};

type User = {
  id: number;
  email: string;
  name: string;
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
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        
        const data: User[] = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load users");
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
        title="Error on loading users"
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
          <h2 className="text-2xl font-bold text-neutral-100">{user.name}</h2>
          <p className="text-neutral-200">{user.email}</p>

          {/* Posts */}
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2 text-neutral-100">Posts</h3>

            {user.posts.length === 0 ? (
              <p className="text-neutral-400">No posts yet</p>
            ) : (
              <ul className="space-y-3">
                {user.posts.map((post) => (
                  <li key={post.id} className="border border-neutral-700 rounded p-4">
                    <div className="flex items-center justify-center">
                      <h4 className="font-semibold text-neutral-100">{post.title}</h4>
                      {!post.published && (
                        <span className="text-xs text-orange-200 bg-orange-800/30 px-1.5 py-0.5 rounded">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-200 text-sm mt-1">{post.content}</p>
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
