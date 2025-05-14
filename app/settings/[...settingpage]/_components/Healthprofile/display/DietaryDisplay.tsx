import { Utensils, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
	UserHealthprofile,
	Selection,
} from '../_actions/get-client-healthprofie';
import MealTimingsDisplay from './MealTimingsDisplay';

interface DietaryDisplayProps {
	data: UserHealthprofile['Dietary'];
}

// Helper to display selection arrays or strings
function renderSelection(
	selection: Selection[] | string | undefined,
	otherValue?: string,
): string {
	if (!selection) return 'N/A';
	if (typeof selection === 'string') {
		// Attempt to parse if it looks like JSON, otherwise display as string
		try {
			const parsed = JSON.parse(selection);
			if (Array.isArray(parsed)) {
				return (
					parsed.map((item) => item.name).join(', ') +
					(otherValue ? `, ${otherValue}` : '')
				);
			}
		} catch (e) {
			/* Ignore parsing error, treat as plain string */
		}
		return selection + (otherValue ? `, ${otherValue}` : '');
	}
	if (Array.isArray(selection)) {
		const names = selection
			.filter((item) => item.selected)
			.map((item) => item.name)
			.join(', ');
		return names + (otherValue ? `, ${otherValue}` : '');
	}
	return 'N/A';
}

// Helper to get individual selection items
function getSelectionItems(
	selection: Selection[] | string | undefined,
): { name: string }[] {
	if (!selection) return [];
	if (typeof selection === 'string') {
		try {
			const parsed = JSON.parse(selection);
			if (Array.isArray(parsed)) {
				return parsed.filter((item) => item.selected);
			}
		} catch (e) {
			/* Ignore parsing error */
		}
		return selection ? [{ name: selection }] : [];
	}
	if (Array.isArray(selection)) {
		return selection.filter((item) => item.selected);
	}
	return [];
}

// Helper to display non-veg days
function getNonVegDays(
	days: UserHealthprofile['Dietary']['nonVegDays'],
): string[] {
	if (!days) return [];
	if (typeof days === 'string') {
		try {
			const parsed = JSON.parse(days);
			if (Array.isArray(parsed)) {
				return parsed.filter((d) => d.selected).map((d) => d.day);
			}
		} catch (e) {
			/* Ignore */
		}
		return days ? [days] : [];
	}
	if (Array.isArray(days)) {
		return days.filter((d) => d.selected).map((d) => d.day);
	}
	return [];
}

// Get diet preference badge color
const dietPreferenceColors = {
	Vegetarian: 'bg-green-100 text-green-800',
	Vegan: 'bg-emerald-100 text-emerald-800',
	'Non-vegetarian': 'bg-red-100 text-red-800',
	Pescatarian: 'bg-blue-100 text-blue-800',
	Flexitarian: 'bg-purple-100 text-purple-800',
	Other: 'bg-gray-100 text-gray-800',
};

export default function DietaryDisplay({ data }: DietaryDisplayProps) {
	const dietaryPreference = data.dietaryPreference || 'N/A';
	const preferenceColor =
		dietPreferenceColors[
			dietaryPreference as keyof typeof dietPreferenceColors
		] || 'bg-gray-100 text-gray-800';

	const dietaryRestrictions = getSelectionItems(data.dietaryRestrictions);
	const nonVegDays = getNonVegDays(data.nonVegDays);

	return (
		<Card className="overflow-hidden border border-gray-200 shadow-sm">
			<CardHeader className="bg-gradient-to-r from-blue-50 to-white py-4 px-6 flex flex-row items-center gap-3 border-b">
				<Utensils className="h-5 w-5 text-blue-600" />
				<div>
					<h3 className="font-semibold text-gray-900">Dietary Information</h3>
				</div>
			</CardHeader>

			<CardContent className="p-6">
				<div className="space-y-4">
					<div>
						<h4 className="text-sm font-medium text-gray-700 mb-2">
							Dietary Preference
						</h4>
						<div className="flex items-center gap-2 flex-wrap">
							<Badge className={preferenceColor} variant="outline">
								{dietaryPreference}
							</Badge>
							{data.dietaryPreference === 'Other' &&
								data.otherDietaryPreference && (
									<span className="text-sm text-gray-600">
										({data.otherDietaryPreference})
									</span>
								)}
						</div>
					</div>

					{dietaryRestrictions.length > 0 && (
						<div className="pt-3">
							<h4 className="text-sm font-medium text-gray-700 mb-2">
								Dietary Restrictions
							</h4>
							<div className="flex flex-wrap gap-2">
								{dietaryRestrictions.map((item, index) => (
									<Badge
										key={index}
										variant="outline"
										className="bg-yellow-50 text-yellow-800 border-yellow-200"
									>
										{item.name}
									</Badge>
								))}
								{data.otherDietaryRestrictions && (
									<Badge
										variant="outline"
										className="bg-yellow-50 text-yellow-800 border-yellow-200"
									>
										{data.otherDietaryRestrictions}
									</Badge>
								)}
							</div>
						</div>
					)}

					{nonVegDays.length > 0 && (
						<div className="pt-3">
							<h4 className="text-sm font-medium text-gray-700 mb-2">
								<div className="flex items-center gap-2">
									<Calendar className="h-4 w-4 text-gray-400" />
									<span>Non-Veg Days</span>
								</div>
							</h4>
							<div className="flex flex-wrap gap-2">
								{nonVegDays.map((day, index) => (
									<Badge
										key={index}
										variant="outline"
										className="bg-red-50 text-red-800 border-red-200"
									>
										{day}
									</Badge>
								))}
							</div>
						</div>
					)}

					<Separator className="my-3" />

					<div className="pt-2">
						<MealTimingsDisplay
							timings={data.mealTimings}
							mealTimes={data.MealTimes}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
