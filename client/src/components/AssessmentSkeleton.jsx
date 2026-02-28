import Card from "./ui/Card";
import Skeleton from "./ui/Skeleton";

function AssessmentSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 3 }).map((_, idx) => (
        <Card key={idx} className="space-y-6 p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-2xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-11/12" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            {Array.from({ length: 5 }).map((__, optionIdx) => (
              <Skeleton key={optionIdx} className="h-[88px] rounded-3xl sm:h-[132px]" />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

export default AssessmentSkeleton;
