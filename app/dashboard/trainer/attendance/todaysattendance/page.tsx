export const dynamic = 'force-dynamic';
import { queryClient } from '@/lib/queryClient';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import UserAttendance from './UserAttendance';
import { TodayAttendance } from './getTodayAttendance';

function Spinner() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<Loader2 className="h-8 w-8 animate-spin text-primary" />
		</div>
	);
}

export default async function AttendancePage() {
	await queryClient.prefetchQuery({
		queryKey: ['todays-attendance'],
		queryFn: TodayAttendance,
		staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
	});

	return (
		<Suspense fallback={<Spinner />}>
			<HydrationBoundary state={dehydrate(queryClient)}>
				<UserAttendance />
			</HydrationBoundary>
		</Suspense>
	);
}
