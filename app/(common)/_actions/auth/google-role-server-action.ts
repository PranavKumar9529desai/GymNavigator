'use server';

import type { Rolestype } from '@/types/next-auth';
import { cookies } from 'next/headers';

/**
 * Stores the selected role in a server-side cookie for Google sign-up flow
 */
export async function storeGoogleSignupRole(role: Rolestype): Promise<boolean> {
	try {
		// Set a cookie that will be available during Google callback
		(
			await // Set a cookie that will be available during Google callback
			cookies()
		).set({
			name: 'google_signup_role',
			value: role,
			// Expires in 10 minutes - just enough time to complete the signup flow
			maxAge: 60 * 10,
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		});

		return true;
	} catch (error) {
		console.error('Error storing Google signup role:', error);
		return false;
	}
}

/**
 * Retrieves the selected role from server-side cookie
 */
export async function getGoogleSignupRole(): Promise<Rolestype | undefined> {
	try {
		const role = (await cookies()).get('google_signup_role')?.value as
			| Rolestype
			| undefined;
		return role;
	} catch (error) {
		console.error('Error retrieving Google signup role:', error);
		return undefined;
	}
}
