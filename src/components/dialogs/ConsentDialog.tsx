import * as Dialog from "@radix-ui/react-dialog";
import Button from "@/components/ui/Button";
import { X } from "lucide-react";

type ConsentDialogProps = {
  isLoading: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
};

export default function ConsentDialog({ isLoading, isOpen, setOpen, onConfirm }: ConsentDialogProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content
          className="
            fixed z-50 left-1/2 top-1/2 w-[90%] max-w-sm
            -translate-x-1/2 -translate-y-1/2
            bg-white dark:bg-zinc-900
            rounded-xl shadow-xl p-6
            flex flex-col gap-4
          "
        >
          <Dialog.Close asChild>
            <Button className="absolute left-2 top-2 text-muted-foreground hover:text-foreground">
              <X className="text-neutral-800 dark:text-neutral-200 size-4" />
            </Button>
          </Dialog.Close>

          <div className="text-center mt-2">
            <Dialog.Title className="text-xl font-bold">
              Create New Account
            </Dialog.Title>
            <Dialog.Description className="text-base text-neutral-800 dark:text-neutral-200 mt-2">
              We couldn't find an existing account linked to this profile
            </Dialog.Description>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
              You can cancel this process, log in to your existing account if there are any,
              and link this profile OR proceed to get started with a new account
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-2">
            <Dialog.Close asChild>
              <Button
                disabled={isLoading}
                className="
                  bg-neutral-300 dark:bg-neutral-700 
                  text-neutral-900 dark:text-white 
                  hover:bg-neutral-400 dark:hover:bg-neutral-600
                "
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className="
                bg-blue-600 dark:bg-blue-700 
                text-white hover:bg-blue-800
              "
            >
              {isLoading ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
