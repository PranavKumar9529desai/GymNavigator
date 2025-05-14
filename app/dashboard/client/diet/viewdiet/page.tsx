import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';

import { queryClient } from '@/lib/queryClient';
import { fetchTodaysDiet } from './_actions/get-todays-diet';
import TodaysDiet from './_components/todays-diet';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import TitleComponent from '@/components/ui/title-component';

export default async function ViewDietPage() {
	// Prefetch the data on the server
	await queryClient.prefetchQuery({
		queryKey: ['todaysDiet'],
		queryFn: fetchTodaysDiet,
	});

	return (
		<div className="py-6 px-0 sm:px-4 max-w-full sm:max-w-4xl mx-auto">
			<TitleComponent title="Today's Diet Plan" />

			<Card className="shadow-sm border-0 rounded-none sm:rounded-lg bg-white/50 backdrop-blur-sm overflow-hidden">
				<CardHeader className="pb-2 pt-4 border-b border-slate-100">
					<div className="flex items-center justify-center">
						<h1 className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-600 to-green-500 text-transparent bg-clip-text">
							Your Personalized Nutrition Plan
						</h1>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					<HydrationBoundary state={dehydrate(queryClient)}>
						<TodaysDiet />
					</HydrationBoundary>
				</CardContent>
			</Card>

			<div className="mt-6 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
				<span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
				<span>Updated daily based on your fitness goals</span>
				<span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
			</div>
		</div>
	);
}
