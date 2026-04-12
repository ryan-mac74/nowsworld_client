import renderContentWithLinks from "@/utils/renderLinks";
import usePullToRefresh from "@/hooks/usePullToRefresh";
import PullToRefreshIcon from "@/components/ui/PullToRefreshIcon";
import Avatar from "@/components/ui/Avatar";

export type Post = {
    id: number;
    content: string;
    published: boolean;
    createdAt: string;
    _count: {
        likes: number;
        comments: number;
    };
};

export type User = {
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

type NewsFeedProps = {
    users: User[];
};

export default function NewsFeed({ users }: NewsFeedProps) {
    const { isRefreshing, indicatorRef, iconRef } = usePullToRefresh();

    return (
        <div
            className="flex flex-col items-center gap-4 w-full"
            style={{ touchAction: "pan-y" }}
        >
            <PullToRefreshIcon
                isRefreshing={isRefreshing}
                indicatorRef={indicatorRef}
                iconRef={iconRef}
            />

            {users.map((user) => (
                <div
                    key={user.id}
                    className="
                        w-full max-w-2xl border border-neutral-200 dark:border-neutral-700 
                        rounded-lg p-2 shadow-md bg-white dark:bg-neutral-800
                    "
                >
                    {/* User Info */}
                    <>
                        <div className="flex items-center justify-center text-center gap-2">
                            <Avatar name={user.name} avatar={user.avatar} />
                            <div className="flex flex-col justify-center items-center gap-0.5">
                                <span className="text-neutral-900 dark:text-neutral-100 text-2xl font-bold">
                                    {user.name}
                                </span>

                                {/* TODO
                                
                                <span className="text-neutral-500 dark:text-neutral-300 text-lg font-normal">
                                    @{user.username}
                                </span>

                                */}
                            </div>
                        </div >


                        {/* TODO
                        
                        {
                            user.email && !user.email.endsWith(".oauth") && (
                                <p className="text-neutral-600 dark:text-neutral-300">{user.email}</p>
                            )
                        }

                        */}

                        {
                            user.bio && (
                                <p className="text-neutral-600 dark:text-neutral-200 italic mt-2">{user.bio}</p>
                            )
                        }
                    </>

                    {/* User Posts */}
                    <div className="mt-4">
                        {(user.posts.length === 0) ? (
                            <p className="text-neutral-400">No posts yet</p>
                        ) : (
                            <ul className="space-y-4">
                                {user.posts.map((post) => (
                                    <li
                                        key={post.id}
                                        className="
                                            border-b border-neutral-300 dark:border-neutral-700 
                                            rounded p-4 bg-neutral-100 dark:bg-neutral-900
                                        "
                                    >
                                        <div className="flex justify-center items-center gap-2">
                                            <span className="text-xs text-neutral-500">
                                                {new Date(post.createdAt).toLocaleString()}
                                            </span>

                                            {!post.published && (
                                                <span
                                                    className="
                                                        text-orange-800 dark:text-orange-200 bg-orange-100 dark:bg-orange-800/20 
                                                        px-2 py-0.5 rounded text-xs
                                                    "
                                                >
                                                    Draft
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap mt-2">
                                            {renderContentWithLinks(post.content)}
                                        </p>

                                        {/* TODO
                        
                                        <div className="flex gap-4 mt-2 text-sm text-neutral-400">
                                            <span>❤️ {post._count.likes}</span>
                                            <span>💬 {post._count.comments}</span>
                                        </div>
                                        
                                        */}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div >
            ))
            }
        </div>
    );
}
