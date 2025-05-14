import GymDomImage from '@/assests/gymd.webp';
import type { Metadata } from 'next';
import Image from 'next/image';
import type React from 'react';

export const metadata: Metadata = {
	openGraph: {
		title: 'GymNavigator',
		description: 'Professional gym management solution',
		images: [
			{
				url: GymDomImage.src,
				width: 1200,
				height: 630,
				alt: 'GymNavigator Preview',
			},
		],
		type: 'website',
	},
};

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-black to-gray-950">
			{/* Centered Content */}
			<div className="min-h-screen md:flex flex-col items-center justify-center px-4 py-10">
				{/* Centered Logo with Name */}
				<div className="mb-10 flex flex-col items-center">
					<div className="relative h-16 w-16 mb-4">
						<Image
							src="/android-chrome-512x512.png"
							alt="GymNavigator Logo"
							fill
							priority
							className="object-contain"
						/>
					</div>
					<h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
						<span className="font-black">Gym</span>
						<span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent font-black">
							Navigator
						</span>
					</h1>
					<span className="text-white/45 text-sm py-1 italic">
						Your Gym Manager
					</span>
				</div>

				{/* Auth Form */}
				<div className="w-full max-w-md relative z-10">{children}</div>
			</div>

			{/* Background effects */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl -top-[250px] -left-[250px]" />
				<div className="absolute w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-3xl -bottom-[200px] -right-[200px]" />
			</div>
		</main>
	);
}
