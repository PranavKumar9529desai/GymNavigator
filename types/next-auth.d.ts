// next-auth.d.ts
import type { DefaultSession } from 'next-auth';

export type Rolestype = 'owner' | 'trainer' | 'client';

// Matches the backend response
export interface GymInfo {
	id: string;
	gym_name: string;
}

// Extend the default Session type to include custom fields
declare module 'next-auth' {
	interface Session {
		accessToken?: string;
		role: Rolestype;
		gym?: GymInfo;
		user: {
			name?: string;
			id?: string;
			picture?: string;
		} & DefaultSession['user'];
	}
	interface JWT {
		id?: string;
		role?: Rolestype;
		gym?: GymInfo;
		accessToken?: string;
	}
}

declare module 'next-auth' {
	interface User {
		id: string;
		name: string;
		email: string;
		role: Rolestype;
		gym?: GymInfo;
	}
}
