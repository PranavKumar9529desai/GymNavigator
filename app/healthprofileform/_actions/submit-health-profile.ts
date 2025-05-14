'use server';

import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';
import {
	type ActivityLevel,
	HealthProfileState,
} from '../_store/health-profile-store';
import type { HealthMetrics } from '../calculate-health-data/health-data-types';
import { HealthProfileSubmissionResponse } from './types';
// Define a type that matches what we need for the API request

export interface HealthProfileFormDataSubmissionType {
	// Renamed property to match backend type
	healthProfileFormData: HealthProfileApiRequest;
	healthMetrics: HealthMetrics;
}

export interface HealthProfileApiRequest {
	gender: string;
	age: number;
	activityLevel: ActivityLevel; // Use the ActivityLevel type for consistency
	height: { value: number; unit: string };
	weight: { value: number; unit: string };
	goal: string;
	otherGoal?: string;
	dietaryPreference: string;
	otherDietaryPreference?: string;
	nonVegDays?: Array<{ day: string; selected: boolean }>;
	allergies: Array<{ id: string; name: string; selected: boolean }>;
	otherAllergy?: string;
	mealTimes: string;
	mealTimings: Array<{ name: string; time: string }>;
	medicalConditions: Array<{ id: string; name: string; selected: boolean }>;
	otherMedicalCondition?: string;
	religiousPreference: string | null;
	otherReligiousPreference?: string;
	dietaryRestrictions?: string[];
}

export interface HealthProfileResponse {
	success: boolean;
	data?: HealthProfileFormDataSubmissionType;
	error?: string;
	details?: string;
}

export const submitHealthProfileToApi = async (
	healthProfileFormDataSubmissionType: HealthProfileFormDataSubmissionType,
): Promise<HealthProfileResponse> => {
	try {
		const clientAxios = await ClientReqConfig();
		// console.log("Sending profileData: ", profileData);
		const response = await clientAxios.post<HealthProfileResponse>(
			'/profile/healthprofileform',
			healthProfileFormDataSubmissionType,
		);

		return response.data;
	} catch (error) {
		console.error('Error submitting health profile data:', error);
		return {
			success: false,
			error: 'Failed to submit health profile data',
			details: error instanceof Error ? error.message : 'Unknown error',
		};
	}
};
