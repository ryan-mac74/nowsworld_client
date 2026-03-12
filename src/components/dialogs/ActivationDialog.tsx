import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle, XCircle, X } from "lucide-react";
import Button from "@/components/ui/Button";
import MenuIcon from "@/components/ui/MenuIcon";

type ActivationDialogProps = {
  className?: string;
  isActive: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
};

export default function ActivationDialog({
  className,
  isActive,
  onActivate,
  onDeactivate,
}: ActivationDialogProps) {
  const [open, setOpen] = useState(false);

  const handleAction = async () => {
    try {
      if (isActive) {
        await onDeactivate?.();
      } else {
        await onActivate?.();
      }
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const actionIcon = isActive ? XCircle : CheckCircle;

  const actionLabel = isActive
    ? "Delete Account"
    : "Activate Account";

  const actionTitle = isActive
    ? "Delete your account"
    : "Activate your account";

  const description = isActive
    ? "Your account will temporarily be disabled. Full deletion may take up to 4+ weeks"
    : "Your account is currently deactivated. Activate it to prevent permanent deletion";

  const actionButtonClass = isActive
    ? "bg-red-600 dark:bg-red-700 text-white hover:bg-red-800"
    : "bg-green-600 dark:bg-green-700 text-white hover:bg-green-800";

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button
          className={className}
          onClick={() => setOpen(true)}
        >
          <MenuIcon Icon={actionIcon} />
          {actionLabel}
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
              <X className="text-neutral-800 dark:text-neutral-200 size-8" />
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

          <div className="flex justify-center gap-4 mt-4">
            <Dialog.Close asChild>
              <Button className="bg-neutral-300 dark:bg-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-400 dark:hover:bg-neutral-600">
                Cancel
              </Button>
            </Dialog.Close>
            <Button onClick={handleAction} className={actionButtonClass}>
              {actionLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
