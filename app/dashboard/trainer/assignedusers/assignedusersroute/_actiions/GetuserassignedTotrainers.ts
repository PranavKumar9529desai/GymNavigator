'use server';
import { TrainerReqConfig } from '@/lib/AxiosInstance/trainerAxios';
import { AxiosResponse } from 'axios';
export interface AssignedUserResponse {
	msg: string;
	users: AssignedUser[];
}

export interface AssignedUser {
	id: string;
	name: string;
	email: string;
	gender: string;
	dietaryPreference: string;
	membershipStatus: 'active' | 'inactive';
	activeWorkoutPlanId: number | null;
	activeWorkoutPlanName: string | null;
	hasActiveWorkoutPlan: boolean;
	dietPlanId: number | null;
	dietPlanName: string | null;
	hasActiveDietPlan: boolean;
}

export const getUsersAssignedToTrainer = async (): Promise<AssignedUser[]> => {
	const trainerAxios = await TrainerReqConfig();
	try {
		const response: AxiosResponse<AssignedUserResponse> =
			await trainerAxios.get('/client/assignedusers');
		console.log(
			'response.data from the getUsersAssignedToTrainer',
			response.data,
		);
		if (response.data.msg === 'success' && Array.isArray(response.data.users)) {
			return response.data.users.map((user: AssignedUser) => ({
				id: user.id,
				name: user.name,
				email: user.email,
				gender: user.gender || 'Not specified',
				dietaryPreference: user.dietaryPreference || 'Not specified',
				membershipStatus: 'active',
				activeWorkoutPlanId: user.activeWorkoutPlanId || null,
				activeWorkoutPlanName: user.activeWorkoutPlanName || null,
				hasActiveWorkoutPlan: !!user.activeWorkoutPlanId,
				dietPlanId: user.dietPlanId || null,
				dietPlanName: user.dietPlanName || null,
				hasActiveDietPlan: !!user.dietPlanId,
			}));
		}
		console.log(
			'response.data from the getUsersAssignedToTrainer',
			response.data,
		);
		return [];
	} catch (error) {
		console.error('Error fetching assigned users:', error);
		return [];
	}
};
