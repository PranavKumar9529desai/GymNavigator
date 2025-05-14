import type React from 'react';

export default function DietLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="w-full max-w-full sm:container sm:mx-auto px-0 sm:px-4">
			{children}
		</div>
	);
}
