'use client';
import { queryClient } from '@/lib/getQueryClient';
import { experimental_createPersister } from '@tanstack/query-persist-client-core';
// import { experimental_createPersister } from "@tanstack/react-persist-client-core";
import {
	HydrationBoundary,
	QueryClientProvider as TanstackQueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
	type ReactNode,
	useEffect,
	useState,
	createContext,
	useContext,
} from 'react';

// Context for online status
const OnlineStatusContext = createContext<boolean>(true);

export const useOnlineStatus = () => useContext(OnlineStatusContext);

export default function QueryClientProvider({
	children,
	dehydratedState, // receive the dehydrated state, if available
}: {
	children: ReactNode;
	dehydratedState?: unknown;
}) {
	const [isMounted, setIsMounted] = useState(false);
	const [isOnline, setIsOnline] = useState(true); // Default to true

	useEffect(() => {
		// Set initial online status
		if (typeof navigator !== 'undefined') {
			setIsOnline(navigator.onLine);
		}

		// Add event listeners for online/offline changes
		const handleOnline = () => {
			console.log('App is online');
			setIsOnline(true);
			// Optionally trigger query refetches on reconnect
			queryClient.invalidateQueries();
		};
		const handleOffline = () => {
			console.log('App is offline');
			setIsOnline(false);
		};

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		// Persister setup
		if (typeof window !== 'undefined') {
			(async () => {
				try {
					const { createStore, del, get, set } = await import('idb-keyval');
					const store = createStore('tanstack-query', 'persisted-queries');

					console.log('Initializing IndexedDB store...');

					const storage = {
						getItem: async (key: string) => {
							const value = await get(key, store);
							console.log('Retrieved from IndexedDB:', { key, value });
							return value ?? null;
						},
						setItem: async (key: string, value: unknown) => {
							console.log('Storing in IndexedDB:', { key, value });
							await set(key, value, store);
						},
						removeItem: async (key: string) => {
							console.log('Removing from IndexedDB:', key);
							await del(key, store);
						},
					};

					const persister = experimental_createPersister({
						storage,
						maxAge: 1000 * 60 * 60 * 24,
						serialize: (data) => JSON.stringify(data),
						deserialize: (data) => JSON.parse(data as string),
						buster: 'v1',
					});

					queryClient.setDefaultOptions({
						queries: {
							...queryClient.getDefaultOptions().queries,
							// @ts-ignore
							persister,
						},
					});

					console.log('IndexedDB persister initialized successfully');
				} catch (error) {
					console.error(
						'FATAL: Error initializing IndexedDB persister:',
						error,
					);
					// Handle the error appropriately, e.g., notify the user or disable offline features
				} finally {
					// Ensure mounted state is set even if persister fails,
					// allowing the app to render without persistence.
					setIsMounted(true);
				}
			})();
		} else {
			// If not in a browser environment, just mark as mounted
			setIsMounted(true);
		}

		// Cleanup event listeners on unmount
		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, []);

	// Render null or a loading indicator until mounted to avoid hydration issues
	if (!isMounted) {
		// You might want to return a loading spinner here instead of null
		return null;
	}

	return (
		<OnlineStatusContext.Provider value={isOnline}>
			<TanstackQueryClientProvider client={queryClient}>
				<HydrationBoundary state={dehydratedState ?? {}}>
					{children}
				</HydrationBoundary>
				<ReactQueryDevtools initialIsOpen={false} />
			</TanstackQueryClientProvider>
		</OnlineStatusContext.Provider>
	);
}
