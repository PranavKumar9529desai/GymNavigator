import { Clock, Coffee, UtensilsCrossed, Utensils } from 'lucide-react';

interface MealTiming {
	name: string;
	time: string;
}

interface MealTimingsDisplayProps {
	timings: string | undefined;
	mealTimes: string | undefined;
}

/**
 * Component for displaying meal timings in a cleaner UI
 * @param props - Component properties
 */
export default function MealTimingsDisplay({
	timings,
	mealTimes,
}: MealTimingsDisplayProps) {
	// Parse the meal timings string into an array of objects
	const parseMealTimings = (): MealTiming[] => {
		if (!timings) return [];
		try {
			return JSON.parse(timings) as MealTiming[];
		} catch (error) {
			console.error('Error parsing meal timings:', error);
			return [];
		}
	};

	const mealTimingsList = parseMealTimings();

	// Format time to be more readable (e.g., "08:00" to "8:00 AM")
	const formatTime = (time: string): string => {
		try {
			const [hours, minutes] = time.split(':');
			const hoursNum = parseInt(hours, 10);
			const period = hoursNum >= 12 ? 'PM' : 'AM';
			const formattedHours =
				hoursNum > 12 ? hoursNum - 12 : hoursNum === 0 ? 12 : hoursNum;
			return `${formattedHours}:${minutes} ${period}`;
		} catch (error) {
			return time; // Return original if parsing fails
		}
	};

	// Get icon based on meal name
	const getMealIcon = (mealName: string) => {
		const lowerName = mealName.toLowerCase();
		if (lowerName.includes('breakfast')) return Coffee;
		if (lowerName.includes('lunch')) return UtensilsCrossed;
		if (lowerName.includes('dinner')) return Utensils;
		return Clock;
	};

	// Get background color based on meal name
	const getMealColor = (mealName: string, index: number) => {
		const lowerName = mealName.toLowerCase();
		if (lowerName.includes('breakfast')) return 'bg-amber-100 text-amber-800';
		if (lowerName.includes('lunch')) return 'bg-emerald-100 text-emerald-800';
		if (lowerName.includes('dinner')) return 'bg-indigo-100 text-indigo-800';

		// Fallback colors for other meals
		const colors = [
			'bg-blue-100 text-blue-800',
			'bg-purple-100 text-purple-800',
			'bg-pink-100 text-pink-800',
		];
		return colors[index % colors.length];
	};

	if (mealTimingsList.length === 0) {
		return (
			<div className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-md flex items-center justify-center">
				<Clock className="h-4 w-4 text-gray-400 mr-2" />
				{mealTimes
					? `${mealTimes} meals per day`
					: 'No meal schedule information available'}
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Clock className="h-4 w-4 text-blue-500" />
					<h4 className="text-sm font-medium text-gray-700">
						Daily Meal Schedule
					</h4>
				</div>
				<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
					{mealTimes} meals/day
				</span>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				{mealTimingsList.map((meal, index) => {
					const IconComponent = getMealIcon(meal.name);
					const colorClass = getMealColor(meal.name, index);

					return (
						<div
							key={index}
							className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
						>
							<div className="flex items-center gap-3">
								<div
									className={`h-10 w-10 rounded-full ${colorClass.split(' ')[0]} flex items-center justify-center`}
								>
									<IconComponent
										className={`h-5 w-5 ${colorClass.split(' ')[1]}`}
									/>
								</div>
								<span className="font-medium text-gray-800">{meal.name}</span>
							</div>
							<div className="text-sm px-3 py-1.5 bg-gray-50 rounded-md text-gray-700 font-medium border border-gray-100">
								{formatTime(meal.time)}
							</div>
						</div>
					);
				})}
			</div>

			<div className="mt-3 pt-2 border-t border-dashed border-gray-200">
				<p className="text-xs text-gray-500 italic">
					These meal timings help trainers optimize your nutrition and workout
					schedule.
				</p>
			</div>
		</div>
	);
}
