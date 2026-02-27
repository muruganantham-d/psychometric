import Card from "./ui/Card";
import Skeleton from "./ui/Skeleton";

function AssessmentSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <Card key={idx} className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
          <Skeleton className="h-4 w-40" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
            {Array.from({ length: 5 }).map((__, optionIdx) => (
              <Skeleton key={optionIdx} className="h-[72px] rounded-xl" />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

export default AssessmentSkeleton;
