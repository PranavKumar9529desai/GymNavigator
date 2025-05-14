'use client';

import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SettingsEditButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	label?: string;
	fullWidth?: boolean;
}

export default function SettingsEditButton({
	label = 'Edit',
	fullWidth = true,
	className,
	...props
}: SettingsEditButtonProps) {
	return (
		<button
			className={cn(
				'bg-blue-600 text-white py-3 px-4 rounded-md min-h-[44px]',
				'hover:bg-blue-700 transition-colors',
				'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
				'active:bg-blue-800',
				fullWidth ? 'w-full md:w-auto' : '',
				className,
			)}
			{...props}
		>
			{label}
		</button>
	);
}
