import getInitials from "@/utils/getInitials";

type AvatarProps = {
  name?: string;
  avatar?: string;
};

export default function Avatar({
  name = "",
  avatar,
}: AvatarProps) {
  return (
    <div
      className="
        flex items-center justify-center font-bold rounded-full
        bg-neutral-900 dark:bg-white 
        text-neutral-100 dark:text-neutral-900 
        w-8 sm:w-10 h-8 sm:h-10 text-base sm:text-lg
        shrink-0 p-0.5
      "
    >
      {avatar ? (
        <img
          src={avatar}
          alt={getInitials(name)}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span className="text-base sm:text-lg">{getInitials(name)}</span>
      )}
    </div>
  );
}
