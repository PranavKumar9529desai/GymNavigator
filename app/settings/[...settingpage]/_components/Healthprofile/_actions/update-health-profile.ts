'use server';

import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';
import { HealthProfile, UserHealthprofile } from './get-client-healthprofie';
import { revalidatePath } from 'next/cache';

export interface UpdateHealthProfileResponse {
	success: boolean;
	error?: string;
}

export async function updateHealthProfile(
	profileData: Partial<UserHealthprofile>,
): Promise<UpdateHealthProfileResponse> {
	try {
		const clientAxios = await ClientReqConfig();

		// Flatten the nested structure for API consumption
		const flattenedData = {
			// General
			gender: profileData.General?.gender,
			age: profileData.General?.age,
			heightValue: profileData.General?.heightValue,
			heightUnit: profileData.General?.heightUnit,
			weightValue: profileData.General?.weightValue,
			weightUnit: profileData.General?.weightUnit,

			// Activity
			activityLevel: profileData.Activity?.activityLevel,

			// Dietary
			dietaryPreference: profileData.Dietary?.dietaryPreference,
			otherDietaryPreference: profileData.Dietary?.otherDietaryPreference,
			nonVegDays: profileData.Dietary?.nonVegDays
				? JSON.stringify(profileData.Dietary.nonVegDays)
				: undefined,
			MealTimes: profileData.Dietary?.MealTimes,
			mealTimings: profileData.Dietary?.mealTimings,
			dietaryRestrictions: profileData.Dietary?.dietaryRestrictions
				? JSON.stringify(profileData.Dietary.dietaryRestrictions)
				: undefined,

			// Medical
			allergies: profileData.Medical?.allergies
				? JSON.stringify(profileData.Medical.allergies)
				: undefined,
			otherAllergy: profileData.Medical?.otherAllergy,
			medicalConditions: profileData.Medical?.medicalConditions
				? JSON.stringify(profileData.Medical.medicalConditions)
				: undefined,
			otherMedicalCondition: profileData.Medical?.otherMedicalCondition,

			// Religious
			religiousPreference: profileData.Religious?.religiousPreference,
			otherReligiousPreference: profileData.Religious?.otherReligiousPreference,
		};

		const response = await clientAxios.put(
			'/profile/updatehealthprofile',
			flattenedData,
		);

		if (response.data.success) {
			// Revalidate paths that may depend on this data
			revalidatePath('/settings');

			return {
				success: true,
			};
		}

		return {
			success: false,
			error: response.data.error || 'Failed to update profile',
		};
	} catch (error) {
		console.error('Error updating health profile:', error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'An unknown error occurred',
		};
	}
}
