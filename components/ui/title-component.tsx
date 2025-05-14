'use client';

import { useEffect } from 'react';

interface TitleComponentProps {
	/**
	 * The title to be displayed in the browser tab
	 */
	title: string;

	/**
	 * Optional meta description for SEO
	 * Note: For static metadata, prefer using Next.js Metadata API in layout.ts or page.ts files
	 */
	description?: string;
}

/**
 * Component for setting page title dynamically on the client side
 * Updates the document title when needed in client components
 *
 * Note: For most cases in Next.js App Router, use the built-in Metadata API in your
 * layout.tsx or page.tsx files instead:
 *
 * export const metadata = {
 *   title: 'Page Title',
 *   description: 'Page description'
 * }
 *
 * This component is mainly useful for dynamic titles in client components
 * where the title needs to change based on user interaction or data fetching.
 *
 * @param props - Component properties
 * @returns null - This component only has side effects and doesn't render anything
 */
export default function TitleComponent({
	title,
	description,
}: TitleComponentProps) {
	// Update the document title when component mounts or title changes
	useEffect(() => {
		// Set the document title with GymNavigator suffix for consistency
		document.title = `${title} | GymNavigator`;

		// Update meta description if provided (optional)
		if (description) {
			const metaDescription = document.querySelector(
				'meta[name="description"]',
			);
			if (metaDescription) {
				metaDescription.setAttribute('content', description);
			} else {
				const meta = document.createElement('meta');
				meta.name = 'description';
				meta.content = description;
				document.head.appendChild(meta);
			}
		}
	}, [title, description]);

	// This component doesn't render anything, it just has side effects
	return null;
}
