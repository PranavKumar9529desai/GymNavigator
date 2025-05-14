'use client';

import BottomNavigation from '@/components/common/Bottomnavigation/bottomnavigation';
import { useSession } from 'next-auth/react';
import { useDashboardMenu } from './use-dashboard-menu';
import { useMenuPerformanceMetrics } from './use-menu-performance';

export default function DashboardBottomNav() {
	const { data: session } = useSession();

	// Use our optimized hook to get menu items - efficient and memoized
	const menuItems = useDashboardMenu(session?.role || 'client');

	// // Temporarily disable performance metrics to avoid excessive renders
	// useMenuPerformanceMetrics('BottomNav');

	return <BottomNavigation menuItems={menuItems} />;
}
