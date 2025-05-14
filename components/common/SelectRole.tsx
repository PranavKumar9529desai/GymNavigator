'use client';
import SignupWithGoogle from '@/app/(common)/_actions/auth/signup-with-google';
import { updateSessionWithRole } from '@/app/(common)/_actions/session/updateSessionWithRole';
import type { Rolestype } from '@/types/next-auth';
import { Card, CardContent } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import type {
	ApiResult,
	GoogleSignupResponseType,
} from '@/lib/AxiosInstance/Signup/sign-up-client';
import { useSession } from '@/node_modules/next-auth/react';
import { AnimatePresence, m } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
const roles = [
	{
		title: 'Gym Owner',
		description: 'Manage your gym facilities and operations',
		value: 'owner',
	},
	{
		title: 'Trainer',
		description: 'Manage your clients and training sessions',
		value: 'trainer',
	},
	{
		title: 'Client',
		description: 'Access your sales plans and track progress',
		value: 'client',
	},
];

export default function SelectRole() {
	const [isOpen, setIsOpen] = useState(true);
	const [loading, setLoading] = useState(false);
	const [selectedRole, setSelectedRole] = useState<string | null>(null);
	const { data: session, update } = useSession();
	const router = useRouter();

	const handleRoleSelect = async (role: string) => {
		setSelectedRole(role);
		setLoading(true);
		console.log('role is this ', role);
		try {
			if (session?.user?.name && session?.user?.email) {
				const response: ApiResult<GoogleSignupResponseType> =
					await SignupWithGoogle(
						session?.user?.name,
						session?.user?.email,
						role as 'owner' | 'trainer' | 'client',
					);

				if (response?.data?.name && response.data?.role) {
					// @ts-ignore
					await updateSessionWithRole(response.data.role as Rolestype, update);
				}
			}

			router.push(`/dashboard/${role}`);
		} catch (error) {
			console.error('Error selecting role:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-[600px] bg-white text-gray-800 border-gray-200">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-center text-gray-900">
						Select Your Role
					</DialogTitle>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					<AnimatePresence>
						{roles.map((role, index) => (
							<m.div
								key={role.value}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
							>
								<Card
									className={`cursor-pointer transition-all duration-300 hover:scale-105
                    ${
											selectedRole === role.value
												? 'border-blue-500 bg-blue-50'
												: 'bg-gray-50 border-gray-200 hover:bg-gray-100'
										}
                    ${loading ? 'pointer-events-none opacity-50' : ''}`}
									onClick={() => handleRoleSelect(role.value)}
								>
									<CardContent className="p-6">
										<h3 className="text-xl font-semibold mb-2 text-gray-900">
											{role.title}
										</h3>
										<p className="text-gray-600">{role.description}</p>
									</CardContent>
								</Card>
							</m.div>
						))}
					</AnimatePresence>
				</div>

				{loading && (
					<div className="flex items-center justify-center gap-2 text-gray-700">
						<Loader2 className="h-5 w-5 animate-spin" />
						<span>Setting up your account...</span>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
