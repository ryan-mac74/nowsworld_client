import * as Dialog from "@radix-ui/react-dialog";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { LogIn, X } from "lucide-react";
import Button from "@/ui/Button";

export default function LoginDialog() {
  const API_URL = import.meta.env.VITE_API_URL;

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  }

  const handleFacebookLogin = () => {
    window.location.href = `${API_URL}/api/auth/facebook`;
  }

  return (
    <Dialog.Root>
      {/* Trigger Button */}
      <Dialog.Trigger asChild>
        <Button
          className="
            border border-neutral-300 dark:border-neutral-700
            bg-white dark:bg-neutral-800
            text-neutral-900 dark:text-neutral-100
            hover:bg-neutral-100 dark:hover:bg-neutral-700
            flex items-center gap-2
          "
        >
          <LogIn className="size-4" />
          Log In
        </Button>
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
            <button className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
              <X className="text-red-800 size-8" />
            </button>
          </Dialog.Close>

          <div className="text-center">
            <h2 className="text-xl font-bold">Log in to your account</h2>
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
    </Dialog.Root>
  )
}
