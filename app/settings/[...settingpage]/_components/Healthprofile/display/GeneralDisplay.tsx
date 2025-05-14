import { UserCircle2, Ruler, Weight, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UserHealthprofile } from '../_actions/get-client-healthprofie';

interface GeneralDisplayProps {
	data: UserHealthprofile['General'];
}

export default function GeneralDisplay({ data }: GeneralDisplayProps) {
	const calculateBMI = () => {
		if (!data.heightValue || !data.weightValue) return null;

		// Convert height to meters if in cm
		const heightInMeters =
			data.heightUnit === 'cm'
				? data.heightValue / 100
				: data.heightValue * 0.0254;
		// Convert weight to kg if in lbs
		const weightInKg =
			data.weightUnit === 'kg' ? data.weightValue : data.weightValue * 0.453592;

		const bmi = weightInKg / (heightInMeters * heightInMeters);
		return bmi.toFixed(1);
	};

	const bmi = calculateBMI();

	const getBMICategory = (bmiValue: number) => {
		if (bmiValue < 18.5)
			return { label: 'Underweight', color: 'bg-blue-100 text-blue-800' };
		if (bmiValue < 25)
			return { label: 'Normal', color: 'bg-green-100 text-green-800' };
		if (bmiValue < 30)
			return { label: 'Overweight', color: 'bg-yellow-100 text-yellow-800' };
		return { label: 'Obese', color: 'bg-red-100 text-red-800' };
	};

	const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;

	return (
		<Card className="overflow-hidden border border-gray-200 shadow-sm">
			<CardHeader className="bg-gradient-to-r from-blue-50 to-white py-4 px-6 flex flex-row items-center gap-3 border-b">
				<UserCircle2 className="h-5 w-5 text-blue-600" />
				<div>
					<h3 className="font-semibold text-gray-900">General Information</h3>
				</div>
			</CardHeader>

			<CardContent className="p-6">
				<div className="grid grid-cols-2 gap-y-4 gap-x-6">
					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-2">
							<CalendarDays className="h-4 w-4 text-gray-400" />
							<span className="text-sm text-gray-600">Age</span>
						</div>
						<span className="text-base font-medium">
							{data.age || 'Not specified'}
						</span>
					</div>

					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-2">
							<UserCircle2 className="h-4 w-4 text-gray-400" />
							<span className="text-sm text-gray-600">Gender</span>
						</div>
						<span className="text-base font-medium">
							{data.gender || 'Not specified'}
						</span>
					</div>

					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-2">
							<Ruler className="h-4 w-4 text-gray-400" />
							<span className="text-sm text-gray-600">Height</span>
						</div>
						<span className="text-base font-medium">
							{data.heightValue
								? `${data.heightValue} ${data.heightUnit || ''}`
								: 'Not specified'}
						</span>
					</div>

					<div className="flex flex-col gap-1">
						<div className="flex items-center gap-2">
							<Weight className="h-4 w-4 text-gray-400" />
							<span className="text-sm text-gray-600">Weight</span>
						</div>
						<span className="text-base font-medium">
							{data.weightValue
								? `${data.weightValue} ${data.weightUnit || ''}`
								: 'Not specified'}
						</span>
					</div>
				</div>

				{bmi && (
					<>
						<Separator className="my-4" />

						<div className="flex justify-between items-center">
							<div>
								<span className="text-sm text-gray-600">BMI</span>
								<p className="text-base font-medium">{bmi}</p>
							</div>

							{bmiCategory && (
								<Badge className={bmiCategory.color} variant="outline">
									{bmiCategory.label}
								</Badge>
							)}
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
