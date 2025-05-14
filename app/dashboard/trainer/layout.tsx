import type React from 'react';
import { auth } from '../../(auth)/auth';

export default async function layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();
	const IsMemberOfGym = !!session?.gym;

	return <>{IsMemberOfGym ? children : <NotMemberOfGym />}</>;
}
const NotMemberOfGym = () => {
	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-2xl font-bold">Not Member of Gym</h1>
			<p className="mt-4 text-gray-600">
				Please contact your trainer for
				<span className="text-lg font-semibold text-blue-300">
					{' '}
					onboarding.
				</span>
			</p>
		</div>
	);
};
