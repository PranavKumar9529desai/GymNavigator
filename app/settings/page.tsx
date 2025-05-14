'use client';

import { ReactElement, useMemo, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { settingsMenuItems, Role, MenuItem } from './menuitems';
import SettingsHeader from './SettingsHeader';
import SettingsItem from './_components/SettingsItem';
import SettingsItemSkeleton from './_components/SettingsItemSkeleton';
import SettingsTitle from './_components/SettingsTitle';
import { ScrollArea } from '@/components/ui/scroll-area';

function LoadingSettingsItems() {
	return (
		<div className="space-y-3">
			<SettingsItemSkeleton />
			<SettingsItemSkeleton />
			<SettingsItemSkeleton />
		</div>
	);
}

function SettingsList() {
	const { data: session } = useSession();
	const role = session?.role as Role;

	// Use memoization to prevent unnecessary recalculation of menu items
	const items: MenuItem[] = useMemo(() => {
		return settingsMenuItems[role] || [];
	}, [role]);

	if (!session) {
		return <LoadingSettingsItems />;
	}

	return (
		<div className="space-y-4">
			{items.map((item) => (
				<SettingsItem
					key={item.path}
					icon={item.icon}
					label={item.label}
					href={item.path}
					description={item.description}
				/>
			))}
		</div>
	);
}

export default function SettingsIndexPage(): ReactElement {
	return (
		<section className="flex flex-col h-full">
			<SettingsHeader title="Settings" />
			<ScrollArea className="flex-1 px-4 pb-20 md:pb-6">
				<div className="max-w-2xl mx-auto py-6">
					{/* <SettingsTitle 
            title="Settings" 
            description="Manage your account settings and preferences" 
          /> */}
					<nav aria-label="Settings navigation">
						<Suspense fallback={<LoadingSettingsItems />}>
							<SettingsList />
						</Suspense>
					</nav>
				</div>
			</ScrollArea>
		</section>
	);
}
