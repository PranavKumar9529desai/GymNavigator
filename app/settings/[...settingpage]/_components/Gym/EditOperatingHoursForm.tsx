'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TimeSlot {
	openingTime: string;
	closingTime: string;
}

interface OperatingHours {
	weekdays: TimeSlot;
	weekends: TimeSlot;
	holidays: TimeSlot;
}

interface EditOperatingHoursFormProps {
	initialData: OperatingHours;
	onSave: (data: OperatingHours) => Promise<void>;
	onCancel: () => void;
}

export default function EditOperatingHoursForm({
	initialData,
	onSave,
	onCancel,
}: EditOperatingHoursFormProps) {
	const [formData, setFormData] = useState<OperatingHours>(initialData);
	const [isLoading, setIsLoading] = useState(false);
	const [activeTab, setActiveTab] = useState('weekdays');
	const { toast } = useToast();

	const handleChange = (
		period: keyof OperatingHours,
		field: keyof TimeSlot,
		value: string,
	) => {
		setFormData((prev) => ({
			...prev,
			[period]: {
				...prev[period],
				[field]: value,
			},
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await onSave(formData);
			toast({
				title: 'Success',
				description: 'Operating hours updated successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update operating hours',
				variant: 'destructive',
			});
			console.error('Error updating operating hours:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 pt-4">
			<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="weekdays">Weekdays</TabsTrigger>
					<TabsTrigger value="weekends">Weekends</TabsTrigger>
					<TabsTrigger value="holidays">Holidays</TabsTrigger>
				</TabsList>

				<TabsContent value="weekdays" className="mt-4 space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="weekdaysOpeningTime">Opening Time</Label>
							<Input
								id="weekdaysOpeningTime"
								type="time"
								value={formData.weekdays.openingTime}
								onChange={(e) =>
									handleChange('weekdays', 'openingTime', e.target.value)
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="weekdaysClosingTime">Closing Time</Label>
							<Input
								id="weekdaysClosingTime"
								type="time"
								value={formData.weekdays.closingTime}
								onChange={(e) =>
									handleChange('weekdays', 'closingTime', e.target.value)
								}
								required
							/>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="weekends" className="mt-4 space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="weekendsOpeningTime">Opening Time</Label>
							<Input
								id="weekendsOpeningTime"
								type="time"
								value={formData.weekends.openingTime}
								onChange={(e) =>
									handleChange('weekends', 'openingTime', e.target.value)
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="weekendsClosingTime">Closing Time</Label>
							<Input
								id="weekendsClosingTime"
								type="time"
								value={formData.weekends.closingTime}
								onChange={(e) =>
									handleChange('weekends', 'closingTime', e.target.value)
								}
								required
							/>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="holidays" className="mt-4 space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="holidaysOpeningTime">Opening Time</Label>
							<Input
								id="holidaysOpeningTime"
								type="time"
								value={formData.holidays.openingTime}
								onChange={(e) =>
									handleChange('holidays', 'openingTime', e.target.value)
								}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="holidaysClosingTime">Closing Time</Label>
							<Input
								id="holidaysClosingTime"
								type="time"
								value={formData.holidays.closingTime}
								onChange={(e) =>
									handleChange('holidays', 'closingTime', e.target.value)
								}
								required
							/>
						</div>
					</div>
				</TabsContent>
			</Tabs>

			<div className="flex gap-2 justify-end pt-4">
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					disabled={isLoading}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={isLoading}>
					{isLoading ? <Spinner className="mr-2 h-4 w-4" /> : null}
					Save Changes
				</Button>
			</div>
		</form>
	);
}
