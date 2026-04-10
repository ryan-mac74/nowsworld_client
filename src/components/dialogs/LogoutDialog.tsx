import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { LogOut, X } from "lucide-react";
import Button from "@/components/ui/Button";
import MenuIcon from "@/components/ui/MenuIcon";

type LogoutDialogProps = {
  className?: string;
  onLogout?: () => void;
};

export default function LogoutDialog({ className, onLogout }: LogoutDialogProps) {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await onLogout?.();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          className={className}
          onClick={() => setOpen(true)}
        >
          <MenuIcon Icon={LogOut} />
          Log Out
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content
          className="
            fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm
            bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-xl flex flex-col gap-4
            "
        >
          <Dialog.Close asChild>
            <Button className="absolute left-2 top-2 text-muted-foreground hover:text-foreground">
              <X className="text-green-800 size-8" />
            </Button>
          </Dialog.Close>

          <div className="text-center">
            <Dialog.Title className="text-xl font-bold">
              Log out to your account
            </Dialog.Title>
            <Dialog.Description className="text-base text-neutral-800 dark:text-neutral-200 mt-1">
              Are you sure you want to log out?
            </Dialog.Description>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <Dialog.Close asChild>
              <Button className="bg-green-600 dark:bg-green-700 text-white hover:bg-green-800">
                Cancel
              </Button>
            </Dialog.Close>
            <Button onClick={handleLogout} className="bg-red-600 dark:bg-red-700 text-white hover:bg-red-800">
              Log Out
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
