import type { Metadata } from 'next';
import { auth } from '@/app/(auth)/auth';
import SettingsMenu from './_components/SettingsMenu';
import DashboardBottomNav from '@/app/dashboard/_components/DashboardBottomNav';
import { ReactNode } from 'react';
import { settingsMenuItems } from './menuitems';

export const metadata: Metadata = {
	title: 'Settings',
};

interface SettingsLayoutProps {
	children: ReactNode;
}

export default async function SettingsLayout({
	children,
}: SettingsLayoutProps) {
	const session = await auth();
	const role = session?.role as 'owner' | 'client' | 'trainer';
	const menuItems = settingsMenuItems[role] || [];

	return (
		<div className="flex min-h-screen bg-white">
			{/* Sidebar for desktop */}
			<aside className="hidden md:block w-60 border-r bg-gray-50 p-4">
				<SettingsMenu items={menuItems} />
			</aside>

			{/* Main content */}
			<main className="flex-1 pb-20 md:p-6 w-full">{children}</main>

			{/* Bottom nav for mobile */}
		</div>
	);
}
