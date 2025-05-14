'use client';

import { ReactNode } from 'react';
import { Separator } from '@/components/ui/separator';

interface SettingsCategoryProps {
	title: string;
	description?: string;
	children: ReactNode;
}

export default function SettingsCategory({
	title,
	description,
	children,
}: SettingsCategoryProps) {
	return (
		<div className="space-y-4 mb-8">
			<div className="space-y-1">
				<h2 className="text-lg font-medium tracking-tight">{title}</h2>
				{description && (
					<p className="text-sm text-muted-foreground">{description}</p>
				)}
			</div>
			<Separator className="my-4" />
			<div className="space-y-3">{children}</div>
		</div>
	);
}
