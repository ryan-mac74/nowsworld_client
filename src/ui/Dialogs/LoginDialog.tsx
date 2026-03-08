import * as Dialog from "@radix-ui/react-dialog";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { LinkIcon, LogIn, X } from "lucide-react";
import Button from "@/ui/Button";

type LoginDialogProps = {
  user?: any;
  className?: string;
};

export default function LoginDialog({ user, className }: LoginDialogProps) {
  const VITE_API_URL = import.meta.env.VITE_API_URL || '';

  const handleGoogleLogin = () => {
    window.location.href = `${VITE_API_URL}/auth/google`;
  }
  const handleFacebookLogin = () => {
    window.location.href = `${VITE_API_URL}/auth/facebook`;
  }

  const isLoggedIn = !!user;

  return (
    <Dialog.Root>
      {/* Trigger Button */}
      <Dialog.Trigger asChild>
        {isLoggedIn ? (
          <Button className={className}>
            <LinkIcon className="size-4" />
            Link Account
          </Button>
        ) : (
          <Button
            className="
              border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800
              text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700
              flex items-center gap-2
            "
          >
            <LogIn className="size-4" />
            Log In
          </Button>
        )}
      </Dialog.Trigger>

      {/* Overlay */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Content */}
        <Dialog.Content
          className="
            fixed left-1/2 top-1/2 w-[90%] max-w-md
            -translate-x-1/2 -translate-y-1/2
            bg-white dark:bg-zinc-900
            rounded-xl p-6 shadow-xl
            flex flex-col gap-6
          "
        >
          {/* Close Button */}
          <Dialog.Close asChild>
            <button className="absolute left-4 top-4 text-muted-foreground hover:text-foreground">
              <X className="text-red-800 size-8" />
            </button>
          </Dialog.Close>

          <div className="text-center">
            <Dialog.Title className="text-xl font-bold">
              {isLoggedIn ? (
                "Link a new account"
              ) : (
                "Log in to your account"
              )}
            </Dialog.Title>

            <Dialog.Description className="text-base text-neutral-800 dark:text-neutral-200 mt-1">
              {isLoggedIn ? (
                "Connect another provider to your account"
              ) : (
                "Choose any provider first then link another account later"
              )}
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
