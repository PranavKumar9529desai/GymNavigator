'use client';

import SettingsHeader from './SettingsHeader';
import SettingsItemSkeleton from './_components/SettingsItemSkeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function Loading() {
	const renderCategorySkeleton = (index: number) => (
		<div key={`category-skeleton-${index}`} className="space-y-4 mb-8">
			<div className="space-y-1">
				<Skeleton className="h-6 w-36" />
				<Skeleton className="h-4 w-72" />
			</div>
			<Separator className="my-4" />
			<div className="space-y-3">
				<SettingsItemSkeleton />
				<SettingsItemSkeleton />
				{index === 0 && <SettingsItemSkeleton />}
			</div>
		</div>
	);

	return (
		<section className="flex flex-col h-full">
			<SettingsHeader title="Settings" />
			<ScrollArea className="flex-1 px-4 pb-20 md:pb-6">
				<div className="max-w-2xl mx-auto py-6">
					<div className="space-y-2 mb-6">
						<Skeleton className="h-8 w-32" />
						<Skeleton className="h-4 w-72" />
					</div>

					{[0, 1, 2].map((index) => renderCategorySkeleton(index))}
				</div>
			</ScrollArea>
		</section>
	);
}
