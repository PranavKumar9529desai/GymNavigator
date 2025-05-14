// Common dashboard icons preloaded for better performance
// This module helps to explicitly import the most commonly used icons
// to ensure they're available in the first render pass

import {
	Building2,
	CalendarCheck,
	ChevronDown,
	ChevronRight,
	ClipboardCheck,
	ClipboardList,
	Dumbbell,
	Eye,
	HelpCircle,
	Home,
	ListChecks,
	LogOut,
	Plus,
	QrCode,
	ShoppingBasket,
	MapPin,
	UserCheck,
	UserPlus,
	Users,
	UtensilsCrossed,
} from 'lucide-react';

// These exports will be tree-shaken if unused
export const commonIcons = {
	Building2,
	CalendarCheck,
	ChevronDown,
	ChevronRight,
	ClipboardCheck,
	ClipboardList,
	Dumbbell,
	Eye,
	HelpCircle,
	Home,
	ListChecks,
	LogOut,
	Plus,
	QrCode,
	ShoppingBasket,
	MapPin,
	UserCheck,
	UserPlus,
	Users,
	UtensilsCrossed,
};

// No-op function that can be called to ensure icons are loaded
// This is useful for preloading icons in server components
export function preloadCommonIcons() {
	// This function doesn't actually do anything at runtime
	// It's just to ensure the icons are included in the bundle
	return null;
}

// Export an array of icon names for validation purposes
export const commonIconNames = Object.keys(commonIcons);
