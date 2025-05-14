import { Children } from 'react';
import SettingsHeader from '../SettingsHeader';

interface SettingsLayoutProps {
	children: React.ReactNode;
	params: Promise<{ settingpage: string[] }>; // Update params type to string[]
}
export default async function SettingsLayout({
	children,
	params,
}: SettingsLayoutProps) {
	const settingParams = (await params).settingpage;
	const mainPage = settingParams[0] as string;

	// Capitalize the first letter of the title for better presentation
	const formattedTitle = mainPage.charAt(0).toUpperCase() + mainPage.slice(1);

	return (
		<>
			<SettingsHeader title={formattedTitle} />
			<main>{children}</main>
		</>
	);
}
