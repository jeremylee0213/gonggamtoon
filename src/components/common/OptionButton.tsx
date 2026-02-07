interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function OptionButton({ label, selected, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
        border-2 cursor-pointer
        ${selected
          ? 'border-primary bg-primary-light text-primary-dark'
          : 'border-transparent bg-surface text-text hover:border-primary/50'
        }
      `}
      role="radio"
      aria-checked={selected}
    >
      {label}
    </button>
  );
}
