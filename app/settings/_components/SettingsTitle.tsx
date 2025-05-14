'use client';

interface SettingsTitleProps {
	title: string;
	description?: string;
}

export default function SettingsTitle({
	title,
	description,
}: SettingsTitleProps) {
	return (
		<div className="space-y-2 mb-6">
			<h1 className="text-2xl font-bold tracking-tight">{title}</h1>
			{description && (
				<p className="text-sm text-muted-foreground">{description}</p>
			)}
		</div>
	);
}
