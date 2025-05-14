import type { Selection } from '../../_actions/get-healthprofile-by-id';

interface HealthConditionsSectionProps {
	medicalConditions?: string[];
	otherMedicalCondition?: string;
}

export function HealthConditionsSection({
	medicalConditions,
	otherMedicalCondition,
}: HealthConditionsSectionProps) {
	// Combine standard and custom medical conditions
	const allConditions = [
		...(medicalConditions || []),
		...(otherMedicalCondition ? [otherMedicalCondition] : []),
	];

	// Don't render the section if there are no conditions
	if (allConditions.length === 0) {
		return null;
	}

	return (
		<div className="p-4 border-b border-blue-100">
			<h3 className="font-semibold text-blue-800 mb-3 flex items-center">
				<svg
					// @ts-ignore
					title="Health Conditions"
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5 mr-2 text-blue-600"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
					/>
				</svg>
				Health Conditions
			</h3>

			{allConditions.length > 0 ? (
				<div className="flex flex-wrap gap-2">
					{allConditions.map((condition, index) => (
						<span
							key={index as number}
							className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-sm"
						>
							{condition}
						</span>
					))}
				</div>
			) : (
				<div className="p-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
					<p className="text-sm">No health conditions specified</p>
				</div>
			)}
		</div>
	);
}
