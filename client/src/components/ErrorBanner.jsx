import Button from "./ui/Button";
import Card from "./ui/Card";

function ErrorBanner({ message, onRetry }) {
  return (
    <Card className="flex flex-col gap-4 border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between">
      <p>{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" className="self-start sm:self-auto" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </Card>
  );
}

export default ErrorBanner;
