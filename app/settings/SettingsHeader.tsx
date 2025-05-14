'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SettingsHeaderProps {
	title: string;
}

export default function SettingsHeader({ title }: SettingsHeaderProps) {
	const router = useRouter();
	return (
		<header className="sticky top-0 z-10 bg-background border-b">
			<div className="flex items-center h-16 px-4 gap-3">
				<Button
					onClick={() => router.back()}
					variant="ghost"
					size="icon"
					aria-label="Go back"
					className="min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-offset-2"
				>
					<ChevronLeft className="h-5 w-5" />
				</Button>
				<h1 className="text-lg font-semibold truncate" title={title}>
					{title}
				</h1>
			</div>
		</header>
	);
}
