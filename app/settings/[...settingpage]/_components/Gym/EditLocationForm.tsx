'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { z } from 'zod';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LocationInfo {
	address: string;
	city: string;
	state: string;
	postalCode: string;
	country: string; // Will always be "India" but kept for API compatibility
}

interface EditLocationFormProps {
	initialData: LocationInfo;
	onSave: (data: LocationInfo) => Promise<void>;
	onCancel: () => void;
}

// List of Indian states and union territories
const indianStates = [
	'Andhra Pradesh',
	'Arunachal Pradesh',
	'Assam',
	'Bihar',
	'Chhattisgarh',
	'Goa',
	'Gujarat',
	'Haryana',
	'Himachal Pradesh',
	'Jharkhand',
	'Karnataka',
	'Kerala',
	'Madhya Pradesh',
	'Maharashtra',
	'Manipur',
	'Meghalaya',
	'Mizoram',
	'Nagaland',
	'Odisha',
	'Punjab',
	'Rajasthan',
	'Sikkim',
	'Tamil Nadu',
	'Telangana',
	'Tripura',
	'Uttar Pradesh',
	'Uttarakhand',
	'West Bengal',
	'Andaman and Nicobar Islands',
	'Chandigarh',
	'Dadra and Nagar Haveli and Daman and Diu',
	'Delhi',
	'Jammu and Kashmir',
	'Ladakh',
	'Lakshadweep',
	'Puducherry',
];

// PIN code validation schema using Zod
const pinCodeSchema = z.string().refine((val) => /^\d{6}$/.test(val), {
	message: 'PIN code must be exactly 6 digits',
});

export default function EditLocationForm({
	initialData,
	onSave,
	onCancel,
}: EditLocationFormProps) {
	const [formData, setFormData] = useState<LocationInfo>(initialData);
	const [isLoading, setIsLoading] = useState(false);
	const [pinCodeError, setPinCodeError] = useState<string | null>(null);
	const [isLookingUpPinCode, setIsLookingUpPinCode] = useState(false);
	const { toast } = useToast();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		// Clear error when user starts typing again
		if (name === 'postalCode') {
			setPinCodeError(null);

			// Auto-lookup when PIN code is exactly 6 digits
			if (value.length === 6 && /^\d{6}$/.test(value)) {
				lookupPinCode(value);
			}
		}
	};

	const handleSelectChange = (field: keyof LocationInfo, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	// Function to lookup PIN code and auto-fill city and state
	const lookupPinCode = async (pincode: string) => {
		setIsLookingUpPinCode(true);

		try {
			// Validate PIN code format first
			pinCodeSchema.parse(pincode);

			// Call the India Post API
			const response = await fetch(
				`https://api.postalpincode.in/pincode/${pincode}`,
			);
			const data = await response.json();

			if (
				data &&
				data[0]?.Status === 'Success' &&
				data[0]?.PostOffice?.length > 0
			) {
				const postOffice = data[0].PostOffice[0];

				// Update city and state based on PIN code
				setFormData((prev) => ({
					...prev,
					city: postOffice.District,
					state: postOffice.State,
				}));

				toast({
					title: 'PIN Code Found',
					description: `Found details for ${pincode}`,
				});
			} else {
				setPinCodeError(
					'Invalid PIN code or no data available for this PIN code',
				);
			}
		} catch (error) {
			if (error instanceof z.ZodError) {
				setPinCodeError(error.errors[0]?.message || 'Invalid PIN code format');
			} else {
				setPinCodeError('Failed to lookup PIN code information');
				console.error('Error looking up PIN code:', error);
			}
		} finally {
			setIsLookingUpPinCode(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Validate PIN code before saving
			try {
				pinCodeSchema.parse(formData.postalCode);
			} catch (error) {
				if (error instanceof z.ZodError) {
					setPinCodeError(
						error.errors[0]?.message || 'Invalid PIN code format',
					);
					setIsLoading(false);
					return;
				}
			}

			await onSave(formData);
			toast({
				title: 'Success',
				description: 'Gym location updated successfully',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to update gym location',
				variant: 'destructive',
			});
			console.error('Error updating gym location:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4 pt-4">
			<div className="space-y-2">
				<Label htmlFor="address">Address</Label>
				<Input
					id="address"
					name="address"
					value={formData.address}
					onChange={handleChange}
					placeholder="Enter street address"
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="city">City</Label>
				<Input
					id="city"
					name="city"
					value={formData.city}
					onChange={handleChange}
					placeholder="Enter city"
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="state">State/Province</Label>
				<Select
					value={formData.state}
					onValueChange={(value) => handleSelectChange('state', value)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select state/province" />
					</SelectTrigger>
					<SelectContent>
						{indianStates.map((state) => (
							<SelectItem key={state} value={state}>
								{state}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-2">
				<Label htmlFor="postalCode">PIN Code</Label>
				<div className="relative">
					<Input
						id="postalCode"
						name="postalCode"
						value={formData.postalCode}
						onChange={handleChange}
						placeholder="Enter 6-digit PIN code"
						required
						className={pinCodeError ? 'border-red-500 pr-10' : ''}
						maxLength={6}
						inputMode="numeric"
					/>
					{isLookingUpPinCode && (
						<div className="absolute right-3 top-1/2 -translate-y-1/2">
							<Spinner className="h-4 w-4" />
						</div>
					)}
				</div>
				{pinCodeError && (
					<Alert variant="destructive" className="mt-2 py-2">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{pinCodeError}</AlertDescription>
					</Alert>
				)}
			</div>

			<div className="space-y-2">
				<Label htmlFor="country">Country</Label>
				<Input id="country" name="country" value="India" disabled readOnly />
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
