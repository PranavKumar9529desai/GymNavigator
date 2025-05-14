'use server';

import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import Error from 'next/error';

export interface CompleteUserInfo {
	id: string;
	name: string;
	email: string;
	createdAt: string;
	updatedAt: string;
	role: string;
	HealthProfile: {
		id: number;
		gender: string;
		age: number;
		goal: string;
		activityLevel: string;
		heightValue: number;
		heightUnit: string;
		weightValue: number;
		weightUnit: string;
		dietaryPreference: string;
		otherDietaryPreference?: string;
		nonVegDays?: { day: string; selected: boolean }[];
		allergies: { id: string; name: string; selected: boolean }[];
		otherAllergy?: string;
		mealTimes: string;
		mealTimings?: { name: string; time: string }[];
		medicalConditions: { id: string; name: string; selected: boolean }[];
		otherMedicalCondition?: string;
		religiousPreference?: string;
		otherReligiousPreference?: string;
		dietaryRestrictions?: string[];
		bmi?: number;
		bmr?: number;
		tdee?: number;
		createdAt: string;
		updatedAt: string;
	} | null;
	activeWorkoutPlan: {
		id: number;
		name: string;
		description?: string;
		createdAt: string;
		updatedAt: string;
	} | null;
	hasActiveWorkoutPlan: boolean;
	DietPlan: {
		id: number;
		name: string;
		description?: string;
		totalCalories: number;
		protein: number;
		carbs: number;
		fat: number;
		createdAt: string;
		updatedAt: string;
	} | null;
}

export async function getUserCompleteInfo(userId: string): Promise<{
	success: boolean;
	data?: CompleteUserInfo;
	error?: { code: string; message: string };
}> {
	try {
		const axiosInstance = await TrainerReqConfig();
		const response = await axiosInstance.get(`/client/${userId}/complete`);

		if (response.data.msg === 'success') {
			return {
				success: true,
				data: response.data.user,
			};
		}

		return {
			success: false,
			error: {
				code: 'FETCH_ERROR',
				message: response.data.msg || 'Failed to fetch user information',
			},
		};
		// @ts-ignore
	} catch (error: any) {
		console.error('Error fetching user complete info:', error);
		return {
			success: false,
			error: {
				code: 'UNEXPECTED_ERROR',
				message: error.message || 'An unexpected error occurred',
			},
		};
	}
}
