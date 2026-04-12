import { Fragment } from "react";

// Helper function to parse and convert links into clickable tags opening a popup window
export default function renderContentWithLinks(content: string): React.ReactNode[] {
    if (!content) return [];

    // Normalize literal '\n' string characters into actual newlines
    const normalizedContent = content.replace(/\\r\\n|\\n/g, '\n');

    // Matches http/https links, www. links, OR local absolute paths with extensions
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|\/[^\s]+\.[a-zA-Z0-9]{2,})/i;
    const parts = normalizedContent.split(urlRegex);

    return parts.map((part, index) => {
        // Odd index => matched URL part due to the split regex capturing groups
        if (index % 2 === 1) {
            // Ensure www. links have a valid protocol applied
            const href = part.startsWith("www.") ? `https://${part}` : part;

            return (
                <a
                    key={index}
                    href={href}
                    onClick={(e) => {
                        e.preventDefault();

                        if (part.startsWith("http") || part.startsWith("www.")) {
                            // External link: open safely in a standard new browser tab
                            window.open(href, "_blank", "noopener,noreferrer");
                        } else {
                            // Local file: open in a centered dynamic popup window based on screen size
                            const width = Math.round(window.screen.width * 0.8);
                            const height = Math.round(window.screen.height * 0.8);
                            const left = Math.round((window.screen.width - width) / 2);
                            const top = Math.round((window.screen.height - height) / 2);

                            window.open(
                                part,
                                "popup",
                                `toolbar=no,scrollbars=yes,resizable=yes,top=${top},left=${left},width=${width},height=${height}`
                            );
                        }
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:underline break-all cursor-pointer"
                >
                    {part}
                </a>
            );
        }

        // Detect actual newlines and safely replace with <br /> tags
        return (
            <Fragment key={index}>
                {part.split('\n').reduce((acc: React.ReactNode[], line, i) => {
                    if (i > 0) {
                        acc.push(<br key={`br-${index}-${i}`} />);
                    }
                    acc.push(line);
                    return acc;
                }, [])}
            </Fragment>
        );
    });
};
