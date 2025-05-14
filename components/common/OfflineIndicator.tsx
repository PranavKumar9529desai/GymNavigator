'use client';

import { useOnlineStatus } from '@/providers/QueryClientProvider';
import { useEffect, useState } from 'react';

export default function OfflineIndicator() {
	const isOnline = useOnlineStatus();
	// Initialize state based on the initial context value, but manage visibility with useEffect
	const [showIndicator, setShowIndicator] = useState(!isOnline);

	// Use useEffect to manage the visibility with a slight delay to avoid flicker
	// and ensure it runs only on the client
	useEffect(() => {
		if (!isOnline) {
			setShowIndicator(true);
		} else {
			// Hide after a delay when back online
			const timer = setTimeout(() => setShowIndicator(false), 2000); // Hide after 2 seconds
			return () => clearTimeout(timer); // Cleanup timer on unmount or if status changes again
		}
	}, [isOnline]);

	// Don't render anything on the server or if the indicator shouldn't be shown
	if (typeof window === 'undefined' || !showIndicator) {
		return null;
	}

	return (
		<div
			style={{
				position: 'fixed',
				bottom: '10px',
				left: '10px',
				backgroundColor: 'rgba(0, 0, 0, 0.7)',
				color: 'white',
				padding: '8px 15px',
				borderRadius: '5px',
				zIndex: 10000, // Ensure it's on top
				fontSize: '0.9rem',
				animation: 'fadeIn 0.5s ease-out', // Optional fade-in animation
			}}
		>
			You are currently offline. Some features may be limited.
			{/* Basic CSS animation */}
			<style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
		</div>
	);
}
