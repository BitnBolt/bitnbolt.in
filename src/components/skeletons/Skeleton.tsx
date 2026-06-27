import { cn } from '@/lib/cn';

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-md bg-gray-200/90', className)} />;
}

export function SkeletonLine({ className }: SkeletonProps) {
  return <Skeleton className={cn('h-4', className)} />;
}
