import { Hourglass } from "lucide-react";

export default function WorkInProgress() {
    return (
        <div className="flex flex-col items-center justify-center w-full gap-4 text-neutral-600 dark:text-neutral-400">
            <div className="animate-[spin_3s_ease-in-out_infinite]">
                <Hourglass size={44} />
            </div>
            <h2 className="text-base font-medium">
                Work still in progress...
            </h2>
        </div>
    );
}
