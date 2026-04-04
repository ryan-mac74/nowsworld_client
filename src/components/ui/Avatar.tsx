import { forwardRef } from "react";
import { cn } from "@/lib/tailwind-merge";
import getInitials from "@/utils/getInitials";

type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  name?: string;
  avatar?: string;
};

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ name = "", avatar, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "flex items-center justify-center font-bold rounded-full shrink-0 p-0.5",
          "bg-neutral-900 dark:bg-white text-neutral-100 dark:text-neutral-900",
          "cursor-pointer transition hover:opacity-80",
          "w-8 sm:w-10 h-8 sm:h-10 text-base sm:text-lg",
          className
        )}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={getInitials(name)}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
    );
  }
);

// For debugging and React DevTools
Avatar.displayName = "Avatar";

export default Avatar;
