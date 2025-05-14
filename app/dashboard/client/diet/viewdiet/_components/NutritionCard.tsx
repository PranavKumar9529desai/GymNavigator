'use client';

import React from 'react';

interface NutritionCardProps {
	calories: number;
	protein: number;
	carbs: number;
	fats: number;
	size?: 'sm' | 'md' | 'lg';
	showLabels?: boolean;
}

export const NutritionCard = ({
	calories,
	protein,
	carbs,
	fats,
	size = 'md',
	showLabels = true,
}: NutritionCardProps) => {
	// Determine the size classes
	const sizeClasses = {
		sm: {
			grid: 'grid-cols-4 gap-2',
			value: 'text-xs font-semibold',
			label: 'text-[10px]',
			icon: 'h-3 w-3',
			padding: 'p-1',
		},
		md: {
			grid: 'grid-cols-4 gap-3',
			value: 'text-sm font-semibold',
			label: 'text-[11px]',
			icon: 'h-3.5 w-3.5',
			padding: 'p-1.5',
		},
		lg: {
			grid: 'grid-cols-4 gap-4',
			value: 'text-base font-bold',
			label: 'text-xs',
			icon: 'h-4 w-4',
			padding: 'p-2',
		},
	};

	const classes = sizeClasses[size];

	return (
		<div className={`grid ${classes.grid}`}>
			{/* Calories */}
			<div className="flex flex-col items-center">
				<div className={`bg-red-50 rounded-full ${classes.padding} mb-1`}>
					<svg
						className={`${classes.icon} text-red-600`}
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M12 2v8"></path>
						<path d="m4.93 10.93 1.41 1.41"></path>
						<path d="M2 18h2"></path>
						<path d="M20 18h2"></path>
						<path d="m19.07 10.93-1.41 1.41"></path>
						<path d="M22 22H2"></path>
						<path d="m8 22 4-11 4 11"></path>
					</svg>
				</div>
				<span className={`${classes.value} text-red-600`}>{calories}</span>
				{showLabels && (
					<span className={`${classes.label} text-gray-500`}>calories</span>
				)}
			</div>

			{/* Protein */}
			<div className="flex flex-col items-center">
				<div className={`bg-purple-50 rounded-full ${classes.padding} mb-1`}>
					<svg
						className={`${classes.icon} text-purple-600`}
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M7 5V3"></path>
						<path d="M17 5V3"></path>
						<path d="M12 5V2"></path>
						<path d="M7 14v-3"></path>
						<path d="M17 14v-3"></path>
						<path d="M17 14h-1"></path>
						<path d="M7 14H6"></path>
						<path d="M7 14a5 5 0 0 0 5 5 5 5 0 0 0 5-5"></path>
					</svg>
				</div>
				<span className={`${classes.value} text-purple-600`}>{protein}g</span>
				{showLabels && (
					<span className={`${classes.label} text-gray-500`}>protein</span>
				)}
			</div>

			{/* Carbs */}
			<div className="flex flex-col items-center">
				<div className={`bg-amber-50 rounded-full ${classes.padding} mb-1`}>
					<svg
						className={`${classes.icon} text-amber-600`}
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M17 12a5 5 0 0 0-5-5c-2.76 0-5 2.24-5 5a5 5 0 0 0 5 5"></path>
						<path d="M17 12c0 2.76-2.24 5-5 5"></path>
						<path d="M8 12h8"></path>
					</svg>
				</div>
				<span className={`${classes.value} text-amber-600`}>{carbs}g</span>
				{showLabels && (
					<span className={`${classes.label} text-gray-500`}>carbs</span>
				)}
			</div>

			{/* Fats */}
			<div className="flex flex-col items-center">
				<div className={`bg-blue-50 rounded-full ${classes.padding} mb-1`}>
					<svg
						className={`${classes.icon} text-blue-600`}
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M7 16a3.5 3.5 0 0 0 7 0c0-1.8-1.2-2-1.5-3.5-.3-1.6.1-2.4 1.5-3.5 0 0-3-2-4-2-1 0-4 2-4 2 1.4 1.1 1.8 1.9 1.5 3.5-.3 1.5-1.5 1.7-1.5 3.5Z"></path>
						<path d="M5 8.5C5.82 7.3 7 6.3 8 6c1.7-.5 3-.4 4 0 1 .4 2.18 1.4 3 2.5"></path>
					</svg>
				</div>
				<span className={`${classes.value} text-blue-600`}>{fats}g</span>
				{showLabels && (
					<span className={`${classes.label} text-gray-500`}>fats</span>
				)}
			</div>
		</div>
	);
};
