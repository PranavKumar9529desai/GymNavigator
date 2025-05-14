export interface DaySelection {
	day: string;
	selected: boolean;
}

export interface MealTime {
	name: string;
	time: string;
}

export interface SelectedItem {
	id: string;
	name: string;
	selected: boolean;
}

export type ActivityLevel =
	| 'sedentary'
	| 'light'
	| 'moderate'
	| 'active'
	| 'veryActive';

export type HealthGoal =
	| 'fat-loss'
	| 'muscle-building'
	| 'muscle-building-with-fat-loss'
	| 'bodybuilding'
	| 'maintenance'
	| 'general-fitness'
	| 'other';

export type DietaryPreference =
	| 'vegetarian'
	| 'non-vegetarian'
	| 'vegan'
	| 'other';

export type MealTimes = '2' | '3' | '4+';

export type ReligiousPreference =
	| 'hindu'
	| 'muslim'
	| 'sikh'
	| 'jain'
	| 'christian'
	| 'buddhist'
	| 'other'
	| 'none'
	| null;

/*
  This interface represents the complete User Health Profile that your endpoints return.
  Note that some fields (for example nonVegDays, mealTimings, dietaryRestrictions) are stored in the database as JSON strings.
  In your API responses you convert them to the proper types.
*/
export interface HealthProfileSubmissionResponse {
	id: number;
	userid: number;
	fullname: string;
	contact: string;
	age: number;
	gender: 'male' | 'female' | 'other';
	goal: HealthGoal;
	weightValue: number;
	weightUnit: string; // e.g., "kg"
	heightValue: number;
	heightUnit: string; // e.g., "cm"
	dietaryPreference: DietaryPreference;
	activityLevel: ActivityLevel;
	// These fields – if provided – are parsed from JSON strings stored in the DB
	nonVegDays?: DaySelection[];
	allergies: SelectedItem[];
	mealTimes: MealTimes;
	mealTimings?: MealTime[];
	medicalConditions: SelectedItem[];
	otherMedicalCondition?: string;
	religiousPreference: ReligiousPreference;
	otherReligiousPreference?: string;
	dietaryRestrictions?: string[];
	otherDietaryPreference?: string;
	otherAllergy?: string;
	bmi?: number;
	bmr?: number;
	tdee?: number;
}
