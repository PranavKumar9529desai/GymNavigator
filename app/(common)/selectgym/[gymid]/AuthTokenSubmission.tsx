'use client';
import { updateSesionWithGym } from '@/app/(common)/_actions/session/updateSessionWithGym';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/node_modules/next-auth/react';
import { AnimatePresence, m } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, Shield } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { GymInfo } from '@/types/next-auth';
import { VerifyAuthToken } from '../_actions/VerifyAuthToken';
import type { gym } from '../_components/SelectGym';
import { fetchGymById } from './_actions/fetch-gym-by-id';

// Dynamic import with no SSR
const AuthTokenWrong = dynamic(() => import('./AuthTokenWrong'), {
	ssr: false,
});

const AuthTokenSuccess = dynamic(
	() =>
		import('./_components/auth-token-success').then(
			(mod) => mod.AuthTokenSuccess,
		),
	{
		ssr: false,
	},
);

function GymFormSkeleton() {
	return (
		<div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
			<div className="flex flex-col items-center mb-6">
				<Skeleton className="w-24 h-24 rounded-lg mb-4" />
				<Skeleton className="h-6 w-40 mb-2" />
				<Skeleton className="h-4 w-56" />
			</div>
			<div className="space-y-6">
				<div className="space-y-2">
					<Skeleton className="h-5 w-40" />
					<Skeleton className="h-12 w-full" />
				</div>
				<Skeleton className="h-12 w-full" />
			</div>
		</div>
	);
}

export default function AuthTokenSubmission() {
	const { data: session, update } = useSession();
	console.log('session is ', session);
	const router = useRouter();
	const [authToken, setAuthToken] = useState('');
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(true);
	const [step, setStep] = useState(1);
	const [error, setError] = useState('');
	const [isSuccess, setIsSuccess] = useState(false);
	const [showWrongToken, setShowWrongToken] = useState(false);
	const [gym, setGym] = useState<gym | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [showSuccess, setShowSuccess] = useState(false);
	const params = useParams();
	const gymId = params?.gymid as string;

	useEffect(() => {
		async function fetchGymData() {
			try {
				// Use server action instead of API route
				const gymData = await fetchGymById(gymId);

				if (gymData) {
					setGym(gymData);
				} else {
					setError('Gym not found');
				}
			} catch (err) {
				console.error('Error fetching gym:', err);
				setError('Failed to load gym details. Please try again.');
			} finally {
				setIsLoading(false);
			}
		}

		if (gymId) {
			fetchGymData();
		}
	}, [gymId]);

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center p-8 text-center">
				<p className="text-red-500 mb-4">{error}</p>
				<button
					type="button"
					onClick={() => window.location.reload()}
					className="px-4 py-2 bg-blue-500 text-white rounded-md"
				>
					Retry
				</button>
			</div>
		);
	}

	if (isLoading || !gym) {
		return <GymFormSkeleton />;
	}

	const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.toUpperCase(); // Convert to uppercase
		// Only allow letters and numbers, max 10 characters
		if (/^[A-Z0-9]*$/.test(value) && value.length <= 10) {
			setAuthToken(value);
			setError('');
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const pastedText = e.clipboardData.getData('text').toUpperCase();
		if (pastedText.length <= 10 && /^[A-Z0-9]*$/.test(pastedText)) {
			setAuthToken(pastedText);
			setError('');
		} else {
			setError('Invalid token format');
		}
	};

	const handleSubmit = async () => {
		setLoading(true);
		setError('');

		try {
			const response = await VerifyAuthToken(gym, authToken);

			if (response.success) {
				setStep(2);
				setIsSuccess(true);
				const newGym: GymInfo = {
					id: gym.id as string,
					gym_name: gym.name,
				};
				await updateSesionWithGym(newGym, update);

				// Show success component instead of immediate redirect
				setShowSuccess(true);

				// Delay redirect for animation
				setTimeout(() => {
					router.push('/dashboard/trainer');
				}, 2500);
			} else {
				setShowWrongToken(true); // Show wrong token component instead of error message
			}
		} catch (error) {
			console.error('Failed to verify token:', error);
			setShowWrongToken(true); // Show wrong token component on error
		} finally {
			setLoading(false);
		}
	};

	const handleRetry = () => {
		setShowWrongToken(false);
		setAuthToken('');
		setError('');
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white rounded-2xl">
				<AnimatePresence mode="wait">
					{showWrongToken ? (
						<AuthTokenWrong onRetry={handleRetry} />
					) : showSuccess ? (
						<AuthTokenSuccess gym={gym} redirectingTo="Dashboard" />
					) : (
						<m.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							className="p-6"
						>
							{/* Progress Indicator */}
							<div className="flex justify-center mb-6">
								<div className="flex items-center space-x-2">
									<div
										className={`h-2 w-2 rounded-full ${
											step === 1 ? 'bg-blue-600' : 'bg-gray-300'
										}`}
									/>
									<div
										className={`h-2 w-2 rounded-full ${
											step === 2 ? 'bg-blue-600' : 'bg-gray-300'
										}`}
									/>
								</div>
							</div>

							{/* Gym Info */}
							<div className="flex items-center space-x-4 mb-6">
								<div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
									<Image
										src={gym.img}
										alt={gym.name}
										layout="fill"
										objectFit="cover"
										className="rounded-full"
									/>
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900">
										{gym.name}
									</h3>
									<p className="text-sm text-gray-500">
										Enter authentication token
									</p>
								</div>
							</div>

							{/* Token Input */}
							<div className="space-y-6">
								<div className="flex justify-center">
									<Shield className="h-12 w-12 text-blue-600" />
								</div>

								<div className="space-y-2">
									<Input
										type="text"
										value={authToken}
										onChange={handleTokenChange}
										onPaste={handlePaste}
										placeholder="Enter auth token (e.g., YSS59CTP37)"
										className={`text-center text-xl tracking-[0.5em] h-14 font-mono ${
											error ? 'border-red-500' : 'border-gray-200'
										}`}
										style={{ letterSpacing: '0.5em' }}
										maxLength={10}
										autoComplete="off"
										spellCheck="false"
									/>

									{error && (
										<m.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className="flex items-center justify-center text-red-500 text-sm mt-2"
										>
											<AlertCircle className="w-4 h-4 mr-1" />
											{error}
										</m.div>
									)}

									<p className="text-xs text-gray-500 text-center mt-2">
										Token format: 10 characters, letters and numbers only
									</p>
								</div>

								<Button
									onClick={handleSubmit}
									disabled={loading || authToken.length !== 10}
									className={`w-full py-6 text-lg font-medium transition-all duration-200 ${
										loading || authToken.length !== 10
											? 'bg-gray-100 text-gray-400'
											: 'bg-blue-600 hover:bg-blue-700 text-white'
									}`}
								>
									{loading ? (
										<Loader2 className="h-5 w-5 animate-spin" />
									) : isSuccess ? (
										<CheckCircle2 className="h-5 w-5" />
									) : (
										'Verify Token'
									)}
								</Button>

								<p className="text-xs text-gray-500 text-center">
									Contact the gym owner if you haven&apos;t received the token
								</p>
							</div>
						</m.div>
					)}
				</AnimatePresence>
			</DialogContent>
		</Dialog>
	);
}
