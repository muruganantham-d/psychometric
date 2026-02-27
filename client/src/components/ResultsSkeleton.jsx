import Card from "./ui/Card";
import Skeleton from "./ui/Skeleton";

function ResultsSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="space-y-3 p-6">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-5 w-72" />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-3 p-6">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-64 w-full" />
        </Card>
        <Card className="space-y-3 p-6">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-64 w-full" />
        </Card>
      </div>

      <Card className="space-y-3 p-6">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-28 w-full" />
      </Card>
    </div>
  );
}

export default ResultsSkeleton;
