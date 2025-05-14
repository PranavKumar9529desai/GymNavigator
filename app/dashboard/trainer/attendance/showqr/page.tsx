import GymQRCode from '@/app/dashboard/owner/attendance/showqr/QrCode';
import { queryClient } from '@/lib/queryClient';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import { GetAttendanceQrData } from './GetAttendanceQrData';
import QRDisplay from './QRDisplay';

function Spinner() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<Loader2 className="h-8 w-8 animate-spin text-primary" />
		</div>
	);
}

export default async function ShowQRPage() {
	await queryClient.prefetchQuery({
		queryKey: ['attendance-qr'],
		queryFn: GetAttendanceQrData,
		staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
	});

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-4">
			<Suspense fallback={<Spinner />}>
				<HydrationBoundary state={dehydrate(queryClient)}>
					<QRDisplay />
				</HydrationBoundary>
			</Suspense>
		</div>
	);
}
