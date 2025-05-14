import bundleAnalyzer from '@next/bundle-analyzer';
import withPWA from 'next-pwa';
// We will define custom runtimeCaching below
// import runtimeCaching from "next-pwa/cache";

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Configure for Cloudflare Pages deployment
	// output: "standalone",

	// SWC Compiler Configuration

	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'source.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'cdn.muscleandstrength.com',
			},
			{
				protocol: 'https',
				hostname: 'avatar-placeholder.iran.liara.run',
			},
			{
				protocol: 'https',
				hostname: 'avatar.iran.liara.run',
			},
		],
	},

	// Removed experimental.serverActions to satisfy Next.js 15 config requirements

	async headers() {
		return [
			{
				source: '/:path*', // Apply to all routes
				headers: [
					{
						key: 'Host',
						value: 'admin.gymnavigator.in',
					},
					{
						// Prevent iframe embedding
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						// Prevent MIME type sniffing
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						// Force HTTPS
						key: 'Strict-Transport-Security',
						value: 'max-age=31536000; includeSubDomains',
					},
					{
						// Broader CSP for React Three Fiber and 3D components
						key: 'Content-Security-Policy',
						value:
							"default-src 'self'; connect-src 'self' https://cdn.jsdelivr.net https://*.pmnd.rs https://*.githubusercontent.com https://raw.githack.com; img-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline'; font-src 'self' https://cdn.jsdelivr.net data:; worker-src 'self' blob:; frame-src 'self' https://*.youtube.com https://youtube.com https://*.youtube-nocookie.com;",
					},
					{
						// Prevent XSS attacks
						key: 'X-XSS-Protection',
						value: '1; mode=block',
					},
				],
			},
		];
	},
	// Fix for invalid regex in troika-three-text
	webpack: (config) => {
		// Create a custom rule to exclude troika-three-text from normal processing
		config.module.rules.unshift({
			test: /troika-three-text\.esm\.js$/,
			loader: require.resolve('string-replace-loader'),
			options: {
				search: /\\p\{Script=Hangul\}/u,
				replace: '\\uAC00-\\uD7A3', // Hangul Unicode range
				flags: 'g',
			},
		});

		return config;
	},
};

export default withPWA({
	dest: 'public',
	disable: process.env.NODE_ENV === 'development',
	register: true, // Ensure service worker is registered
	skipWaiting: true, // Ensure new service worker activates immediately
	runtimeCaching: [
		// Default caching strategies from next-pwa/cache
		...require('next-pwa/cache'),
		// Custom caching strategy for the diet API
		{
			urlPattern: /^https?:\/\/.*\/api\/diet\/today$/i, // Match the diet API endpoint
			handler: 'NetworkFirst', // Try network first, fallback to cache
			options: {
				cacheName: 'diet-api-cache',
				expiration: {
					maxEntries: 10, // Cache up to 10 responses
					maxAgeSeconds: 60 * 60 * 24 * 7, // Cache for 1 week
				},
				networkTimeoutSeconds: 3, // Timeout for network request before falling back to cache
				cacheableResponse: {
					statuses: [0, 200], // Cache successful responses and opaque responses
				},
			},
		},
		// Cache client dashboard pages (NetworkFirst to prioritize freshness)
		{
			urlPattern: /\/dashboard\/client\/.*/i, // Match client dashboard routes
			handler: 'NetworkFirst',
			options: {
				cacheName: 'client-dashboard-pages',
				expiration: {
					maxEntries: 20, // Cache up to 20 client pages
					maxAgeSeconds: 60 * 60 * 24 * 7, // Cache for 1 week
				},
				cacheableResponse: {
					statuses: [0, 200], // Cache successful and opaque responses
				},
			},
		},
	],
})(withBundleAnalyzer(nextConfig));
