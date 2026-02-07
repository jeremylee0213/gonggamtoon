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
        px-5 py-3 rounded-xl text-base font-medium transition-all duration-200
        border-2 cursor-pointer
        ${selected
          ? 'border-primary bg-primary-light text-primary-dark shadow-[0_2px_8px_rgba(0,122,255,0.15)]'
          : 'border-transparent bg-surface text-text hover:border-primary/50 hover:shadow-sm'
        }
      `}
      role="radio"
      aria-checked={selected}
    >
      {label}
    </button>
  );
}
