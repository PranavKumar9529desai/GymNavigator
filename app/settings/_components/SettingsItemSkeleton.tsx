'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsItemSkeleton() {
	return (
		<div className="flex items-center justify-between p-4 rounded-lg border bg-card">
			<div className="flex items-center gap-4">
				<Skeleton className="h-10 w-10 rounded-full" />
				<div className="space-y-2">
					<Skeleton className="h-5 w-36" />
					<Skeleton className="h-4 w-72" />
				</div>
			</div>
			<Skeleton className="h-5 w-5 rounded-full" />
		</div>
	);
}
