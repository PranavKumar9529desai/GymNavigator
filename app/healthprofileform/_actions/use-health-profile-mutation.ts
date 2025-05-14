'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
	DietaryPreference,
	GoalType,
	type HealthProfileState,
	type MealTimes,
	ReligiousPreference,
} from '../_store/health-profile-store';
import { calculateHealthMetrics } from '../calculate-health-data/calculate-all-metrics';
import type { HealthMetrics } from '../calculate-health-data/health-data-types';
import {
	HealthProfileResponse,
	submitHealthProfileToApi,
} from './submit-health-profile';

// Update the schema to make targetWeight optional or handle null values
const healthProfileSchema = z.object({
	gender: z.enum(['male', 'female', 'other']),
	age: z.number().min(1).max(120),
	activityLevel: z.enum([
		'sedentary',
		'light',
		'moderate',
		'active',
		'veryActive',
	]),
	height: z.object({
		value: z.number().min(1),
		unit: z.enum(['cm', 'ft']),
	}),
	weight: z.object({
		value: z.number().min(1),
		unit: z.enum(['kg', 'lb']),
	}),
	// Make targetWeight optional
	targetWeight: z
		.object({
			value: z.number().min(1).nullable(),
			unit: z.enum(['kg', 'lb']),
		})
		.optional(),
	goal: z.enum([
		'fat-loss',
		'muscle-building',
		'muscle-building-with-fat-loss',
		'bodybuilding',
		'maintenance',
		'general-fitness',
		'other',
	]),
	otherGoal: z.string().optional(),
	// New fields
	dietaryPreference: z.enum(['vegetarian', 'non-vegetarian', 'vegan', 'other']),
	otherDietaryPreference: z.string().optional(),
	nonVegDays: z
		.array(
			z.object({
				day: z.string(),
				selected: z.boolean(),
			}),
		)
		.optional(),
	allergies: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			selected: z.boolean(),
		}),
	),
	otherAllergy: z.string().optional(),
	mealTimes: z.enum(['2', '3', '4+']),
	mealTimings: z.array(
		z.object({
			name: z.string(),
			time: z.string(),
		}),
	),
	// Original fields
	medicalConditions: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			selected: z.boolean(),
		}),
	),
	otherMedicalCondition: z.string().optional(),
	religiousPreference: z
		.enum([
			'hindu',
			'muslim',
			'sikh',
			'jain',
			'christian',
			'buddhist',
			'other',
			'none',
		])
		.nullable(),
	otherReligiousPreference: z.string().optional(),
	dietaryRestrictions: z.array(z.string()).optional(),
});

export type HealthProfileData = z.infer<typeof healthProfileSchema>;

export async function submitHealthProfile(
	formData: Partial<HealthProfileState>,
): Promise<HealthProfileResponse> {
	// Log raw formData for debugging (especially for allergies)
	console.log('Raw health profile formData:', {
		gender: formData.gender,
		age: formData.age,
		dietaryPreference: formData.dietaryPreference,
		allergies: formData.allergies,
		otherAllergy: formData.otherAllergy,
		...formData, // log other fields as needed
	});

	// Extract and prepare required fields from formData
	const profileData = {
		// TODO later add this do the form
		// fullname : formData.fullname,
		// contact: formData.contact,
		gender: formData.gender || 'male',
		age: formData.age || 30,
		activityLevel: formData.activityLevel || 'moderate',
		height: formData.height as { value: number; unit: 'cm' | 'ft' },
		weight: formData.weight as { value: number; unit: 'kg' | 'lb' },
		...(formData.targetWeight?.value
			? {
					targetWeight: formData.targetWeight as {
						value: number;
						unit: 'kg' | 'lb';
					},
				}
			: {}),
		goal: formData.goal || 'maintenance',
		otherGoal: formData.goal === 'other' ? formData.otherGoal : undefined,
		dietaryPreference: formData.dietaryPreference || 'vegetarian',
		otherDietaryPreference: formData.otherDietaryPreference,
		// Filter nonVegDays to only include selected days
		nonVegDays:
			formData.dietaryPreference === 'non-vegetarian'
				? formData.nonVegDays?.filter((day) => day.selected)
				: [],
		// Filter allergies to only include selected ones
		allergies: formData.allergies?.filter((allergy) => allergy.selected) || [],
		otherAllergy: formData.otherAllergy || '',
		mealTimes: formData.mealTimes || '3',
		mealTimings:
			formData.mealTimings && formData.mealTimings.length > 0
				? formData.mealTimings
				: getDefaultMealTimings(formData.mealTimes || '3'),
		// Filter medicalConditions to only include selected ones
		medicalConditions:
			formData.medicalConditions?.filter((condition) => condition.selected) ||
			[],
		otherMedicalCondition: formData.otherMedicalCondition || '',
		religiousPreference: formData.religiousPreference || null,
		otherReligiousPreference: formData.otherReligiousPreference || '',
		dietaryRestrictions: formData.dietaryRestrictions || [],
	};

	// Log filtered result for comparison
	console.log('profile health profile data:', profileData);

	try {
		// Log the filtered data to help with debugging
		console.log('Filtered health profile data:', profileData);

		// Validate the form data
		healthProfileSchema.parse(profileData);
		console.log('Health profile submitted:', profileData);
		console.log(
			'Parsed health profile data:',
			healthProfileSchema.parse(profileData),
		);

		// Calculate health metrics
		let healthMetrics: HealthMetrics | null = null;
		try {
			healthMetrics = calculateHealthMetrics({
				gender: formData.gender || 'male',
				age: formData.age || 30,
				weight: formData.weight as { value: number; unit: 'kg' | 'lb' },
				height: formData.height as { value: number; unit: 'cm' | 'ft' },
				activityLevel: formData.activityLevel || 'moderate',
				goal: formData.goal || 'maintenance',
				// targetWeight is not needed for health metric calculations
			});
			console.log('Calculated health metrics:', healthMetrics);
		} catch (metricError) {
			console.error('Error calculating health metrics:', metricError);
		}
		console.log('Calculated health metrics are ', healthMetrics);

		// Pass profileData with fullname and contact included
		const apiResponse = await submitHealthProfileToApi({
			healthProfileFormData: profileData,
			healthMetrics: healthMetrics as HealthMetrics,
		});

		// Revalidate paths that may depend on this data
		revalidatePath('/dashboard');
		revalidatePath('/healthprofileform');

		return apiResponse;
	} catch (error) {
		console.error('Error submitting health profile:', error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'An unknown error occurred',
		};
	}
}

function getDefaultMealTimings(
	mealCount: MealTimes,
): { name: string; time: string }[] {
	switch (mealCount) {
		case '2':
			return [
				{ name: 'Breakfast', time: '08:00' },
				{ name: 'Dinner', time: '19:00' },
			];
		case '3':
			return [
				{ name: 'Breakfast', time: '08:00' },
				{ name: 'Lunch', time: '13:00' },
				{ name: 'Dinner', time: '19:00' },
			];
		case '4+':
			return [
				{ name: 'Breakfast', time: '08:00' },
				{ name: 'Lunch', time: '13:00' },
				{ name: 'Snack', time: '16:00' },
				{ name: 'Dinner', time: '19:00' },
			];
		default:
			return [{ name: 'Breakfast', time: '08:00' }];
	}
}
