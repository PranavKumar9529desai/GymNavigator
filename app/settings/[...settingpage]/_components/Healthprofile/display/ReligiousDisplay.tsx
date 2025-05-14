import { Heart, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserHealthprofile } from '../_actions/get-client-healthprofie';

interface ReligiousDisplayProps {
	data: UserHealthprofile['Religious'];
}

// Religious preference badge color mapping
const religiousPreferenceColors = {
	Hindu: 'bg-orange-100 text-orange-800',
	Buddhist: 'bg-yellow-100 text-yellow-800',
	Christian: 'bg-blue-100 text-blue-800',
	Muslim: 'bg-green-100 text-green-800',
	Jewish: 'bg-purple-100 text-purple-800',
	Sikh: 'bg-indigo-100 text-indigo-800',
	Jain: 'bg-pink-100 text-pink-800',
	'Prefer not to say': 'bg-gray-100 text-gray-800',
	None: 'bg-gray-100 text-gray-800',
	Other: 'bg-gray-100 text-gray-800',
};

export default function ReligiousDisplay({ data }: ReligiousDisplayProps) {
	const religiousPreference = data.religiousPreference || 'None';
	const badgeClass =
		religiousPreferenceColors[
			religiousPreference as keyof typeof religiousPreferenceColors
		] || 'bg-gray-100 text-gray-800';

	return (
		<Card className="overflow-hidden border border-gray-200 shadow-sm">
			<CardHeader className="bg-gradient-to-r from-blue-50 to-white py-4 px-6 flex flex-row items-center gap-3 border-b">
				<BookOpen className="h-5 w-5 text-blue-600" />
				<div>
					<h3 className="font-semibold text-gray-900">Religious Preferences</h3>
				</div>
			</CardHeader>

			<CardContent className="p-6">
				<div className="flex flex-col space-y-4">
					<div className="flex items-center gap-3">
						<Heart className="h-4 w-4 text-gray-400" />
						<span className="text-sm font-medium text-gray-700">
							Religious Preference
						</span>
					</div>

					<div className="flex items-center flex-wrap gap-2">
						<Badge className={badgeClass} variant="outline">
							{religiousPreference}
						</Badge>

						{data.religiousPreference === 'Other' &&
							data.otherReligiousPreference && (
								<span className="text-sm text-gray-600">
									({data.otherReligiousPreference})
								</span>
							)}
					</div>

					<div className="mt-4 pt-4 border-t border-dashed border-gray-200">
						<p className="text-xs text-gray-500 italic">
							Religious preferences help us respect cultural and dietary
							requirements during meal planning and workout scheduling.
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
