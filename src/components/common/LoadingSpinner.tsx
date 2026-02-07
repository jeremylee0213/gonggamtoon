interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({ text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin" />
      {text && <p className="text-sm text-muted mt-3">{text}</p>}
    </div>
  );
}
