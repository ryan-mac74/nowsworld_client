type MenuIconProps = {
  Icon: React.ElementType;
  className?: string;
};

export default function MenuIcon({ Icon, className }: MenuIconProps) {
  return (
    <Icon
      className={`w-6 sm:w-8 h-6 sm:h-8 text-neutral-700 dark:text-neutral-300 ${className}`}
    />
  );
}
