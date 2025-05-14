import { useMemo } from 'react';
import type { MenuItem } from './menuItems';
import {
	OwnerDashboardMenuItems,
	TrainerDashboardMenuItems,
	ClientDashboardMenuItems,
} from './menuItems';

// Role type for the application
type UserRole = 'owner' | 'trainer' | 'client';

// Pre-map menu items to roles for faster lookup
const ROLE_MENU_MAP: Record<UserRole, MenuItem[]> = {
	owner: OwnerDashboardMenuItems,
	trainer: TrainerDashboardMenuItems,
	client: ClientDashboardMenuItems,
};

/**
 * Custom hook that returns the appropriate menu items based on user role
 * This is more efficient than using a switch statement on each render
 */
export function useDashboardMenu(role: string): MenuItem[] {
	// Use lowercase role to match our keys
	const normalizedRole = role.toLowerCase() as UserRole;

	// Use useMemo to avoid re-creating the menu items on each render
	return useMemo(() => {
		// Direct object lookup is faster than switch statement
		return ROLE_MENU_MAP[normalizedRole] || [];
	}, [normalizedRole]);
}

/**
 * Server-side function to get menu items without React hooks
 * This provides the same optimization for server components
 */
export function getDashboardMenuItems(role: string): MenuItem[] {
	// Use lowercase role to match our keys
	const normalizedRole = role.toLowerCase() as UserRole;

	// Direct object lookup is faster than switch statement
	return ROLE_MENU_MAP[normalizedRole] || [];
}
