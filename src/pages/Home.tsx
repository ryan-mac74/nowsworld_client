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
        title="Loading Users..."
        message="Please, wait a moment"
      />
    );
  }

  if (error) {
    return (
      <StatusDialog
        type="error"
        title="Failed to load users"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen p-8 space-y-8">
      {users.map((user) => (
        <div
          key={user.id}
          className="border rounded-lg p-6 shadow-sm"
        >
          {/* User Info */}
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>

          {/* Posts */}
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Posts</h3>

            {user.posts.length === 0 ? (
              <p className="text-gray-400">No posts yet</p>
            ) : (
              <ul className="space-y-3">
                {user.posts.map((post) => (
                  <li
                    key={post.id}
                    className="border rounded p-4"
                  >
                    <h4 className="font-semibold">{post.title}</h4>
                    <p className="text-sm text-gray-600">
                      {post.content}
                    </p>
                    {!post.published && (
                      <span className="text-xs text-orange-600">
                        Draft
                      </span>
                    )}
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
