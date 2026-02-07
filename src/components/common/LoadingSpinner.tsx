interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({ text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin" />
      {text && <p className="text-base text-muted mt-4">{text}</p>}
    </div>
  );
}
