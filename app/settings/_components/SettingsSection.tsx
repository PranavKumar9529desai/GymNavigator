'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SettingsSectionProps {
	title: string;
	description: string;
	children?: ReactNode;
	className?: string;
	noBorder?: boolean;
}

export default function SettingsSection({
	title,
	description,
	children,
	className,
	noBorder = false,
}: SettingsSectionProps) {
	return (
		<div
			className={cn('pb-6', !noBorder && 'border-b border-gray-100', className)}
		>
			<h3 className="text-lg font-medium mb-3">{title}</h3>
			<p className="text-gray-600 mb-4">{description}</p>
			{children}
		</div>
	);
}
