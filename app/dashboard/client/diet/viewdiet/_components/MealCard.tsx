'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';
import type { Meal } from '../_actions/get-todays-diet';
import { NutritionCard } from './NutritionCard';

interface MealCardProps {
	meal: Meal;
	index: number;
}

export const MealCard = ({ meal, index }: MealCardProps) => {
	const [isExpanded, setIsExpanded] = useState(false);

	// Determine meal type from timeOfDay
	const getMealTypeInfo = (timeOfDay: string) => {
		if (timeOfDay.includes('7:00 AM'))
			return {
				type: 'Breakfast',
				color: 'text-blue-600',
				borderColor: 'border-blue-500',
				bgColor: 'bg-blue-50',
				icon: '☀️',
			};
		if (timeOfDay.includes('1:00 PM'))
			return {
				type: 'Lunch',
				color: 'text-amber-600',
				borderColor: 'border-amber-500',
				bgColor: 'bg-amber-50',
				icon: '🍽️',
			};
		if (timeOfDay.includes('4:00 PM'))
			return {
				type: 'Snack',
				color: 'text-green-600',
				borderColor: 'border-green-500',
				bgColor: 'bg-green-50',
				icon: '🥗',
			};
		if (timeOfDay.includes('7:00 PM'))
			return {
				type: 'Dinner',
				color: 'text-purple-600',
				borderColor: 'border-purple-500',
				bgColor: 'bg-purple-50',
				icon: '🌙',
			};
		return {
			type: 'Meal',
			color: 'text-gray-600',
			borderColor: 'border-gray-500',
			bgColor: 'bg-gray-50',
			icon: '🍴',
		};
	};

	const mealInfo = getMealTypeInfo(meal.timeOfDay);

	// Parse ingredients and instructions for display
	const ingredientsList =
		meal.ingredients.length > 0
			? meal.ingredients
			: [{ name: 'No ingredients listed', quantity: null }];

	// Parse instructions into items for display
	const instructionItems = meal.instructions
		? meal.instructions
				.split(/[.;]/)
				.map((item) => item.trim())
				.filter((item) => item.length > 0)
		: ['No specific instructions provided'];

	return (
		<div
			className={`mb-4 rounded-lg shadow-sm border border-gray-100 overflow-hidden ${mealInfo.bgColor}`}
		>
			{/* Meal header */}
			<div
				className={`border-l-2 ${mealInfo.borderColor} pl-3 p-3 flex items-center justify-between ${mealInfo.bgColor}`}
			>
				<div className="flex items-center gap-2">
					<span className="text-lg" role="img" aria-label={mealInfo.type}>
						{mealInfo.icon}
					</span>
					<div>
						<h3 className={`font-medium text-sm ${mealInfo.color}`}>
							{mealInfo.type}: {meal.name}
						</h3>
						<div className="text-xs text-gray-500">{meal.timeOfDay}</div>
					</div>
				</div>

				<button
					type="button"
					onClick={() => setIsExpanded(!isExpanded)}
					className="text-gray-500 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
					aria-expanded={isExpanded}
					aria-label={
						isExpanded ? 'Collapse meal details' : 'Expand meal details'
					}
				>
					{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
				</button>
			</div>

			{/* Nutrition snapshot always visible */}
			<div className="p-3 bg-white">
				<NutritionCard
					calories={meal.calories}
					protein={meal.protein}
					carbs={meal.carbs}
					fats={meal.fats}
					size="sm"
				/>
			</div>

			{/* Expandable content */}
			{isExpanded && (
				<div className="p-4 bg-white border-t border-gray-100">
					{/* Ingredients */}
					<div className="mb-4">
						<h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
							<span className="bg-gray-100 rounded-full p-1 mr-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
									<circle cx="12" cy="10" r="3" />
								</svg>
							</span>
							Ingredients
						</h4>
						<div className="grid grid-cols-2 gap-2">
							{ingredientsList.map((ingredient, idx) => (
								<div
									key={`${meal.id}-ingredient-${idx}`}
									className="text-xs text-gray-600 flex items-start bg-gray-50 p-2 rounded"
								>
									<span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5 mt-1.5 flex-shrink-0" />
									<span>
										{ingredient.name}
										{ingredient.quantity && (
											<span className="text-gray-500 ml-1">
												({ingredient.quantity})
											</span>
										)}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Instructions */}
					<div>
						<h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center">
							<span className="bg-gray-100 rounded-full p-1 mr-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
									<polyline points="14 2 14 8 20 8" />
								</svg>
							</span>
							Instructions
						</h4>
						<div className="bg-gray-50 p-3 rounded">
							<ol className="space-y-2 list-decimal pl-4">
								{instructionItems.map((instruction, idx) => (
									<li
										key={`${meal.id}-instruction-${idx}`}
										className="text-xs text-gray-600"
									>
										{instruction}
									</li>
								))}
							</ol>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
