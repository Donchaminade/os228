"use client";

import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

export default function ProjectCardSkeleton() {
  return (
    <Card className="animate-pulse cursor-pointer">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            <Skeleton className="h-5 w-32" />
          </CardTitle>
          <div className="flex gap-2">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-6 w-12 rounded" />
          <Skeleton className="h-6 w-16 rounded" />
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="ghost" disabled>
          <Skeleton className="h-4 w-20" />
        </Button>
      </CardFooter>
    </Card>
  );
}
