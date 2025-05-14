/**
 * Types for health data calculations
 */

export interface HealthMetrics {
	bmi: number;
	bmiCategory: string;
	bmr: number;

	tdee: number;
	targetCalories: number;
	macros: MacronutrientDistribution;
}

export interface MacronutrientDistribution {
	protein: number;
	carbs: number;
	fat: number;
}
