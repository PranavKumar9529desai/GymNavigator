'use server';

import {
	type ApiResult,
	type UserInfoResponse,
	authClient,
} from '@/lib/AxiosInstance/Signin/sign-in-client';

/**
 * Server action to check if a user email exists in the system or to get user by ID
 * @param email The email address to check, or empty string if using userId
 * @param userId Optional user ID to look up instead of email
 * @returns Response indicating whether the email exists and any associated role
 */
export async function getUserByEmail(
	email: string,
	userId?: string,
): Promise<ApiResult<UserInfoResponse>> {
	if (userId) {
		console.log('Getting user by ID:', userId);
		return authClient.getUserInfoById(userId);
	}
	
	console.log('Checking email existence for:', email);
	return authClient.getUserInfo(email);
}
