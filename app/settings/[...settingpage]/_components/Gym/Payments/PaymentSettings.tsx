'use client';

import SettingsEditButton from '@/app/settings/_components/SettingsEditButton';
import SettingsSection from '@/app/settings/_components/SettingsSection';

export default function PaymentSettings() {
	return (
		<section className="px-4 py-6 pb-20 md:pb-6">
			<div className="max-w-2xl mx-auto">
				<h2 className="text-xl font-semibold mb-6">Payment Settings</h2>
				<div className="space-y-6">
					<SettingsSection
						title="Payment Methods"
						description="Manage your payment methods and preferences."
					>
						<SettingsEditButton
							className="mt-4"
							label="Manage Methods"
							aria-label="Manage payment methods"
						/>
					</SettingsSection>

					<SettingsSection
						title="Billing History"
						description="View your past transactions and billing details."
						noBorder
					>
						<SettingsEditButton
							className="mt-4"
							label="View History"
							aria-label="View billing history"
						/>
					</SettingsSection>
				</div>
			</div>
		</section>
	);
}
