const NODE_ENV = import.meta.env.NODE_ENV ?? "development";

export const isProd = ["production", "staging"].includes(NODE_ENV);
export const authMode = isProd ? "cookie" : "bearer";

export function authFetch(url: string, options: RequestInit = {}) {
    if (authMode === "bearer") {
        const token = localStorage.getItem("token");

        // if (authMode === "bearer")
        return fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: token ? `Bearer ${token}` : "",
            },
        });
    }

    // if (authMode === "cookie")
    return fetch(url, {
        ...options,
        credentials: "include",
    });
}
