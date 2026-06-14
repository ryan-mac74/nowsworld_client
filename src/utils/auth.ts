import { getToken } from "@/utils/token";

const MODE = import.meta.env.MODE;

export const isProd = ["production", "staging"].includes(MODE);
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
