// Import both QueryClient and onlineManager from '@tanstack/react-query'
import { QueryClient, onlineManager } from '@tanstack/react-query';

// Set up online manager only on the client-side
if (typeof window !== 'undefined') {
	onlineManager.setEventListener((setOnline) => {
		// Ensure navigator.onLine is checked before adding listeners
		setOnline(navigator.onLine);

		const onlineHandler = () => setOnline(true);
		const offlineHandler = () => setOnline(false);

		window.addEventListener('online', onlineHandler);
		window.addEventListener('offline', offlineHandler);

		// Cleanup function
		return () => {
			window.removeEventListener('online', onlineHandler);
			window.removeEventListener('offline', offlineHandler);
		};
	});
} else {
	// Optional: Set a default behavior for server-side or environments without window
	// For example, assume online by default during SSR/build
	onlineManager.setOnline(true);
}

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 5, // 5 minutes
			staleTime: 1000 * 60, // Reduce to 1 minute for more frequent updates
			refetchOnWindowFocus: true, // Enable refetch on window focus

			refetchOnMount: true, // Enable refetch when component mounts
			refetchOnReconnect: true, // Enable refetch on network reconnect
		},
		mutations: {
			// Pause mutations when offline and retry when online
			networkMode: 'online', // Ensures mutations only run when online
		},
	},
});

// Helper function to invalidate multiple queries
export const invalidateQueries = (queryKeys: string[]) => {
	for (const key of queryKeys) {
		queryClient.invalidateQueries({ queryKey: [key] });
	}
};
