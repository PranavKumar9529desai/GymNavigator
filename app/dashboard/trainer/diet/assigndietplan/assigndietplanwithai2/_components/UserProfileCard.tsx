'use client';

import { useState } from 'react';
import type { HealthProfile } from '../_actions/get-healthprofile-by-id';
import { HealthConditionsSection } from './profile/HealthConditionsSection';
import { HealthMetricsSection } from './profile/HealthMetricsSection';
import { MealsSection } from './profile/MealsSection';
import { PreferencesSection } from './profile/PreferencesSection';
import { ProfileHeader } from './profile/ProfileHeader';

interface UserProfileCardProps {
	profile?: HealthProfile;
}

export function UserProfileCard({ profile }: UserProfileCardProps) {
	const [showMore, setShowMore] = useState(false);

	// Helper function to ensure we always pass string arrays to components
	// @ts-ignore
	const ensureStringArray = (value: any): string[] => {
		if (!value) return [];
		if (Array.isArray(value)) {
			// If it's an array of Selection objects, extract the names
			if (
				value.length > 0 &&
				typeof value[0] === 'object' &&
				'name' in value[0]
			) {
				return value.filter((item) => item.selected).map((item) => item.name);
			}
			// If it's already a string array, return it
			return value;
		}
		// If it's a string, convert to array with single item
		if (typeof value === 'string') {
			return [value];
		}
		return [];
	};

	return (
		<div className="bg-white rounded-lg shadow-sm overflow-hidden border border-blue-100">
			{/* Profile Section - Avatar, Name, Contact */}
			<ProfileHeader fullname={profile?.fullname} contact={profile?.contact} />

			{/* Health Metrics Section */}
			<HealthMetricsSection profile={profile} />

			{/* Meals Section */}
			<MealsSection profile={profile} />

			{/* Show More Button */}
			<button
				onClick={() => setShowMore(!showMore)}
				className="w-full py-3 text-center text-blue-600 font-medium hover:bg-blue-50 transition-colors border-t border-blue-100"
			>
				{showMore ? 'Show Less' : 'Show More'}
			</button>

			{/* Health Conditions and Preferences (visible when Show More is clicked) */}
			{showMore && (
				<>
					{/* Health Conditions Section */}
					<HealthConditionsSection
						medicalConditions={ensureStringArray(profile?.medicalConditions)}
						otherMedicalCondition={profile?.otherMedicalCondition}
					/>

					{/* Preferences Section */}
					<PreferencesSection
						activityLevel={profile?.activityLevel}
						allergies={ensureStringArray(profile?.allergies)}
						otherAllergy={profile?.otherAllergy}
						religiousPreference={profile?.religiousPreference}
						otherReligiousPreference={profile?.otherReligiousPreference}
						dietaryRestrictions={ensureStringArray(
							profile?.dietaryRestrictions,
						)}
					/>
				</>
			)}
		</div>
	);
}
