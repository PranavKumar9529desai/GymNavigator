import { queryClient } from '@/lib/queryClient';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import { getAssignableUsers } from './_actions/get-assignable-users';
import { getWorkoutPlans } from './_actions/get-workout-plans';
import UserWorkoutAssignment from './_components/UserWorkoutAssignment';

function Spinner() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<Loader2 className="h-8 w-8 animate-spin text-primary" />
		</div>
	);
}

export default async function AssignWorkoutPage() {
	await Promise.all([
		queryClient.prefetchQuery({
			queryKey: ['assignable-users'],
			queryFn: getAssignableUsers,
			staleTime: 1000 * 60 * 5, // 5 minutes
		}),
		queryClient.prefetchQuery({
			queryKey: ['workout-plans'],
			queryFn: getWorkoutPlans,
			staleTime: 1000 * 60 * 5, // 5 minutes
		}),
	]);

	return (
		<div className="min-h-screen bg-gray-50">
			<Suspense fallback={<Spinner />}>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<UserWorkoutAssignment />
				</HydrationBoundary>
			</Suspense>
		</div>
	);
}
