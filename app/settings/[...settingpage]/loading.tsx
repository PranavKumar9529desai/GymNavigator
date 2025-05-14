import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<section className="px-4 py-6 pb-20 md:pb-6">
			<div className="max-w-2xl mx-auto">
				<Skeleton className="h-8 w-48 mb-6 bg-gray-100" />
				<div className="space-y-6">
					<div className="border-b border-gray-100 pb-6">
						<Skeleton className="h-6 w-36 mb-3 bg-gray-100" />
						<Skeleton className="h-4 w-full max-w-md mb-4 bg-gray-100" />
						<Skeleton className="h-12 w-full md:w-32 bg-gray-100" />
					</div>
					<div className="border-b border-gray-100 pb-6">
						<Skeleton className="h-6 w-36 mb-3 bg-gray-100" />
						<Skeleton className="h-4 w-full max-w-md mb-4 bg-gray-100" />
						<Skeleton className="h-12 w-full md:w-32 bg-gray-100" />
					</div>
					<div className="border-b border-gray-100 pb-6">
						<Skeleton className="h-6 w-36 mb-3 bg-gray-100" />
						<Skeleton className="h-4 w-full max-w-md mb-4 bg-gray-100" />
						<Skeleton className="h-12 w-full md:w-32 bg-gray-100" />
					</div>
				</div>
			</div>
		</section>
	);
}
