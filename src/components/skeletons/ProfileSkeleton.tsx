import { Skeleton } from './Skeleton';
import { PAGE_TOP } from '@/lib/layout';

export default function ProfileSkeleton() {
  return (
    <section className={`${PAGE_TOP} pb-12 bg-gray-50`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-8 py-8">
            <div className="flex items-center space-x-6">
              <Skeleton className="h-[72px] w-[72px] rounded-full shrink-0" />
              <div className="space-y-3 flex-1">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-6 w-24 rounded" />
              </div>
            </div>
          </div>
          <div className="p-8 space-y-8">
            {['Personal Information', 'Delivery Address'].map((section) => (
              <div key={section}>
                <Skeleton className="h-6 w-44 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton
                      key={`${section}-${i}`}
                      className={`h-12 w-full ${i >= 4 ? 'md:col-span-2' : ''}`}
                    />
                  ))}
                </div>
              </div>
            ))}
            <Skeleton className="h-11 w-36 rounded-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
