'use client';

import { useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { commonIcons } from './common-icons';

/**
 * Custom hook for efficiently accessing Lucide icons by name
 * This allows us to create an optimized cache of icon components
 */
export function useLucideIcons() {
	// Create a memoized record of icon names to components
	// This ensures we only create this mapping once per component instance
	const iconRecord = useMemo(() => {
		return Object.entries(LucideIcons)
			.filter(([_, value]) => typeof value === 'function')
			.reduce(
				(acc, [name, component]) => {
					acc[name] = component as LucideIcon;
					return acc;
				},
				{} as Record<string, LucideIcon>,
			);
	}, []);

	/**
	 * Get an icon component by its name
	 * @param iconName The name of the Lucide icon
	 * @returns The icon component or a fallback icon
	 */
	const getIconByName = (iconName: string): LucideIcon => {
		// First check if the icon exists in our common icons
		// @ts-ignore - We know commonIcons may have the key
		if (commonIcons[iconName]) {
			// @ts-ignore - We know commonIcons may have the key
			return commonIcons[iconName];
		}

		// Try direct lookup in all Lucide icons
		let icon = iconRecord[iconName];

		// If not found, try case-insensitive lookup with proper casing
		if (!icon && typeof iconName === 'string') {
			// Find a case-insensitive match
			const iconKey = Object.keys(iconRecord).find(
				(key) => key.toLowerCase() === iconName.toLowerCase(),
			);

			if (iconKey) {
				icon = iconRecord[iconKey];
			}
		}

		// Only log in development to avoid cluttering production logs
		if (process.env.NODE_ENV === 'development' && !icon) {
			console.warn(`Icon not found: "${iconName}"`);
			console.log(`Looking for: "${iconName}" in available icons`);
			// Check if the icon exists in commonIcons
			console.log('Common icons:', Object.keys(commonIcons).join(', '));
		}

		return icon || LucideIcons.HelpCircle;
	};

	return {
		getIconByName,
	};
}
