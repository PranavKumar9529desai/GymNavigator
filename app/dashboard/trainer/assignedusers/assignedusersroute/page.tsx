import { queryClient } from '@/lib/queryClient';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import { getUsersAssignedToTrainer } from './_actiions/GetuserassignedTotrainers';
import AssignedUserToTrainer from './_components/AssignedUserToTrainer';

function Spinner() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<Loader2 className="h-8 w-8 animate-spin text-primary" />
		</div>
	);
}

export default async function AssignedUsersPage() {
	await queryClient.prefetchQuery({
		queryKey: ['assigned-users'],
		queryFn: getUsersAssignedToTrainer,
		staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
	});

	return (
		<div className="min-h-screen bg-gray-50">
			<Suspense fallback={<Spinner />}>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<AssignedUserToTrainer />
				</HydrationBoundary>
			</Suspense>
		</div>
	);
}
