import React from 'react';

interface SettingsSkeletonProps {
	count?: number;
}

export default function SettingsSkeleton({ count = 4 }: SettingsSkeletonProps) {
	return (
		<ul className="py-6 space-y-4">
			{Array.from({ length: count }).map((_, idx) => (
				<li key={`setting-skeleton-${idx}`}>
					<div className="flex items-center gap-4 py-4 px-5 min-h-[56px] border-b border-gray-100">
						<div className="w-6 h-6 bg-gray-200 rounded animate-pulse flex-shrink-0" />
						<div className="h-5 bg-gray-200 rounded flex-1 animate-pulse" />
					</div>
				</li>
			))}
		</ul>
	);
}
