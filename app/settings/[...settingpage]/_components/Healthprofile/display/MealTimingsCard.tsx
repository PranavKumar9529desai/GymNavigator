import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import MealTimingsDisplay from './MealTimingsDisplay';
import { UserHealthprofile } from '../_actions/get-client-healthprofie';

interface MealTimingsCardProps {
	data: UserHealthprofile['Dietary'];
}

/**
 * Card component for displaying meal timings information
 * @param props - Component properties
 */
export default function MealTimingsCard({ data }: MealTimingsCardProps) {
	return (
		<Card className="overflow-hidden border border-gray-200 shadow-sm">
			<CardHeader className="bg-gradient-to-r from-blue-50 to-white py-4 px-6 flex flex-row items-center gap-3 border-b">
				<Clock className="h-5 w-5 text-blue-600" />
				<div>
					<h3 className="font-semibold text-gray-900">Meal Schedule</h3>
				</div>
			</CardHeader>

			<CardContent className="p-6">
				<MealTimingsDisplay
					timings={data.mealTimings}
					mealTimes={data.MealTimes}
				/>
			</CardContent>
		</Card>
	);
}
