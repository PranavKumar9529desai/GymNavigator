import { Button } from '@/components/ui/button';
// src/app/diet-page/components/DietPlanner/DietDisplay/MealCard.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Clock, Info, Utensils } from 'lucide-react';

// Define a type for the meal data (consider putting this in types.ts)
export interface Meal {
	id: string | number;
	name: string;
	time: string;
	description: string;
	instructions: string[];
	protein: string; // e.g., "20g (20%)"
	fat: string; // e.g., "30g (30%)"
	carbs: string; // e.g., "50g (50%)"
}

interface MealCardProps {
	meal: Meal;
	isPartOfGeneratedPlan?: boolean;
	onAssign?: () => void;
}

export function MealCard({
	meal,
	isPartOfGeneratedPlan = false,
	onAssign,
}: MealCardProps) {
	// Extract percentage values from macros for progress bars
	const getPercentage = (macroStr: string): number => {
		const match = macroStr.match(/\((\d+)%\)/);
		return match ? Number.parseInt(match[1], 10) : 0;
	};

	const proteinPercentage = getPercentage(meal.protein);
	const fatPercentage = getPercentage(meal.fat);
	const carbsPercentage = getPercentage(meal.carbs);

	return (
		<Card className="overflow-hidden border border-blue-100">
			<CardHeader className="py-3 px-4 bg-blue-50">
				<div className="flex justify-between items-center">
					<div className="flex items-center">
						<Utensils className="h-5 w-5 text-blue-500 mr-2" />
						<h3 className="font-medium text-blue-800">{meal.name}</h3>
					</div>
					<div className="flex items-center text-sm text-gray-500">
						<Clock className="h-4 w-4 mr-1" />
						<span>{meal.time}</span>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-4">
				<div className="flex flex-wrap items-center gap-2 mb-4">
					<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
						{meal.description}
					</span>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
					<div className="space-y-1">
						<div className="flex justify-between text-sm">
							<span className="text-gray-500">Protein</span>
							<span className="font-medium">{meal.protein}</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
							<div
								className="bg-blue-600 h-2.5 rounded-full"
								style={{ width: `${proteinPercentage}%` }}
							/>
						</div>
					</div>

					<div className="space-y-1">
						<div className="flex justify-between text-sm">
							<span className="text-gray-500">Carbs</span>
							<span className="font-medium">{meal.carbs}</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
							<div
								className="bg-green-500 h-2.5 rounded-full"
								style={{ width: `${carbsPercentage}%` }}
							/>
						</div>
					</div>

					<div className="space-y-1">
						<div className="flex justify-between text-sm">
							<span className="text-gray-500">Fat</span>
							<span className="font-medium">{meal.fat}</span>
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
							<div
								className="bg-amber-500 h-2.5 rounded-full"
								style={{ width: `${fatPercentage}%` }}
							/>
						</div>
					</div>
				</div>

				{meal.instructions.length > 0 && (
					<div className="mt-4">
						<div className="flex items-center text-sm font-medium text-gray-700 mb-2">
							<Info className="h-4 w-4 mr-1 text-blue-500" />
							<span>Instructions</span>
						</div>
						<ul className="space-y-1 text-sm text-gray-600 pl-2">
							{meal.instructions.map((inst, index) => (
								<li key={index as number} className="flex items-start">
									<span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 mr-2" />
									<span>{inst}</span>
								</li>
							))}
						</ul>
					</div>
				)}

				{isPartOfGeneratedPlan && onAssign && (
					<div className="mt-4 pt-4 border-t border-gray-100">
						<Button
							onClick={onAssign}
							className="w-full bg-green-600 hover:bg-green-700 text-white"
						>
							Assign Diet Plan
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
