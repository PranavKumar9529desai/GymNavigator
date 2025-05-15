import { SigninReqConfig } from './sign-in-axios';

// Define the standard API response format from backend
export interface ApiResponse<T = unknown> {
	success: boolean;
	message: string;
	data?: T;
	error?: string;
}

// Define the standardized result format for frontend
export interface ApiResult<T> {
	success: boolean;
	data?: T;
	error?: {
		code: string;
		message: string;
	};
}

// Define auth-specific types
export type Rolestype = 'owner' | 'trainer' | 'client';

export interface SigninResponseType {
	token: string;
	user: {
		id: string;
		name: string;
		email: string;
		role: Rolestype;
		gym_id?: string | null;
		gym?: {
			id: number;
			name: string;
		} | null;
	};
}

// Update the UserInfoResponse type to include the exists flag
export interface UserInfoResponse {
	exists: boolean;
	role?: Rolestype;
}

// Update interfaces to handle the exists flag
export interface GoogleAuthResponse extends SigninResponseType {
	exists: boolean;
}

/**
 * Authentication API client with typed methods for all login-related operations
 */
export const authClient = {
	/**
	 * Sign in with email and password
	 */
	signInWithCredentials: async (
		email: string,
		password: string,
	): Promise<ApiResult<SigninResponseType>> => {
		try {
			const axiosInstance = await SigninReqConfig();
			const response = await axiosInstance.get('/login', {
				params: { email, password },
			});

			const apiResponse = response.data as ApiResponse<SigninResponseType>;

			if (!apiResponse.success) {
				return {
					success: false,
					error: {
						code: apiResponse.error || 'UNKNOWN_ERROR',
						message: apiResponse.message || 'Unknown error occurred',
					},
				};
			}

			return {
				success: true,
				data: apiResponse.data,
			};
		} catch (error: unknown) {
			// The error is already formatted by the axios interceptor
			return error as ApiResult<never>;
		}
	},

	/**
	 * Sign in with Google
	 */
	signInWithGoogle: async (
		email: string,
	): Promise<ApiResult<GoogleAuthResponse>> => {
		try {
			const axiosInstance = await SigninReqConfig();
			const response = await axiosInstance.get('/google', {
				params: { email },
			});

			const apiResponse = response.data as ApiResponse<
				GoogleAuthResponse | { exists: boolean }
			>;

			// Handle user doesn't exist case
			if (
				apiResponse.success &&
				apiResponse.data &&
				'exists' in apiResponse.data &&
				!apiResponse.data.exists
			) {
				return {
					success: true,
					data: {
						exists: false,
						token: '',
						user: {
							id: '',
							name: '',
							email: '',
							role: 'client',
						},
					} as GoogleAuthResponse,
				};
			}

			// Handle normal success case
			if (apiResponse.success) {
				return {
					success: true,
					data: apiResponse.data as GoogleAuthResponse,
				};
			}

			// Handle error case
			return {
				success: false,
				error: {
					code: apiResponse.error || 'UNKNOWN_ERROR',
					message: apiResponse.message || 'Unknown error occurred',
				},
			};
		} catch (error: unknown) {
			// Handle network errors or other unexpected issues
			if (error && typeof error === 'object') {
				return {
					success: false,
					error: {
						code: 'REQUEST_FAILED',
						message: 'Failed to authenticate with Google',
					},
				};
			}

			return error as ApiResult<never>;
		}
	},

	/**
	 * Get user information by email
	 */
	getUserInfo: async (email: string): Promise<ApiResult<UserInfoResponse>> => {
		try {
			const axiosInstance = await SigninReqConfig();
			const response = await axiosInstance.get('/getuserinfo', {
				params: { email },
			});

			const apiResponse = response.data as ApiResponse<UserInfoResponse>;

			if (!apiResponse.success) {
				return {
					success: false,
					error: {
						code: apiResponse.error || 'UNKNOWN_ERROR',
						message: apiResponse.message || 'Unknown error occurred',
					},
				};
			}

			return {
				success: true,
				data: apiResponse.data,
			};
		} catch (error: unknown) {
			// Handle network errors or other unexpected issues
			if (error && typeof error === 'object') {
				return {
					success: false,
					error: {
						code: 'REQUEST_FAILED',
						message: 'Failed to check user existence',
					},
				};
			}

			return {
				success: false,
				error: {
					code: 'UNKNOWN_ERROR',
					message: 'An unknown error occurred',
				},
			};
		}
	},

	/**
	 * Get user information by ID
	 */
	getUserInfoById: async (userId: string): Promise<ApiResult<UserInfoResponse>> => {
		try {
			const axiosInstance = await SigninReqConfig();
			const response = await axiosInstance.get('/getuserinfobyid', {
				params: { userId },
			});

			const apiResponse = response.data as ApiResponse<UserInfoResponse>;

			if (!apiResponse.success) {
				return {
					success: false,
					error: {
						code: apiResponse.error || 'UNKNOWN_ERROR',
						message: apiResponse.message || 'Unknown error occurred',
					},
				};
			}

			return {
				success: true,
				data: apiResponse.data,
			};
		} catch (error: unknown) {
			// Handle network errors or other unexpected issues
			if (error && typeof error === 'object') {
				return {
					success: false,
					error: {
						code: 'REQUEST_FAILED',
						message: 'Failed to retrieve user information',
					},
				};
			}

			return {
				success: false,
				error: {
					code: 'UNKNOWN_ERROR',
					message: 'An unknown error occurred',
				},
			};
		}
	},
};
