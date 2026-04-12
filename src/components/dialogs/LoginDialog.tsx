import * as Dialog from "@radix-ui/react-dialog";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { LinkIcon, LogIn, X } from "lucide-react";
import Button from "@/components/ui/Button";
import MenuIcon from "@/components/ui/MenuIcon";
import { headerButtonClass } from "@/components/layout/AppHeader";
import useAuth from "@/hooks/useAuth";

type LoginDialogProps = {
  className?: string;
};

export default function LoginDialog({ className }: LoginDialogProps) {
  const { isAuthenticated } = useAuth();

  const VITE_API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000/api";

  const handleGoogleLogin = () => {
    window.location.href = `${VITE_API_URL}/auth/google`;
  }
  const handleFacebookLogin = () => {
    window.location.href = `${VITE_API_URL}/auth/facebook`;
  }

  const loginButtonClass = `
    ${headerButtonClass}
    !bg-green-600
    !text-white
    !text-sm
    sm:!text-lg
    mr-0.5
  `;

  const actionIcon = isAuthenticated ? LinkIcon : LogIn;
  const triggerClass = isAuthenticated ? className : loginButtonClass;

  const actionLabel = isAuthenticated
    ? "Link Account"
    : "Log In";

  const actionTitle = isAuthenticated
    ? "Link a new account"
    : "Log in to your account";

  const description = isAuthenticated
    ? "Connect another profile from any of the providers below to your account for more log in flexibility"
    : "Choose an account from any of the providers below for starters, then link another profile later";

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          className={triggerClass}
          aria-label={actionLabel}
        >
          <MenuIcon Icon={actionIcon} />
          {actionLabel}
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        <Dialog.Content
          className="
            fixed left-1/2 top-1/2 w-[90%] max-w-md
            -translate-x-1/2 -translate-y-1/2
            bg-white dark:bg-zinc-900
            rounded-xl p-6 shadow-xl
            flex flex-col gap-6
          "
        >
          <Dialog.Close asChild>
            <Button className="absolute left-2 top-2 text-muted-foreground hover:text-foreground">
              <X className="text-red-800 size-8" />
            </Button>
          </Dialog.Close>

          <div className="text-center">
            <Dialog.Title className="text-xl font-bold">
              {actionTitle}
            </Dialog.Title>

            <Dialog.Description className="text-base text-neutral-800 dark:text-neutral-200 mt-1">
              {description}
            </Dialog.Description>
          </div>

          <div className="grid gap-4">
            {/* Google */}
            <Button
              onClick={handleGoogleLogin}
              className="w-full bg-white text-black border border-gray-300 shadow-sm hover:bg-gray-50 dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-700 flex items-center justify-center gap-2"
            >
              <FcGoogle className="size-6" />
              Continue with Google
            </Button>

            {/* Facebook */}
            <Button
              onClick={handleFacebookLogin}
              className="w-full bg-[#1877F2] text-white hover:bg-[#166FE5] flex items-center justify-center gap-2"
            >
              <FaFacebook className="size-6" />
              Continue with Facebook
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root >
  );
}
