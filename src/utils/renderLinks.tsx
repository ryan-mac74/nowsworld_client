import { Fragment } from "react";
import PopupLink from "@/components/ui/PopupLink";

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
                <PopupLink key={index} href={href}>
                    {part}
                </PopupLink>
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
