// This is just the configuration for auth.js
// The runtime directive is in the auth.ts file which handles the authentication logic
import type { AdapterUser } from '@auth/core/adapters';
import type { Profile } from '@auth/core/types';
import type { Account, NextAuthConfig, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import SignupSA from '@/app/(common)/_actions/auth/signup-with-credentials';
import { getUserByEmail } from '../(common)/_actions/auth/get-userinfo';
import { getGoogleSignupRole } from '../(common)/_actions/auth/google-role-server-action';
import SigninSA from '../(common)/_actions/auth/signin-with-credentials';
import { checkUserExists } from '..//(common)/_actions/auth/check-user-exists';
import SigninGoogleSA from '..//(common)/_actions/auth/signin-with-google';
import SignupWithGoogle from '..//(common)/_actions/auth/signup-with-google';
import type { GymInfo, Rolestype } from '@/types/next-auth';
import { getUserByPhone } from '../(common)/_actions/auth/get-user-by-phone';
import { verifyOtpToken } from '../(common)/_actions/auth/otp-utils';

// Import the relevant types from the auth client
import type {
	ApiResult,
	SigninResponseType,
	UserInfoResponse,
} from '@/lib/AxiosInstance/Signin/sign-in-client';
import type { RoleType } from '@/lib/AxiosInstance/Signup/sign-up-client';

// Extended User interface to include gymInfo property
interface ExtendedUser extends User {
	gymInfo?: GymInfo;
}

// Environment configuration
const isProduction = process.env.NODE_ENV === 'production';

// Centralized logger that respects environment
const logger = {
	// biome-ignore lint/suspicious/noExplicitAny: Logger needs to accept any argument types
	log: (...args: any[]) => !isProduction && console.log(...args),
	// biome-ignore lint/suspicious/noExplicitAny: Logger needs to accept any argument types
	error: (...args: any[]) => console.error(...args),
};

// Centralized error handler
const createError = (message: string, errorCode: string) => {
	return new Error(JSON.stringify({ message, error: errorCode }));
};

// Auth handlers extracted for better organization
const authHandlers = {
	// Handle sign-in attempt
	async handleSignIn(email: string, password: string): Promise<User> {
		const userFromDB = await getUserByEmail(email);

		if (!userFromDB || !userFromDB.success) {
			throw createError('User not found', 'USER_NOT_FOUND');
		}

		const result = await SigninSA(email, password);
		console.log('SignIn result from backend:', result);

		if (!result.success || !result.data) {
			// Make sure we have a properly formatted error
			const errorMessage = result.error?.message || 'Failed to login';
			const errorCode = result.error?.code || 'LOGIN_FAILED';

			console.log('Throwing error:', { errorMessage, errorCode });
			throw createError(errorMessage, errorCode);
		}

		const userData = result.data;
		console.log('User data from signin handler', userData);

		return {
			id: userData.user.id,
			name: userData.user.name,
			email: userData.user.email,
			role: userData.user.role as Rolestype,
			gym: userData.user.gym
				? {
						gym_name: userData.user.gym.name,
						id: String(userData.user.gym.id),
					}
				: undefined,
		};
	},

	// Handle sign-up attempt
	async handleSignUp(
		role: string,
		name: string,
		email: string,
		password: string,
	): Promise<User> {
		console.log('signup handler is called');

		// Use the appropriate method from signup client instead
		const userExistsResult = await checkUserExists(email);
		if (userExistsResult.success && userExistsResult.data === true) {
			throw createError('User already exists', 'USER_EXISTS');
		}

		const signupResult = await SignupSA(role, name, email, password);

		// Check if the API call was successful and contains data
		if (!signupResult.success || !signupResult.data) {
			throw createError(
				signupResult.error?.message || 'Failed to create user',
				signupResult.error?.code || 'SIGNUP_FAILED',
			);
		}

		// Extract the user data from the API result
		const userData = signupResult.data;
		console.log('User data from signup handler:', userData);

		return {
			id: userData.id,
			name: userData.name,
			email: userData.email,
			role: role as Rolestype,
		};
	},

	// Handle phone OTP verification
	async handlePhoneOtpVerification(phoneNumber: string, otpCode: string): Promise<User> {
		// Verify the OTP code
		const isValid = await verifyOtpToken(phoneNumber, otpCode);
		
		if (!isValid) {
			throw createError('Invalid verification code or code expired', 'INVALID_OTP');
		}
		
		// If OTP is valid, get the user associated with this phone
		const userResult = await getUserByPhone(phoneNumber);
		
		if (!userResult.success || !userResult.exists || !userResult.userId) {
			throw createError('No account found with this phone number', 'USER_NOT_FOUND');
		}
		
		// For simplicity in this implementation, we're simulating getting user data
		// In a real implementation, you'd fetch full user data from the backend using the userId
		// This would typically require a separate endpoint or extending getUserByEmail to accept userId
		
		// Simulated user data return
		return {
			id: userResult.userId,
			name: "User", // This would come from the backend in a real implementation
			email: "user@example.com", // This would come from the backend in a real implementation
			role: "client" as Rolestype, // This would come from the backend in a real implementation
		};
	},
};

const authConfig: NextAuthConfig = {
	secret: process.env.NEXTAUTH_SECRET,

	providers: [
		Credentials({
			credentials: {
				name: {},
				email: {},
				password: {},
				role: {},
				phoneNumber: {},
				otpCode: {},
				isPhoneSignIn: {},
			},
			async authorize(credentials): Promise<User | null> {
				// Handle phone OTP sign-in
				if (credentials?.isPhoneSignIn === 'true') {
					if (!credentials?.phoneNumber || !credentials?.otpCode) {
						throw createError(
							'Phone number and verification code are required',
							'INVALID_OTP_CREDENTIALS',
						);
					}
					
					const { phoneNumber, otpCode } = credentials as {
						phoneNumber: string;
						otpCode: string;
					};
					
					try {
						return await authHandlers.handlePhoneOtpVerification(phoneNumber, otpCode);
					} catch (error) {
						logger.error('Phone OTP verification error:', error);
						
						// Make sure we're throwing a properly formatted error
						if (error instanceof Error) {
							try {
								JSON.parse(error.message);
								// If parsing succeeds, it's already formatted, just rethrow
								throw error;
							} catch {
								// If parsing fails, wrap it in our format
								throw createError(error.message, 'OTP_AUTH_ERROR');
							}
						}
						
						throw error;
					}
				}
				
				// Existing email-password authentication code
				if (!credentials?.email || !credentials?.password) {
					throw createError(
						'Email and password are required',
						'INVALID_CREDENTIALS',
					);
				}

				const { email, password, name, role } = credentials as {
					email: string;
					password: string;
					name?: string;
					role?: string;
				};

				// Determine if this is sign-up or sign-in
				const isSignUp = Boolean(role && name);

				try {
					// Route to appropriate handler
					if (isSignUp && role && name) {
						return await authHandlers.handleSignUp(role, name, email, password);
					}
					return await authHandlers.handleSignIn(email, password);
				} catch (error) {
					logger.error('Authentication error:', error);

					// Make sure we're throwing a properly formatted error
					if (error instanceof Error) {
						// Try to determine if this is already a JSON-formatted error
						try {
							JSON.parse(error.message);
							// If parsing succeeds, it's already formatted, just rethrow
							throw error;
						} catch {
							// If parsing fails, wrap it in our format
							throw createError(error.message, 'AUTH_ERROR');
						}
					}

					throw error;
				}
			},
		}),

		EmailProvider({
			server: {
				host: process.env.EMAIL_SERVER_HOST,
				port: Number(process.env.EMAIL_SERVER_PORT),
				auth: {
					user: process.env.EMAIL_SERVER_USER,
					pass: process.env.EMAIL_SERVER_PASSWORD,
				},
			},
			from: process.env.EMAIL_FROM,
			maxAge: 10 * 60, // Magic links are valid for 10 minutes
		}),
		
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		
		GitHub,
	],

	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 7 * 24 * 60 * 60, // 7 days
	},

	cookies: {
		sessionToken: {
			name: 'next-auth.session-token',
			options: {
				httpOnly: true,
				sameSite: 'lax',
				path: '/',
				secure: isProduction,
			},
		},
	},

	callbacks: {
		async redirect({ url, baseUrl }) {
			// First, handle relative URLs properly
			if (url.startsWith('/')) {
				// For relative URLs, check if they contain role parameter in the query string
				if (url.includes('?') && url.includes('role=')) {
					const [path, query] = url.split('?');
					const params = new URLSearchParams(query);
					const role = params.get('role');

					if (role) {
						params.delete('role');
						const newQuery = params.toString();
						return `${baseUrl}${path}${newQuery ? `?${newQuery}` : ''}`;
					}
				}
				// If no processing needed, return the URL joined with baseUrl
				return `${baseUrl}${url}`;
			}

			// For absolute URLs, we can use the URL constructor safely
			try {
				const urlObj = new URL(url);

				// Only process URLs from the same origin
				if (urlObj.origin === baseUrl) {
					const role = urlObj.searchParams.get('role');
					if (role) {
						urlObj.searchParams.delete('role');
						return urlObj.toString();
					}
				}

				// Default: if same origin, return the URL, otherwise return baseUrl
				return urlObj.origin === baseUrl ? url : baseUrl;
			} catch (error) {
				console.error('Error processing redirect URL:', error);
				return baseUrl;
			}
		},

		async signIn(params: {
			user: User | AdapterUser;
			account: Account | null;
			profile?: Profile;
			email?: { verificationRequest?: boolean };
			credentials?: Record<string, unknown>;
		}) {
			const { user, account, profile } = params;
			console.log('user is received from the signin callback', user);

			// Only process special cases (like Google)
			if (!account || account.provider !== 'google' || !user?.email) {
				return true;
			}

			try {
				// Optimize by fetching user data only once for Google sign-in
				const userFromDb: ApiResult<UserInfoResponse> = await getUserByEmail(
					user.email,
				);

				console.log('userFromDb is from the signin callback', userFromDb);

				// Handle the case where the user doesn't exist (needs signup)
				if (userFromDb.success && userFromDb.data && !userFromDb.data.exists) {
					console.log('New Google user, creating account');

					// Get name from profile or user object
					const userName =
						user.name || profile?.name || profile?.given_name || 'Google User';

					// Get the role from the cookie
					const selectedRole = await getGoogleSignupRole();

					// If no role was found in the cookie, redirect to role selection page
					if (!selectedRole) {
						// Return a URL to redirect to role selection
						return '/selectrole';
					}

					console.log('Signing up with Google:', {
						name: userName,
						email: user.email,
						role: selectedRole,
					});

					// Create a new user with Google signup
					const signupResult = await SignupWithGoogle(
						userName,
						user.email,
						selectedRole as RoleType,
					);

					console.log('Google signup result:', signupResult);

					if (!signupResult.success) {
						logger.error('Failed to create Google user:', signupResult.error);
						return false;
					}

					// After successful signup, proceed with signin
					const response = await SigninGoogleSA(user.email);

					if (response.success && response.data) {
						// Store the user data from the backend in the user object
						user.id = response.data.user.id;
						user.role = response.data.user.role as Rolestype;
						user.name = response.data.user.name;
						user.email = response.data.user.email;

						// Add custom properties for gym info
						(user as ExtendedUser).gymInfo = response.data.user.gym
							? {
									gym_name: response.data.user.gym.name,
									id: String(response.data.user.gym.id),
								}
							: undefined;

						return true;
					}

					return false;
				}

				// Handle the case where the user exists
				if (userFromDb.success && userFromDb.data && userFromDb.data.exists) {
					const response: ApiResult<SigninResponseType> = await SigninGoogleSA(
						user.email,
					);

					if (response.success && response.data) {
						// Store the user data from the backend in the user object
						user.id = response.data.user.id;
						user.role = response.data.user.role as Rolestype;
						user.name = response.data.user.name;
						user.email = response.data.user.email;

						// Add custom properties for gym info
						(user as ExtendedUser).gymInfo = response.data.user.gym
							? {
									gym_name: response.data.user.gym.name,
									id: String(response.data.user.gym.id),
								}
							: undefined;

						return true;
					}

					return false;
				}

				// Handle other error cases
				logger.error('User lookup failed:', userFromDb.error);
				return false;
			} catch (error) {
				logger.error('Google sign-in error:', error);
				return false;
			}
		},

		async jwt({ token, user, trigger, session }) {
			// Add user data to token on first creation
			if (user) {
				token.role = user.role;
				token.id = user.id;
				token.sub = user.id; // Ensure sub is set to our database ID

				// Handle gym info from custom property for Google auth
				if ((user as ExtendedUser).gymInfo) {
					token.gym = (user as ExtendedUser).gymInfo;
				}
				// Regular credential flow
				else if (user.gym) {
					token.gym = {
						gym_name: user.gym.gym_name,
						id: String(user.gym.id),
					};
				}
			}

			// Handle session updates
			if (trigger === 'update' && session) {
				return { ...token, ...session };
			}
			return token;
		},

		async session({ session, token }) {
			if (token) {
				// Structure session according to the defined type
				session.user.id = token.sub as string;
				session.role = token.role as Rolestype;
				session.gym = token.gym as GymInfo;

				// Only attach access token if it exists
				if (token.accessToken) {
					session.accessToken = token.accessToken as string;
				}
			}
			return session;
		},
	},

	trustHost: true,
	pages: {
		signIn: '/signin',
		error: '/auth/error',
		verifyRequest: '/verify-request',
	},
	debug: !isProduction,
};

export default authConfig;
