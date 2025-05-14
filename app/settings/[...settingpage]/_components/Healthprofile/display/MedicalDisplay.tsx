import { AlertTriangle, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
	UserHealthprofile,
	Selection,
} from '../_actions/get-client-healthprofie';

interface MedicalDisplayProps {
	data: UserHealthprofile['Medical'];
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

export default function MedicalDisplay({ data }: MedicalDisplayProps) {
	const allergies = getSelectionItems(data.allergies);
	const medicalConditions = getSelectionItems(data.medicalConditions);

	const hasAllergies = allergies.length > 0 || data.otherAllergy;
	const hasMedicalConditions =
		medicalConditions.length > 0 || data.otherMedicalCondition;

	return (
		<Card className="overflow-hidden border border-gray-200 shadow-sm">
			<CardHeader className="bg-gradient-to-r from-blue-50 to-white py-4 px-6 flex flex-row items-center gap-3 border-b">
				<Stethoscope className="h-5 w-5 text-blue-600" />
				<div>
					<h3 className="font-semibold text-gray-900">Medical Information</h3>
				</div>
			</CardHeader>

			<CardContent className="p-6">
				<div className="space-y-6">
					<div>
						<div className="flex items-center gap-2 mb-3">
							<AlertTriangle className="h-4 w-4 text-amber-500" />
							<h4 className="text-sm font-medium text-gray-700">Allergies</h4>
						</div>

						{hasAllergies ? (
							<div className="flex flex-wrap gap-2">
								{allergies.map((item, index) => (
									<Badge
										key={index}
										variant="outline"
										className="bg-red-50 text-red-800 border-red-200"
									>
										{item.name}
									</Badge>
								))}
								{data.otherAllergy && (
									<Badge
										variant="outline"
										className="bg-red-50 text-red-800 border-red-200"
									>
										{data.otherAllergy}
									</Badge>
								)}
							</div>
						) : (
							<p className="text-sm text-gray-500 italic">
								No allergies reported
							</p>
						)}
					</div>

					<Separator className="my-2" />

					<div>
						<div className="flex items-center gap-2 mb-3">
							<Stethoscope className="h-4 w-4 text-blue-500" />
							<h4 className="text-sm font-medium text-gray-700">
								Medical Conditions
							</h4>
						</div>

						{hasMedicalConditions ? (
							<div className="flex flex-wrap gap-2">
								{medicalConditions.map((item, index) => (
									<Badge
										key={index}
										variant="outline"
										className="bg-blue-50 text-blue-800 border-blue-200"
									>
										{item.name}
									</Badge>
								))}
								{data.otherMedicalCondition && (
									<Badge
										variant="outline"
										className="bg-blue-50 text-blue-800 border-blue-200"
									>
										{data.otherMedicalCondition}
									</Badge>
								)}
							</div>
						) : (
							<p className="text-sm text-gray-500 italic">
								No medical conditions reported
							</p>
						)}
					</div>

					<div className="mt-4 pt-2 border-t border-dashed border-gray-200">
						<p className="text-xs text-gray-500 italic">
							This medical information helps trainers customize workouts safely,
							considering your health circumstances.
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
