import { IsOwner } from '@/lib/is-owner'; // Assuming path alias @/lib
import { IsTrainer } from '@/lib/is-trainer'; // Assuming path alias @/lib
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type React from 'react';
import { auth } from '../(auth)/auth';
import DashboardBottomNav from './_components/DashboardBottomNav';
import DashboardTopBar from './_components/DashboardTopBar';
import { type MenuItem } from './_components/menuItems';
import { getDashboardMenuItems } from './_components/use-dashboard-menu';
import Sidebar from './_components/sidebar';
// Import the preload function for performance improvement
import { preloadCommonIcons } from './_components/common-icons';

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	const headersList = await headers();
	const pathname = headersList.get('x-next-pathname') || ''; // Get pathname

	// 1. Authentication Check (Safeguard)
	if (!session) {
		redirect('/signin');
	}

	// 2. Role Selection Check
	if (!session.role) {
		// Allow access to role selection page itself if needed, otherwise redirect
		if (pathname !== '/selectrole') {
			// Adjust if role selection path is different
			redirect('/selectrole');
		}
		// If on selectrole page, prevent further rendering of dashboard layout
		return null; // Or render a minimal loading/message state
	}

	// 3. Role-based Path Authorization & Base Redirection
	const role = session.role; // Use validated role

	if (pathname.startsWith('/dashboard/owner') && !IsOwner(session)) {
		redirect('/unauthorized');
	} else if (pathname.startsWith('/dashboard/trainer') && !IsTrainer(session)) {
		// Ensure only trainers access trainer section, specific checks (like gym) in trainer layout
		redirect('/unauthorized');
	} else if (pathname === '/dashboard' || pathname === '/dashboard/') {
		// Redirect from base dashboard to role-specific dashboard
		redirect(`/dashboard/${role.toLowerCase()}`);
	}
	// Note: Client role access is implicitly allowed if not owner/trainer path

	// Trainer-specific checks (like gym selection) are moved to trainer layout

	// Get menu items efficiently using the optimized function
	const menuItems = getDashboardMenuItems(role);

	// This is a no-op at runtime but helps with bundling optimization
	// It ensures common icons are available immediately for faster rendering
	preloadCommonIcons();

	return (
		<div className="flex h-screen bg-gray-50">
			{/* Server-rendered sidebar - visible only on desktop */}
			<div className="hidden md:block h-screen">
				<Sidebar menuItems={menuItems} />
			</div>

			{/* Removed overflow-hidden to allow sticky positioning below */}
			<div className="w-full flex flex-col">
				{/* Main content area with proper height calculations */}
				<div className="flex-1 overflow-y-auto scroll-container relative pb-16 md:pb-0">
					{/* Original Topbar (conditionally rendered for mobile) */}
					{/* The Topbar component itself now handles the sticky behavior */}
					<DashboardTopBar />

					{/* Original Content */}
					<div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
						{children}
					</div>
				</div>
			</div>

			{/* Bottom navigation - visible only on mobile */}
			<div className="md:hidden">
				<DashboardBottomNav />
			</div>
		</div>
	);
}
