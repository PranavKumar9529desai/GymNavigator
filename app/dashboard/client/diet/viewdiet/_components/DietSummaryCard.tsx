'use client';

import React from 'react';
import {
	Bar,
	BarChart,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
} from 'recharts';
import type { DietPlan } from '../_actions/get-todays-diet';
import { NutritionCard } from './NutritionCard';

interface DietSummaryCardProps {
	dietPlan: DietPlan;
}

interface MacroDataItem {
	name: string;
	value: number;
	color: string;
}

interface CalorieDataItem {
	name: string;
	calories: number;
	fill: string;
}

// Define custom interfaces for Recharts props
interface CustomPieLabelProps {
	cx: number;
	cy: number;
	midAngle: number;
	innerRadius: number;
	outerRadius: number;
	percent: number;
	index: number;
}

interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{ name: string; value: number }>;
}

export const DietSummaryCard = ({ dietPlan }: DietSummaryCardProps) => {
	// Calculate totals
	const totalCalories = dietPlan.meals.reduce(
		(acc, meal) => acc + meal.calories,
		0,
	);
	const totalProtein = dietPlan.meals.reduce(
		(acc, meal) => acc + meal.protein,
		0,
	);
	const totalCarbs = dietPlan.meals.reduce((acc, meal) => acc + meal.carbs, 0);
	const totalFats = dietPlan.meals.reduce((acc, meal) => acc + meal.fats, 0);

	// Calculate percentages for the progress bars
	const caloriePercentage = Math.min(
		Math.round((totalCalories / dietPlan.targetCalories) * 100),
		100,
	);

	// Format created date
	const formattedDate = new Date(dietPlan.createdAt).toLocaleDateString(
		'en-US',
		{
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		},
	);

	// Data for pie chart
	const macroData: MacroDataItem[] = [
		{ name: 'Protein', value: dietPlan.proteinRatio, color: '#9333ea' },
		{ name: 'Carbs', value: dietPlan.carbsRatio, color: '#d97706' },
		{ name: 'Fats', value: dietPlan.fatsRatio, color: '#3b82f6' },
	];

	// Data for calorie bar chart
	const calorieData: CalorieDataItem[] = [
		{ name: 'Current', calories: totalCalories, fill: '#4f46e5' },
		{ name: 'Target', calories: dietPlan.targetCalories, fill: '#94a3b8' },
	];

	const renderCustomizedLabel = (props: CustomPieLabelProps) => {
		const { cx, cy, midAngle, outerRadius, index } = props;
		const RADIAN = Math.PI / 180;
		const radius = outerRadius * 1.2;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);

		if (index === undefined || !macroData[index]) return null;

		return (
			<text
				x={x}
				y={y}
				fill={macroData[index].color}
				textAnchor={x > cx ? 'start' : 'end'}
				dominantBaseline="central"
				fontSize={12}
				fontWeight="bold"
			>
				{`${macroData[index].name} ${macroData[index].value}%`}
			</text>
		);
	};

	const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white p-2 text-xs shadow-md rounded border border-gray-100">
					<p className="text-gray-700 font-medium">{`${payload[0].name}: ${payload[0].value} calories`}</p>
				</div>
			);
		}
		return null;
	};

	// Calculate calorie progress percentage
	const calorieProgress = Math.min(
		Math.round((totalCalories / dietPlan.targetCalories) * 100),
		100,
	);
	const calorieStatus =
		calorieProgress > 90
			? 'text-green-600'
			: calorieProgress > 70
				? 'text-blue-600'
				: 'text-amber-600';

	return (
		<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
			<div className="flex items-center justify-between mb-3">
				<h3 className="font-medium text-gray-800">Nutrition Summary</h3>
				<span className="text-xs text-gray-500">{formattedDate}</span>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Macro Distribution Chart */}
				<div>
					<h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="mr-1"
						>
							<circle cx="12" cy="12" r="10" />
							<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
						</svg>
						Macro Distribution
					</h4>

					<div className="h-44 mt-2">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
								<Pie
									data={macroData}
									cx="50%"
									cy="50%"
									labelLine={true}
									label={renderCustomizedLabel}
									outerRadius={65}
									innerRadius={30}
									fill="#8884d8"
									dataKey="value"
									paddingAngle={2}
								>
									{macroData.map((entry, index) => (
										<Cell key={`cell-${index as number}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip content={<CustomTooltip />} />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Calorie Progress & Nutrition */}
				<div className="flex flex-col justify-between">
					{/* Calorie Progress */}
					<div className="mb-4">
						<h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="mr-1"
							>
								<path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
								<path d="M2 20h20" />
								<path d="M14 12v.01" />
							</svg>
							Calorie Progress
						</h4>

						<div className="bg-gray-100 h-2 rounded-full mt-1">
							<div
								className={`h-2 rounded-full ${
									calorieProgress > 90
										? 'bg-green-500'
										: calorieProgress > 70
											? 'bg-blue-500'
											: 'bg-amber-500'
								}`}
								style={{ width: `${calorieProgress}%` }}
							></div>
						</div>

						<div className="flex justify-between mt-1">
							<span className={`text-xs ${calorieStatus}`}>
								{totalCalories} / {dietPlan.targetCalories} calories
							</span>
							<span className={`text-xs font-medium ${calorieStatus}`}>
								{calorieProgress}%
							</span>
						</div>
					</div>

					{/* Daily totals */}
					<div>
						<h4 className="text-xs font-medium text-gray-700 mb-2 flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="mr-1"
							>
								<path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
								<path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
								<path d="M12 2v2" />
								<path d="M12 22v-2" />
								<path d="m17 20.66-1-1.73" />
								<path d="M11 10.27 7 3.34" />
								<path d="m20.66 17-1.73-1" />
								<path d="m3.34 7 1.73 1" />
								<path d="M14 12h8" />
								<path d="M2 12h2" />
								<path d="m20.66 7-1.73 1" />
								<path d="m3.34 17 1.73-1" />
								<path d="m17 3.34-1 1.73" />
								<path d="m11 13.73-4 6.93" />
							</svg>
							Daily Nutrients
						</h4>
						<div className="bg-gray-50 p-3 rounded-lg">
							<NutritionCard
								calories={totalCalories}
								protein={totalProtein}
								carbs={totalCarbs}
								fats={totalFats}
								size="sm"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
