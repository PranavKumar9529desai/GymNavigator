'use client';

import { AnimatePresence, m } from 'framer-motion';
import { Home, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '../../../../components/ui/skeleton';
import { useLucideIcons } from '../use-lucide-icons';
import { preloadCommonIcons } from '../common-icons';

interface SubrouteNavProps {
	subroutes: {
		name: string;
		href: string;
		icon: string;
	}[];
	status: 'loading' | 'unauthenticated' | 'authenticated';
}

const SubrouteNav: React.FC<SubrouteNavProps> = ({ subroutes, status }) => {
	const pathname = usePathname();
	const [, setIsScrolled] = useState(false);
	const [showLabels, setShowLabels] = useState(true);
	const { getIconByName } = useLucideIcons();

	// Call this to ensure common icons are included in the bundle
	// This is a no-op function at runtime but helps with optimization
	preloadCommonIcons();

	if (status === 'loading')
		return (
			<div className="flex items-center justify-center h-14">
				<Skeleton className="h-10 w-64 mx-auto" />
				<Skeleton className="h-10 w-64 mx-auto" />
				<Skeleton className="h-10 w-64 mx-auto" />
			</div>
		);

	// Listen for scroll events to hide text labels when scrolling down
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 20) {
				setIsScrolled(true);
				if (showLabels) setShowLabels(false);
			} else {
				setIsScrolled(false);
				if (!showLabels) setShowLabels(true);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [showLabels]);

	if (subroutes.length === 0) return null;

	return (
		<nav className="overflow-x-auto scrollbar-hide bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100">
			<div className="h-14 flex items-center justify-around md:justify-center md:gap-8 px-1">
				{subroutes.map((route) => {
					const isActive = pathname === route.href;
					// Ensure we're using exactly the same icon names as defined in Lucide
					// Lucide icons use PascalCase
					const IconComponent = getIconByName(route.icon) || Home;

					return (
						<Link
							key={route.href}
							href={route.href}
							className={`relative flex flex-col items-center justify-center h-full px-3 transition-all ${
								isActive ? 'text-blue-700' : 'text-gray-600 hover:text-blue-600'
							}`}
						>
							<div className="flex flex-col items-center">
								{/* Dynamic icon component */}
								<IconComponent className="w-5 h-5" />

								{/* Text label with smooth animation */}
								<AnimatePresence mode="wait">
									{showLabels && (
										<m.span
											initial={{ opacity: 0, y: -5, height: 0 }}
											animate={{ opacity: 1, y: 0, height: 'auto' }}
											exit={{ opacity: 0, y: -5, height: 0 }}
											transition={{ duration: 0.2 }}
											className="text-xs mt-1 whitespace-nowrap"
										>
											{route.name}
										</m.span>
									)}
								</AnimatePresence>
							</div>

							{/* Active indicator dot */}
							{isActive && (
								<m.div
									layoutId="activeRoute"
									className="absolute bottom-0 w-1.5 h-1.5 bg-blue-700 rounded-full"
									transition={{ type: 'spring', stiffness: 300, damping: 30 }}
								/>
							)}
						</Link>
					);
				})}
			</div>
		</nav>
	);
};

export default SubrouteNav;
