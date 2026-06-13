import { getToken } from "@/utils/token";

const NODE_ENV = import.meta.env.NODE_ENV ?? "development";

export const isProd = ["production", "staging"].includes(NODE_ENV);
export const authMode = isProd ? "cookie" : "bearer";

export function authFetch(
    url: string,
    options: RequestInit = {}
) {
    const config: RequestInit = { ...options };

    if (authMode === "cookie") {
        config.credentials = "include";
    } else {
        const token = getToken();

        config.headers = {
            ...options.headers,
            ...(token && {
                Authorization: `Bearer ${token}`,
            }),
        };
    }

    return fetch(url, config);
}
