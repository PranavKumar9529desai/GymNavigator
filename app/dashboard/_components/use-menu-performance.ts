'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook to measure and log menu rendering performance
 * This is useful for development and can be disabled in production
 */
export function useMenuPerformance(label: string = 'Menu') {
	const [renderTime, setRenderTime] = useState<number>(0);
	const [renderCount, setRenderCount] = useState<number>(0);

	// Track component renders
	useEffect(() => {
		const start = performance.now();
		const currentCount = renderCount; // Capture current count to avoid dependency loop

		return () => {
			const end = performance.now();
			const time = end - start;
			setRenderTime((prev) => prev + time);
			setRenderCount((prev) => prev + 1);

			// Only log in development
			if (process.env.NODE_ENV === 'development') {
				console.log(
					`[Performance] ${label} render #${currentCount + 1}: ${time.toFixed(2)}ms`,
				);
			}
		};
	}, [label]); // Remove renderCount from dependencies

	// Log accumulated metrics
	const logMetrics = useCallback(() => {
		if (renderCount === 0) return;

		// Only log if we have a reasonable number of renders to report
		// This prevents excessive logging during development
		if (renderCount > 5) {
			const avgTime = renderTime / renderCount;
			console.log(`[Performance Summary] ${label}:`);
			console.log(`  - Total renders: ${renderCount}`);
			console.log(`  - Total render time: ${renderTime.toFixed(2)}ms`);
			console.log(`  - Average render time: ${avgTime.toFixed(2)}ms`);
		}
	}, [label, renderCount, renderTime]);

	useEffect(() => {
		// Log metrics when component unmounts
		return () => {
			if (process.env.NODE_ENV === 'development') {
				logMetrics();
			}
		};
	}, [logMetrics]);

	return { renderTime, renderCount, logMetrics };
}

/**
 * A no-op function that doesn't track performance
 * Used when performance tracking is disabled
 */
export function useMenuPerformanceDisabled() {
	return {
		renderTime: 0,
		renderCount: 0,
		logMetrics: () => {},
	};
}

/**
 * Returns the appropriate hook based on environment
 */
/**
 * Set to true to disable performance metrics even in development
 */
const DISABLE_PERFORMANCE_METRICS = false;

export const useMenuPerformanceMetrics =
	process.env.NODE_ENV === 'development' && !DISABLE_PERFORMANCE_METRICS
		? useMenuPerformance
		: useMenuPerformanceDisabled;
