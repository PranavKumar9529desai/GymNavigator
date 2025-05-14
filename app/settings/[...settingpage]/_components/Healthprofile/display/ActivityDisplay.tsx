import { Activity } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserHealthprofile } from '../_actions/get-client-healthprofie';

interface ActivityDisplayProps {
	data: UserHealthprofile['Activity'];
}

// Activity level badge color mapping
const activityLevelColors = {
	Sedentary: 'bg-gray-100 text-gray-800',
	'Lightly Active': 'bg-blue-100 text-blue-800',
	'Moderately Active': 'bg-green-100 text-green-800',
	'Very Active': 'bg-orange-100 text-orange-800',
	'Extremely Active': 'bg-red-100 text-red-800',
};

export default function ActivityDisplay({ data }: ActivityDisplayProps) {
	const level = data.activityLevel || 'Not specified';
	const badgeClass =
		activityLevelColors[level as keyof typeof activityLevelColors] ||
		'bg-gray-100 text-gray-800';

	return (
		<Card className="overflow-hidden border border-gray-200 shadow-sm">
			<CardHeader className="bg-gradient-to-r from-blue-50 to-white py-4 px-6 flex flex-row items-center gap-3 border-b">
				<Activity className="h-5 w-5 text-blue-600" />
				<div>
					<h3 className="font-semibold text-gray-900">Activity Profile</h3>
				</div>
			</CardHeader>

			<CardContent className="p-6">
				<div className="flex flex-col space-y-4">
					<div className="flex justify-between items-center">
						<span className="text-sm font-medium text-gray-700">
							Activity Level
						</span>
						<Badge className={badgeClass} variant="outline">
							{level}
						</Badge>
					</div>

					<div className="mt-4 pt-4 border-t border-dashed border-gray-200">
						<p className="text-xs text-gray-500 italic">
							Your activity level helps determine your daily calorie needs and
							optimizes workout recommendations.
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
