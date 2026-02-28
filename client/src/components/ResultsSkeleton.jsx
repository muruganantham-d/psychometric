import Card from "./ui/Card";
import Skeleton from "./ui/Skeleton";

function ResultsSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="space-y-4 p-6 sm:p-8">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-5 w-11/12 sm:w-2/3" />
        <div className="grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="space-y-4 p-6 sm:p-7">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-64 w-full rounded-[28px]" />
        </Card>
        <Card className="space-y-4 p-6 sm:p-7">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-64 w-full rounded-[28px]" />
        </Card>
      </div>

      <Card className="space-y-4 p-6 sm:p-8">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      </Card>
    </div>
  );
}

export default ResultsSkeleton;
