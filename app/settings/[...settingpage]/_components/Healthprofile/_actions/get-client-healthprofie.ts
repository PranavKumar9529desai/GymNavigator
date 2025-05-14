'use server';

import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';

// Define interfaces for structured data
interface DaySelection {
	day: string;
	selected: boolean;
}

export interface Selection {
	id: string;
	name: string;
	selected: boolean;
}

export interface UserHealthprofile {
	General: {
		weightValue: number;
		heightValue: number;
		gender: string;
		age: number;
		heightUnit: string;
		weightUnit: string;
	};
	Activity: {
		activityLevel: string;
	};
	Dietary: {
		dietaryPreference: string;
		otherDietaryPreference?: string;
		nonVegDays?: DaySelection[] | string;
		MealTimes: string;
		mealTimings?: string;
		dietaryRestrictions?: Selection[] | string; // Can be parsed array or string
		otherDietaryRestrictions?: string;
		// Can be parsed array or string
	};
	Medical: {
		allergies: Selection[] | string; // Can be parsed array or string
		otherAllergy?: string;

		medicalConditions: Selection[] | string; // Can be parsed array or string
		otherMedicalCondition?: string;
	};
	Religious: {
		religiousPreference?: string;
		otherReligiousPreference?: string;
	};
}

// Updated HealthProfile interface to reflect the complete profile structure
export interface HealthProfile {
	// basic fields
	weightValue: number;
	heightValue: number;
	gender: string;
	age: number;
	// additional fields from UserHealthprofile
	activityLevel: string;
	heightUnit: string;
	weightUnit: string;
	dietaryPreference: string;
	otherDietaryPreference?: string;
	nonVegDays?: DaySelection[] | string; // Can be parsed array or string
	allergies: Selection[] | string; // Can be parsed array or string
	otherAllergy?: string;
	mealTimes: string;
	mealTimings?: string;
	medicalConditions: Selection[] | string; // Can be parsed array or string
	otherMedicalCondition?: string;
	religiousPreference?: string;
	otherReligiousPreference?: string;
	dietaryRestrictions?: Selection[] | string; // Can be parsed array or string
	bmi?: number;
	bmr?: number;
	tdee?: number;
	createdAt?: string;
	updatedAt?: string;
	fullname?: string;
	contact?: string;
	goal?: string; // Added missing goal property
}

// Helper function to safely parse JSON strings
function safeJsonParse<T>(
	jsonString: string | null | undefined,
	fallback: T,
): T {
	if (!jsonString) return fallback;
	try {
		return JSON.parse(jsonString) as T;
	} catch (error) {
		console.error('Error parsing JSON string:', error);
		return fallback;
	}
}

export async function gethealthprofileById() {
	const clientAxios = await ClientReqConfig();

	try {
		// console.log("Fetching health profile for user ID:", userId);
		const response = await clientAxios.get(`/profile/gethealthprofile`);
		const data = response.data;
		console.log('Health Profile Response:', data);

		if (data.success) {
			// Parse JSON string fields before returning
			const healthProfile = data.data;
			console.log('Health Profile Data:', healthProfile);
			// Map the flat healthProfile data to the nested UserHealthprofile structure
			const userHealthProfile: UserHealthprofile = {
				General: {
					weightValue: healthProfile.weightValue,
					heightValue: healthProfile.heightValue,
					gender: healthProfile.gender,
					age: healthProfile.age,
					heightUnit: healthProfile.heightUnit,
					weightUnit: healthProfile.weightUnit,
				},
				Activity: {
					activityLevel: healthProfile.activityLevel,
				},
				Dietary: {
					dietaryPreference: healthProfile.dietaryPreference,
					otherDietaryPreference: healthProfile.otherDietaryPreference,
					nonVegDays: safeJsonParse<DaySelection[] | string>(
						healthProfile.nonVegDays,
						[],
					),
					MealTimes: healthProfile.mealTimes, // Note: Property name mismatch (MealTimes vs mealTimes)
					mealTimings: healthProfile.mealTimings,
					dietaryRestrictions: safeJsonParse<Selection[] | string>(
						healthProfile.dietaryRestrictions,
						[],
					),
					otherDietaryRestrictions: healthProfile.otherDietaryRestrictions,
				},
				Medical: {
					allergies: safeJsonParse<Selection[] | string>(
						healthProfile.allergies,
						[],
					),
					otherAllergy: healthProfile.otherAllergy,
					medicalConditions: safeJsonParse<Selection[] | string>(
						healthProfile.medicalConditions,
						[],
					),
					otherMedicalCondition: healthProfile.otherMedicalCondition,
				},
				Religious: {
					religiousPreference: healthProfile.religiousPreference,
					otherReligiousPreference: healthProfile.otherReligiousPreference,
				},
			};

			return {
				success: true,
				data: userHealthProfile,
			};
		}

		return {
			success: false,
			error: data.msg || 'Failed to fetch health profile',
		};
	} catch (error) {
		console.error('Error fetching health profile by ID:', error);
		return {
			success: false,
			error: 'Failed to fetch health profile',
		};
	}
}
