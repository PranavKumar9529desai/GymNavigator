'use client'; // Keep for usePathname

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { FC } from 'react';
// Removed unused hooks: useEffect, useRef, useState
import { Skeleton } from '../../../../components/ui/skeleton';
// Removed unused cn import
import type { MenuItem } from '../menuItems';
import NotificationButton from './NotificationButton';
import QRCodeButton from './QRCodeButton';
import SubrouteNav from './SubrouteNav';
import UserMenuButton from './UserMenuButton';

interface TopbarProps {
	gymName?: string;
	userRole?: string;
	menuItems: MenuItem[];
	status: 'loading' | 'unauthenticated' | 'authenticated';
}

const Topbar: FC<TopbarProps> = ({
	gymName = 'GymNavigator',
	userRole,
	menuItems,
	status,
}) => {
	const pathname = usePathname();
	// Removed Intersection Observer state and ref

	// First, extract the main route segment from the pathname
	// For example, from "/dashboard/owner/onboarding/onboardingqr" we want to extract "onboarding"
	const pathSegments = pathname.split('/').filter(Boolean);
	const mainRouteSegment = pathSegments.length >= 3 ? pathSegments[2] : '';

	// Find the active menu item by matching the main route segment with menu items
	const activeMenuItem = menuItems.find((item) => {
		// Extract the main route segment from the menu item link
		const itemLinkSegments = (item.link || '').split('/').filter(Boolean);
		const itemMainSegment =
			itemLinkSegments.length >= 3 ? itemLinkSegments[2] : '';

		// Check if the main route segment matches
		return (
			mainRouteSegment === itemMainSegment ||
			// Also check if any of the subitems match the current path
			(item.subItems?.some((subItem) => pathname.includes(subItem.link)) ??
				false)
		);
	}); // Get subroutes from the active menu item
	const subroutes =
		activeMenuItem?.subItems?.map((subItem) => ({
			name: subItem.name,
			href: subItem.link,
			// Ensure iconName is passed correctly (Lucide icons use PascalCase)
			icon: subItem.iconName || 'Home',
		})) || [];

	return (
		<>
			{/* Part 1: Scrolls away (Logo, Name, Buttons) */}
			<div
				className="h-12 md:h-16 flex items-center justify-between px-4 border-b border-blue-100 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 pt-2
        sm:hidden
      "
			>
				<div className="flex items-center space-x-3">
					<div className="relative h-9 w-9 rounded-md overflow-hidden shadow-sm">
						<Image
							src="/apple-touch-icon.png"
							alt="Gym Logo"
							fill
							sizes="(max-width: 768px) 36px, 36px"
							className="object-cover"
							priority
						/>
					</div>
					<div>
						<h1 className="font-bold text-lg tracking-tight text-blue-900">
							{gymName}
						</h1>
						{userRole ? (
							<div className="flex items-center">
								<span className="h-2 w-2 rounded-full bg-green-500 mr-1.5" />
								<p className="text-xs text-blue-700 capitalize">{userRole}</p>
							</div>
						) : (
							<Skeleton className="h-2 w-24 mx-auto bg-transparent" />
						)}
					</div>
				</div>
				<div className="flex items-center space-x-2">
					<NotificationButton />
					<QRCodeButton userRole={userRole} />
					<UserMenuButton />
				</div>
			</div>

			{/* Part 2: Sticks to the top (Subroute Navigation) */}
			<div className="sticky top-0 z-10  bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 shadow-md sm:hidden">
				{' '}
				{/* Added shadow here */}
				{status === 'loading' ? (
					<Skeleton className="h-10 w-64 mx-auto bg-transparent" />
				) : (
					<SubrouteNav subroutes={subroutes} status={status} />
				)}
			</div>
		</>
	);
};

export default Topbar;
