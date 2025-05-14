'use client';

import { queryClient } from '@/lib/getQueryClient';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { updateSesionWithGym } from '../../../(common)/_actions/session/updateSessionWithGym';
import type { GymInfo } from '@/types/next-auth';
import { attachRoleToGym } from '../_actions/attach-role-to-gym';
import { ErrorState } from './components/ErrorState';
import { LoadingState } from './components/LoadingState';
import { SuccessState } from './components/SuccessState';
export default function AttachToGymPage() {
	const { data: session, update } = useSession();

	const searchParams = useSearchParams();
	const gymname = searchParams.get('gymname');
	const gymid = searchParams.get('gymid');
	const hash = searchParams.get('hash');
	const newGym: GymInfo = {
		id: gymid as string,
		gym_name: gymname as string,
	};

	const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
		'loading',
	);
	const [message, setMessage] = useState('');

	const processAttachment = async () => {
		if (!gymname || !gymid || !hash) {
			setMessage(
				'Missing required gym information. Please scan a valid QR code.',
			);
			setStatus('error');
			return;
		}

		try {
			const result = await attachRoleToGym({ gymname, gymid, hash });

			if (result.success) {
				setMessage(result.message);
				// invalidiate this onboardedUsers query
				queryClient.invalidateQueries({ queryKey: ['onboardedUsers'] });
				// update the session with gym and other fileds
				// gym  =  { id : string , gym_name : string	}
				updateSesionWithGym(newGym, update);
				setStatus('success');
			} else {
				setMessage(result.message);
				setStatus('error');
			}
		} catch (err) {
			setMessage('An unexpected error occurred. Please try again later.');
			setStatus('error');
			console.error(err);
		}
	};

	useEffect(() => {
		processAttachment();
		// eslint-disable-next-line react-hooks/exhaustive-deps
		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	}, [processAttachment]);

	// Display appropriate component based on status
	if (status === 'loading') {
		return <LoadingState />;
	}

	if (status === 'error') {
		return (
			<ErrorState
				errorMessage={message}
				gymName={gymname}
				gymId={gymid}
				hash={hash}
				onRetry={() => {
					setStatus('success');
					setMessage('Successfully attached to gym on retry.');
				}}
			/>
		);
	}

	if (status === 'success') {
		return <SuccessState message={message} gymName={gymname || 'your gym'} />;
	}

	return null;
}
