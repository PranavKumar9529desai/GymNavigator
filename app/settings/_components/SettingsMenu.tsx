'use client';

import Link from 'next/link';
import { MenuItem } from '../menuitems';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface SettingsMenuProps {
	items: MenuItem[];
}

// Use memo to prevent unnecessary re-renders
const SettingsMenu = memo(function SettingsMenu({ items }: SettingsMenuProps) {
	return (
		<nav aria-label="Settings sidebar navigation">
			<ul className="space-y-3">
				{items.map((item) => (
					<li key={item.path}>
						<Link href={item.path} className="block">
							<div
								className={cn(
									'flex items-center gap-4 py-3 px-4 min-h-[50px] transition-colors',
									'hover:bg-gray-100',
									'focus:outline-none focus:ring-2 focus:ring-blue-500',
									'active:bg-gray-200',
								)}
							>
								{item.icon && (
									<span className="w-6 h-6 text-gray-600 flex-shrink-0">
										{item.icon}
									</span>
								)}
								<span className="text-base font-medium text-gray-800">
									{item.label}
								</span>
							</div>
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
});

export default SettingsMenu;
