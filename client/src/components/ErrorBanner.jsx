import Button from "./ui/Button";
import Card from "./ui/Card";

function ErrorBanner({ message, onRetry }) {
  return (
    <Card className="flex flex-col gap-4 border-rose-200/80 bg-rose-50/90 p-4 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between">
      <p className="leading-relaxed">{message}</p>
      {onRetry ? (
        <Button
          variant="outline"
          size="sm"
          className="self-start border-rose-200 bg-white text-rose-700 hover:bg-rose-100 sm:self-auto"
          onClick={onRetry}
        >
          Retry
        </Button>
      ) : null}
    </Card>
  );
}

export default ErrorBanner;
