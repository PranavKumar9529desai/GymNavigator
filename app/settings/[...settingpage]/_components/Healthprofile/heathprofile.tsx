import { ChevronRight, Pencil } from 'lucide-react';
import {
	gethealthprofileById,
	UserHealthprofile,
} from './_actions/get-client-healthprofie'; // Import UserHealthprofile type
import Link from 'next/link'; // Import Link
import { Suspense } from 'react'; // Import Suspense for cleaner loading states (optional but good practice)
import GeneralDisplay from './display/GeneralDisplay';
import ActivityDisplay from './display/ActivityDisplay';
import DietaryDisplay from './display/DietaryDisplay';
import MedicalDisplay from './display/MedicalDisplay';
import ReligiousDisplay from './display/ReligiousDisplay';
import { Button } from '@/components/ui/button';

// Define props interface to accept searchParams
interface HealthProfileProps {
	selectedTopic?: string; // Changed from searchParams to selectedTopic prop
}

// Define the structure for the fetched data and error
interface HealthDataState {
	data: UserHealthprofile | null;
	error: string | null;
	loading: boolean;
}

export default async function HealthProfile2({
	selectedTopic: rawSelectedTopic,
}: HealthProfileProps) {
	// Destructure and rename prop
	const TopicsArray = [
		'General',
		'Activity',
		'Dietary',
		'Medical',
		'Religious',
	];

	// Capitalize the selected topic from the prop to match keys/array values
	const selectedTopic = rawSelectedTopic
		? ((rawSelectedTopic.charAt(0).toUpperCase() +
				rawSelectedTopic.slice(1)) as keyof UserHealthprofile)
		: undefined;
	// console.log("Selected Topic from prop:", selectedTopic); // For debugging

	let healthData: HealthDataState = { data: null, error: null, loading: false };

	// Fetch data only if a topic is selected
	if (selectedTopic && TopicsArray.includes(selectedTopic)) {
		// Ensure topic is valid
		healthData.loading = true; // Set loading state
		try {
			const result = await gethealthprofileById();
			// console.log("Fetched Data Result:", result); // For debugging
			if (result.success && result.data) {
				healthData.data = result.data;
			} else {
				healthData.error =
					result.error || 'Failed to fetch health profile data.';
			}
		} catch (err) {
			console.error('Error fetching health profile:', err);
			healthData.error = 'An unexpected error occurred while fetching data.';
		} finally {
			healthData.loading = false; // Reset loading state
		}
	} else if (rawSelectedTopic) {
		// Handle invalid topic from URL prop
		healthData.error = `Invalid topic: ${rawSelectedTopic}`;
	}

	return (
		<section
			className={`px-4 py-6 pb-20 md:pb-6 grid grid-cols-1 ${selectedTopic ? '' : 'md:grid-cols-3'} gap-6`}
		>
			{/* Adjust grid layout based on whether a topic is selected */}

			{/* Topics List - Only show if no topic is selected */}
			{!selectedTopic && (
				<div className="md:col-span-1">
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-semibold">Health Profile Sections</h2>
						<Link href="/healthprofileform">
							<Button
								variant="ghost"
								size="sm"
								className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
							>
								<Pencil className="h-4 w-4" />
								<span className="sr-only md:not-sr-only md:inline-block">
									Edit Profile
								</span>
							</Button>
						</Link>
					</div>
					<nav aria-label="Health profile sections">
						{TopicsArray.map((topic: string, index: number) => {
							return (
								<Link
									href={`/settings/healthprofile/${topic.toLowerCase()}`}
									key={index}
									className="block border-b border-gray-100 min-h-[56px] transition-colors hover:bg-gray-50 text-black"
									scroll={false}
								>
									<div className="flex items-center justify-between py-4 px-2">
										<p className="text-base md:text-lg">{topic}</p>
										<ChevronRight className="h-6 w-6 text-gray-400" />
									</div>
								</Link>
							);
						})}
					</nav>
				</div>
			)}

			{/* Data Display Area - Spans appropriately based on topic selection */}
			<div className={selectedTopic ? 'col-span-1' : 'md:col-span-2'}>
				<Suspense
					fallback={
						<div className="py-4 px-2 flex justify-center items-center min-h-[100px]">
							<div className="animate-pulse w-full h-32 bg-gray-200 rounded"></div>
						</div>
					}
				>
					{healthData.loading && (
						<div className="py-4 px-2 flex justify-center items-center">
							Loading...
						</div>
					)}
					{healthData.error && (
						<div className="py-4 px-2 text-red-600 flex items-center justify-center">
							<p className="bg-red-50 p-4 rounded-md border border-red-100 w-full max-w-md">
								Error: {healthData.error}
							</p>
						</div>
					)}
					{selectedTopic &&
						healthData.data &&
						!healthData.loading &&
						!healthData.error && (
							<div className="py-4">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-xl font-semibold capitalize">
										{selectedTopic} Details
									</h2>
									<Link href="/healthprofileform">
										<Button
											variant="ghost"
											size="sm"
											className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
										>
											<Pencil className="h-4 w-4" />
											<span className="sr-only md:not-sr-only md:inline-block">
												Edit Profile
											</span>
										</Button>
									</Link>
								</div>
								{/* Render the appropriate display component based on selectedTopic */}
								{selectedTopic === 'General' && (
									<GeneralDisplay data={healthData.data.General} />
								)}
								{selectedTopic === 'Activity' && (
									<ActivityDisplay data={healthData.data.Activity} />
								)}
								{selectedTopic === 'Dietary' && (
									<DietaryDisplay data={healthData.data.Dietary} />
								)}
								{selectedTopic === 'Medical' && (
									<MedicalDisplay data={healthData.data.Medical} />
								)}
								{selectedTopic === 'Religious' && (
									<ReligiousDisplay data={healthData.data.Religious} />
								)}
							</div>
						)}
					{/* Show data or prompt to select a topic */}
					{!selectedTopic && !healthData.loading && !healthData.error && (
						<div className="py-6 px-4 text-center text-gray-500 bg-gray-50 rounded-md min-h-[100px] flex flex-col items-center justify-center gap-4">
							<p>Select a topic from the list to view details.</p>
							<Link href="/healthprofileform">
								<Button
									variant="ghost"
									size="sm"
									className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
								>
									<Pencil className="h-4 w-4" />
									<span>Edit Health Profile</span>
								</Button>
							</Link>
						</div>
					)}
				</Suspense>
			</div>
		</section>
	);
}
