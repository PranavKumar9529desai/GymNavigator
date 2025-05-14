'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Import the type definitions
import type { PasswordCredential } from '@/types/credential-management';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import GoogleButton from '../../ui/googleButton';
import FormError from '../../ui/form-error';
// Make sure the types are imported (no need to explicitly import the global declarations)
import '@/types/credential-management';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// After successful login, store the credentials
const storeCredentials = async (email: string, password: string) => {
	// Check if Credential Management API is supported
	if ('credentials' in navigator && window.PasswordCredential) {
		try {
			const cred = new window.PasswordCredential({
				id: email,
				password: password,
				name: email,
				iconURL: `${window.location.origin}/favicon.ico`,
			});
			await navigator.credentials.store(cred);
		} catch (e) {
			console.error('Error storing credentials:', e);
		}
	}
};

export default function SignInForm() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [magicLinkEmail, setMagicLinkEmail] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [magicLinkLoading, setMagicLinkLoading] = useState(false);
	const [error, setError] = useState<string>('');
	const [type, setType] = useState<'success' | 'fail' | null>(null);
	const Router = useRouter();

	// For debugging
	console.log('Current form error state:', { error, type });

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);
		setError('');
		setType(null);
		toast.dismiss(); // Clear any existing toasts

		try {
			// Use NextAuth's signIn directly - auth.config.ts handles the authentication logic
			const result = await signIn('credentials', {
				redirect: false,
				email,
				password,
			});

			if (result?.error) {
				console.log('SignIn error from NextAuth:', result.error);

				// Parse the error JSON if it exists
				let errorMessage = 'Failed to sign in';
				let errorCode = 'UNKNOWN_ERROR';

				// Special handling for common NextAuth errors
				if (result.error === 'Configuration') {
					errorMessage = 'Invalid email or password';
					errorCode = 'INVALID_CREDENTIALS';
				} else if (result.error.includes('CallbackRouteError')) {
					// Extract the actual error message if it's a CallbackRouteError
					if (result.error.includes('INVALID_CREDENTIALS')) {
						errorMessage = 'The email or password you entered is incorrect';
						errorCode = 'INVALID_CREDENTIALS';
					} else if (result.error.includes('USER_NOT_FOUND')) {
						errorMessage = 'No account found with this email address';
						errorCode = 'USER_NOT_FOUND';
					} else {
						errorMessage = 'Authentication failed';
						errorCode = 'AUTH_ERROR';
					}
				} else {
					try {
						const parsedError = JSON.parse(result.error);
						console.log('Parsed error:', parsedError);
						errorMessage = parsedError.message || errorMessage;
						errorCode = parsedError.error || errorCode;
					} catch (e) {
						console.log('Error parsing JSON:', e);
						errorMessage = result.error;
					}
				}

				console.log('Final error message and code:', {
					errorMessage,
					errorCode,
				});

				// First set the error message before setting type
				setError(errorMessage);
				// Then set the type to ensure FormError renders
				setType('fail');

				// Map error codes to user-friendly messages
				switch (errorCode) {
					case 'USER_NOT_FOUND':
						setError('No account found with this email address');
						toast.error('Account not found', {
							description: 'No account found with this email address',
						});
						break;
					case 'INVALID_CREDENTIALS':
						setError('The email or password you entered is incorrect');
						toast.error('Invalid credentials', {
							description: 'The email or password you entered is incorrect',
						});
						break;
					case 'SERVER_ERROR':
						setError('Server error. Please try again later');
						toast.error('Server error', {
							description: 'Please try again later',
						});
						break;
					default:
						setError(errorMessage || 'Sign in failed');
						toast.error('Sign in failed', {
							description: errorMessage,
						});
				}
			} else if (result?.ok) {
				setType('success');
				setError('Sign in successful! Redirecting...');
				toast.success('Welcome back!', {
					description: 'Redirecting to dashboard...',
				});
				await storeCredentials(email, password);
				Router.push('/dashboard');
			}
		} catch (error) {
			console.error('Failed to sign in:', error);
			setType('fail');
			setError('An unexpected error occurred');
			toast.error('Sign in error', {
				description: 'An unexpected error occurred',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleMagicLinkSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setMagicLinkLoading(true);
		setError('');
		setType(null);
		toast.dismiss();
		
		if (!magicLinkEmail.trim()) {
			setError('Please enter your email address');
			setType('fail');
			toast.error('Email required', {
				description: 'Please enter your email address',
			});
			setMagicLinkLoading(false);
			return;
		}

		try {
			// Use NextAuth's signIn with email provider
			const result = await signIn('email', {
				email: magicLinkEmail,
				redirect: false,
				callbackUrl: '/dashboard',
			});

			if (result?.error) {
				console.log('Magic link error:', result.error);
				setType('fail');
				setError('Failed to send magic link');
				toast.error('Magic link error', {
					description: 'Failed to send magic link. Please try again.',
				});
			} else {
				setType('success');
				setError('Check your email for a sign-in link!');
				toast.success('Magic link sent!', {
					description: 'Check your email for a sign-in link.',
				});
			}
		} catch (error) {
			console.error('Failed to send magic link:', error);
			setType('fail');
			setError('An unexpected error occurred');
			toast.error('Magic link error', {
				description: 'An unexpected error occurred. Please try again.',
			});
		} finally {
			setMagicLinkLoading(false);
		}
	};

	const handleGoogleSignIn = async () => {
		setLoading(true);
		setError('');
		setType(null);
		toast.dismiss(); // Clear any existing toasts

		try {
			toast.loading('Connecting to Google...');

			// Use NextAuth's Google provider directly
			// auth.config.ts handles the verification with our backend
			await signIn('google', {
				callbackUrl: '/dashboard',
			});

			// Note: No need for additional success logic here since the page will redirect
			// and the signIn callback in auth.config.ts handles the verification
		} catch (error) {
			console.error('Failed to sign in with Google:', error);
			// Important: Set both error message and type
			setType('fail');
			setError('Failed to sign in with Google');
			toast.error('Google Sign-in failed', { description: 'Please try again' });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="md:flex justify-center px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md p-8 rounded-xl">
				{/* Form Status Banner - Force re-render when error or type changes */}
				<div key={`error-${error}-${type}`} className="mb-4">
					{error && type && (
						<div className="animate-fadeIn">
							<FormError
								FormErrorProps={{
									message: error,
									type: type,
								}}
							/>
						</div>
					)}
				</div>

				<Tabs defaultValue="password" className="w-full mb-6">
					<TabsList className="grid w-full grid-cols-2 mb-6">
						<TabsTrigger value="password">Password</TabsTrigger>
						<TabsTrigger value="magic-link">Magic Link</TabsTrigger>
					</TabsList>
					
					<TabsContent value="password">
						<form
							onSubmit={handleSubmit}
							className="space-y-6"
							name="login"
							id="login-form"
							method="post"
							autoComplete="on"
						>
							<div className="space-y-2">
								<Label htmlFor="email" className="text-gray-300">
									Email Address
								</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
									<Input
										id="email"
										name="email"
										type="email"
										placeholder="john@example.com"
										className="pl-10 bg-blue-950/30 border-blue-500/30 text-white placeholder:text-gray-400"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										disabled={loading}
										autoComplete="email"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password" className="text-gray-300">
									Password
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
									<Input
										id="password"
										name="password"
										placeholder="Your password"
										type={showPassword ? 'text' : 'password'}
										className="pl-10 pr-10 bg-blue-950/30 border-blue-500/30 text-white placeholder:text-gray-400"
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										disabled={loading}
										autoComplete="current-password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-3 text-blue-400 hover:text-blue-300 focus:outline-none"
										aria-label={showPassword ? 'Hide password' : 'Show password'}
									>
										{showPassword ? (
											<EyeOff className="h-5 w-5" />
										) : (
											<Eye className="h-5 w-5" />
										)}
									</button>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
								disabled={loading}
								name="login-button"
							>
								{loading ? 'Signing in...' : 'Sign In'}
							</Button>
						</form>
					</TabsContent>
					
					<TabsContent value="magic-link">
						<form
							onSubmit={handleMagicLinkSubmit}
							className="space-y-6"
							name="magic-link-login"
							id="magic-link-form"
							method="post"
						>
							<div className="space-y-2">
								<Label htmlFor="magic-link-email" className="text-gray-300">
									Email Address
								</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
									<Input
										id="magic-link-email"
										name="email"
										type="email"
										placeholder="john@example.com"
										className="pl-10 bg-blue-950/30 border-blue-500/30 text-white placeholder:text-gray-400"
										required
										value={magicLinkEmail}
										onChange={(e) => setMagicLinkEmail(e.target.value)}
										disabled={magicLinkLoading}
									/>
								</div>
							</div>

							<Button
								type="submit"
								className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
								disabled={magicLinkLoading}
							>
								{magicLinkLoading ? 'Sending link...' : 'Send Magic Link'}
							</Button>
							
							<div className="text-center text-sm text-gray-400 mt-2">
								We'll email you a magic link for a password-free sign in.
							</div>
						</form>
					</TabsContent>
				</Tabs>

				<div className="relative my-6">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t border-blue-500/30" />
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 bg-blue-900/20 text-gray-300">
							Or continue with
						</span>
					</div>
				</div>

				<GoogleButton handleSubmit={handleGoogleSignIn} />

				<div className="mt-6 text-center text-sm text-gray-300">
					Don&apos;t have an account?{' '}
					<a
						href="/signup"
						className="font-medium text-blue-400 hover:text-blue-300"
					>
						Sign up
					</a>
				</div>
			</div>
		</div>
	);
}
