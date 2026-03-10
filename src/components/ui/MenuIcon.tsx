type MenuIconProps = {
  Icon: React.ElementType;
  className?: string;
};

export default function MenuIcon({ Icon, className }: MenuIconProps) {
  return (
    <Icon
      className={`w-4 h-4 text-neutral-700 dark:text-neutral-300 ${className}`}
    />
  );
}
