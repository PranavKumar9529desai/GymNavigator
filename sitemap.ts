import type { MetadataRoute } from 'next';
import { generateStaticParams } from '@/app/gym/[gymname]/page';

const siteUrl = 'https://admin.gymnavigator.in';

/**
 * Sitemap configuration for Next.js app router
 * Helps search engines better index your site
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Static routes that should be indexed
	const staticRoutes = [
		{
			url: siteUrl,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 1,
		},
		{
			url: `${siteUrl}/gym`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.8,
		},
		{
			url: `${siteUrl}/trainer`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/client`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 0.7,
		},
		// Dashboard main routes
		{
			url: `${siteUrl}/dashboard/owner`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.9,
		},
		{
			url: `${siteUrl}/dashboard/trainer`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.9,
		},
		{
			url: `${siteUrl}/dashboard/client`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.9,
		},
		// Owner dashboard sub-routes
		{
			url: `${siteUrl}/dashboard/owner/attendance`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.8,
		},
		{
			url: `${siteUrl}/dashboard/owner/attendance/todaysattendance`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/owner/attendance/showqr`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/owner/gymdetails`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.8,
		},
		{
			url: `${siteUrl}/dashboard/owner/gymdetails/viewgymdetails`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/owner/trainers`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.8,
		},
		{
			url: `${siteUrl}/dashboard/owner/trainers/viewtrainers`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/owner/trainers/userstrainersassignment`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/owner/onboarding`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 0.8,
		},
		{
			url: `${siteUrl}/dashboard/owner/onboarding/onboarding`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/owner/onboarding/onboardedusers`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/owner/onboarding/onboardingqr`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 0.7,
		},
		// Trainer dashboard sub-routes
		{
			url: `${siteUrl}/dashboard/trainer/workouts`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.8,
		},
		{
			url: `${siteUrl}/dashboard/trainer/workouts/createworkout`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/trainer/workouts/assignworkout`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/trainer/diet`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.8,
		},
		{
			url: `${siteUrl}/dashboard/trainer/diet/createdietplan`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/trainer/diet/assigndietplan`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/trainer/attendance`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.8,
		},
		{
			url: `${siteUrl}/dashboard/trainer/attendance/todaysattendance`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/trainer/attendance/showqr`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/trainer/assignedusers`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.8,
		},
		// Client dashboard sub-routes
		{
			url: `${siteUrl}/dashboard/client/home`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.8,
		},
		{
			url: `${siteUrl}/dashboard/client/home/gym`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/client/home/dashboard`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/client/workouts`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.8,
		},
		{
			url: `${siteUrl}/dashboard/client/workouts/viewworkout`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/client/workouts/allworkouts`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/client/diet`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.8,
		},
		{
			url: `${siteUrl}/dashboard/client/diet/viewdiet`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/client/diet/grocerylist`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/client/diet/eatingoutguide`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/client/attendance`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.8,
		},
		{
			url: `${siteUrl}/dashboard/client/attendance/viewattendance`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
		{
			url: `${siteUrl}/dashboard/client/attendance/markattendance`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.7,
		},
	];

	// Home pages routes (at root level since (home) is a route group)
	const homeRoutes = [
		{
			url: `${siteUrl}/about`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 0.8,
		},
		{
			url: `${siteUrl}/contact`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 0.8,
		},
		{
			url: `${siteUrl}/pricing`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 0.8,
		},
	];

	// Static assets that should be indexed
	const staticAssets = [
		{
			url: `${siteUrl}/gymnavigator-og.jpg`,
			lastModified: new Date(),
			changeFrequency: 'yearly' as const,
			priority: 0.1,
		},
		{
			url: `${siteUrl}/icon.png`,
			lastModified: new Date(),
			changeFrequency: 'yearly' as const,
			priority: 0.1,
		},
		{
			url: `${siteUrl}/apple-touch-icon.png`,
			lastModified: new Date(),
			changeFrequency: 'yearly' as const,
			priority: 0.1,
		},
	];

	// Get gym routes from the same function that generates static paths
	try {
		const gymParams = await generateStaticParams();
		const dynamicRoutes = gymParams.map((param) => ({
			url: `${siteUrl}/gym/${encodeURIComponent(param.gymname)}`,
			lastModified: new Date(),
			changeFrequency: 'daily' as const,
			priority: 0.6,
		}));

		return [...staticRoutes, ...homeRoutes, ...staticAssets, ...dynamicRoutes];
	} catch (error) {
		console.error('Error generating dynamic sitemap routes:', error);
		return [...staticRoutes, ...homeRoutes, ...staticAssets];
	}
}
