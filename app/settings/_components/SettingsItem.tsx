'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsItemProps {
	icon?: ReactNode;
	label: string;
	href: string;
	description?: string;
	className?: string;
}

export default function SettingsItem({
	icon,
	label,
	href,
	description,
	className,
}: SettingsItemProps) {
	return (
		<Link
			href={href}
			className={cn(
				'flex items-center justify-between p-4 min-h-[68px] transition-colors  hover:border-primary/20 hover:bg-accent rounded-lg group bg-card',
				className,
			)}
		>
			<div className="flex items-center gap-4">
				{icon && (
					<div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
						{icon}
					</div>
				)}
				<div>
					<p className="font-medium text-foreground">{label}</p>
					{description && (
						<p className="text-sm text-muted-foreground mt-0.5 max-w-[250px] sm:max-w-full">
							{description}
						</p>
					)}
				</div>
			</div>
			<ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
		</Link>
	);
}
