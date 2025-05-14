'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';

interface GeneralInfo {
	name: string;
	email: string;
	phone: string;
}

interface EditGeneralInfoFormProps {
	initialData: GeneralInfo;
	onSave: (data: GeneralInfo) => Promise<void>;
	onCancel: () => void;
}

export default function EditGeneralInfoForm({
	initialData,
	onSave,
	onCancel,
}: EditGeneralInfoFormProps) {
	const [formData, setFormData] = useState<GeneralInfo>(initialData);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			await onSave(formData);
			toast({
				title: 'Success',
				description: 'Gym information updated successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update gym information',
				variant: 'destructive',
			});
			console.error('Error updating gym information:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 pt-4">
			<div className="space-y-2">
				<Label htmlFor="name">Gym Name</Label>
				<Input
					id="name"
					name="name"
					value={formData.name}
					onChange={handleChange}
					placeholder="Enter gym name"
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="email">Contact Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					value={formData.email}
					onChange={handleChange}
					placeholder="Enter contact email"
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="phone">Phone Number</Label>
				<Input
					id="phone"
					name="phone"
					value={formData.phone}
					onChange={handleChange}
					placeholder="Enter phone number"
					required
				/>
			</div>

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
