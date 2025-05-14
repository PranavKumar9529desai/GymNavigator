'use client';

import SettingsEditButton from '@/app/settings/_components/SettingsEditButton';
import SettingsSection from '@/app/settings/_components/SettingsSection';

export default function TrainerSettings() {
	return (
		<section className="px-4 py-6 pb-20 md:pb-6">
			<div className="max-w-2xl mx-auto">
				<h2 className="text-xl font-semibold mb-6">Trainer Settings</h2>
				<div className="space-y-6">
					<SettingsSection
						title="Profile Information"
						description="Update your trainer profile and credentials."
					>
						<SettingsEditButton
							className="mt-4"
							label="Edit Profile"
							aria-label="Edit profile information"
						/>
					</SettingsSection>

					<SettingsSection
						title="Availability"
						description="Set your availability and working hours."
						noBorder
					>
						<SettingsEditButton
							className="mt-4"
							label="Edit Availability"
							aria-label="Edit availability"
						/>
					</SettingsSection>
				</div>
			</div>
		</section>
	);
}
