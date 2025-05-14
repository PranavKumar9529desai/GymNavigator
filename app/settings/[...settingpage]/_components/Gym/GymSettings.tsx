'use client';

import { useEffect, useState } from 'react';
import { Clock, MapPin, Settings } from 'lucide-react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetClose,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

// Import form components
import EditGeneralInfoForm from './EditGeneralInfoForm';
import EditOperatingHoursForm from './EditOperatingHoursForm';
import EditLocationForm from './EditLocationForm';

// Import server actions
import {
	getGymSettings,
	updateGymGeneralInfo,
	updateGymOperatingHours,
	updateGymLocation,
} from '../../_actions/gym-settings';

// Helper function to format time from 24h to 12h format
const formatTime = (time: string) => {
	const [hours, minutes] = time.split(':');
	const hour = parseInt(hours, 10);
	const ampm = hour >= 12 ? 'PM' : 'AM';
	const formattedHour = hour % 12 || 12;

	return `${formattedHour}:${minutes} ${ampm}`;
};

export default function GymSettings() {
	const [isLoading, setIsLoading] = useState(true);
	const [generalInfoOpen, setGeneralInfoOpen] = useState(false);
	const [operatingHoursOpen, setOperatingHoursOpen] = useState(false);
	const [locationOpen, setLocationOpen] = useState(false);
	const { toast } = useToast();

	const [gymData, setGymData] = useState({
		generalInfo: {
			name: '',
			email: '',
			phone: '',
		},
		operatingHours: {
			weekdays: { openingTime: '', closingTime: '' },
			weekends: { openingTime: '', closingTime: '' },
			holidays: { openingTime: '', closingTime: '' },
		},
		location: {
			address: '',
			city: '',
			state: '',
			postalCode: '',
			country: '',
		},
	});

	useEffect(() => {
		const fetchGymSettings = async () => {
			try {
				const data = await getGymSettings();
				setGymData(data);
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Failed to load gym settings',
					variant: 'destructive',
				});
				console.error('Error loading gym settings:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchGymSettings();
	}, [toast]);

	const handleGeneralInfoSave = async (data: {
		name: string;
		email: string;
		phone: string;
	}) => {
		const result = await updateGymGeneralInfo(
			data.name,
			data.email,
			data.phone,
		);

		if (result.success) {
			setGymData((prev) => ({
				...prev,
				generalInfo: data,
			}));
			setGeneralInfoOpen(false);
			return Promise.resolve();
		} else {
			return Promise.reject(new Error(result.error));
		}
	};

	const handleOperatingHoursSave = async (data: {
		weekdays: { openingTime: string; closingTime: string };
		weekends: { openingTime: string; closingTime: string };
		holidays: { openingTime: string; closingTime: string };
	}) => {
		const result = await updateGymOperatingHours(
			data.weekdays,
			data.weekends,
			data.holidays,
		);

		if (result.success) {
			setGymData((prev) => ({
				...prev,
				operatingHours: data,
			}));
			setOperatingHoursOpen(false);
			return Promise.resolve();
		} else {
			return Promise.reject(new Error(result.error));
		}
	};

	const handleLocationSave = async (data: {
		address: string;
		city: string;
		state: string;
		postalCode: string;
		country: string;
	}) => {
		const result = await updateGymLocation(
			data.address,
			data.city,
			data.state,
			data.postalCode,
			data.country,
		);

		if (result.success) {
			setGymData((prev) => ({
				...prev,
				location: data,
			}));
			setLocationOpen(false);
			return Promise.resolve();
		} else {
			return Promise.reject(new Error(result.error));
		}
	};

	return (
		<section className="px-4 py-6 pb-20 md:pb-6">
			<div className="max-w-3xl mx-auto">
				<div className="flex items-center mb-6">
					<Settings className="h-6 w-6 mr-2 text-blue-600" />
					<h2 className="text-2xl font-semibold">Gym Settings</h2>
				</div>

				<div className="space-y-6">
					{/* General Information Card */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg font-medium">
								General Information
							</CardTitle>
							<CardDescription>
								Configure your gym's basic settings and information here.
							</CardDescription>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<div className="space-y-4">
									<div className="flex justify-between items-center">
										<p className="text-sm font-medium">Gym Name</p>
										<Skeleton className="h-4 w-40" />
									</div>
									<Separator />
									<div className="flex justify-between items-center">
										<p className="text-sm font-medium">Contact Email</p>
										<Skeleton className="h-4 w-60" />
									</div>
									<Separator />
									<div className="flex justify-between items-center">
										<p className="text-sm font-medium">Phone Number</p>
										<Skeleton className="h-4 w-32" />
									</div>
								</div>
							) : (
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<p className="text-sm font-medium">Gym Name</p>
										<p className="text-sm text-muted-foreground">
											{gymData.generalInfo.name}
										</p>
									</div>
									<Separator />
									<div className="flex justify-between items-center">
										<p className="text-sm font-medium">Contact Email</p>
										<p className="text-sm text-muted-foreground">
											{gymData.generalInfo.email}
										</p>
									</div>
									<Separator />
									<div className="flex justify-between items-center">
										<p className="text-sm font-medium">Phone Number</p>
										<p className="text-sm text-muted-foreground">
											{gymData.generalInfo.phone}
										</p>
									</div>
								</div>
							)}
						</CardContent>
						<CardFooter>
							<Sheet open={generalInfoOpen} onOpenChange={setGeneralInfoOpen}>
								<SheetTrigger asChild>
									<Button
										variant="outline"
										className="w-full sm:w-auto"
										disabled={isLoading}
									>
										Edit Information
									</Button>
								</SheetTrigger>
								<SheetContent>
									<SheetHeader>
										<SheetTitle>Edit General Information</SheetTitle>
										<SheetDescription>
											Make changes to your gym's general information here. Click
											save when you're done.
										</SheetDescription>
									</SheetHeader>
									<EditGeneralInfoForm
										initialData={gymData.generalInfo}
										onSave={handleGeneralInfoSave}
										onCancel={() => setGeneralInfoOpen(false)}
									/>
								</SheetContent>
							</Sheet>
						</CardFooter>
					</Card>

					{/* Operating Hours Card */}
					<Card>
						<CardHeader>
							<div className="flex items-center">
								<Clock className="h-5 w-5 mr-2 text-blue-600" />
								<CardTitle className="text-lg font-medium">
									Operating Hours
								</CardTitle>
							</div>
							<CardDescription>
								Set your gym's operating hours and schedule.
							</CardDescription>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<div className="space-y-4">
									<Skeleton className="h-10 w-full" />
									<Skeleton className="h-10 w-full" />
									<Skeleton className="h-10 w-full" />
								</div>
							) : (
								<Accordion type="single" collapsible className="w-full">
									<AccordionItem value="weekdays">
										<AccordionTrigger className="text-sm font-medium">
											Weekdays (Mon-Fri)
										</AccordionTrigger>
										<AccordionContent>
											<div className="pl-4 py-2 space-y-2">
												<div className="flex justify-between text-sm">
													<span>Opening Time</span>
													<span className="text-muted-foreground">
														{formatTime(
															gymData.operatingHours.weekdays.openingTime,
														)}
													</span>
												</div>
												<div className="flex justify-between text-sm">
													<span>Closing Time</span>
													<span className="text-muted-foreground">
														{formatTime(
															gymData.operatingHours.weekdays.closingTime,
														)}
													</span>
												</div>
											</div>
										</AccordionContent>
									</AccordionItem>
									<AccordionItem value="weekends">
										<AccordionTrigger className="text-sm font-medium">
											Weekends (Sat-Sun)
										</AccordionTrigger>
										<AccordionContent>
											<div className="pl-4 py-2 space-y-2">
												<div className="flex justify-between text-sm">
													<span>Opening Time</span>
													<span className="text-muted-foreground">
														{formatTime(
															gymData.operatingHours.weekends.openingTime,
														)}
													</span>
												</div>
												<div className="flex justify-between text-sm">
													<span>Closing Time</span>
													<span className="text-muted-foreground">
														{formatTime(
															gymData.operatingHours.weekends.closingTime,
														)}
													</span>
												</div>
											</div>
										</AccordionContent>
									</AccordionItem>
									<AccordionItem value="holidays">
										<AccordionTrigger className="text-sm font-medium">
											Holidays
										</AccordionTrigger>
										<AccordionContent>
											<div className="pl-4 py-2 space-y-2">
												<div className="flex justify-between text-sm">
													<span>Opening Time</span>
													<span className="text-muted-foreground">
														{formatTime(
															gymData.operatingHours.holidays.openingTime,
														)}
													</span>
												</div>
												<div className="flex justify-between text-sm">
													<span>Closing Time</span>
													<span className="text-muted-foreground">
														{formatTime(
															gymData.operatingHours.holidays.closingTime,
														)}
													</span>
												</div>
											</div>
										</AccordionContent>
									</AccordionItem>
								</Accordion>
							)}
						</CardContent>
						<CardFooter>
							<Sheet
								open={operatingHoursOpen}
								onOpenChange={setOperatingHoursOpen}
							>
								<SheetTrigger asChild>
									<Button
										variant="outline"
										className="w-full sm:w-auto"
										disabled={isLoading}
									>
										Edit Hours
									</Button>
								</SheetTrigger>
								<SheetContent>
									<SheetHeader>
										<SheetTitle>Edit Operating Hours</SheetTitle>
										<SheetDescription>
											Update your gym's operating hours for different days of
											the week.
										</SheetDescription>
									</SheetHeader>
									<EditOperatingHoursForm
										initialData={gymData.operatingHours}
										onSave={handleOperatingHoursSave}
										onCancel={() => setOperatingHoursOpen(false)}
									/>
								</SheetContent>
							</Sheet>
						</CardFooter>
					</Card>

					{/* Gym Location Card */}
					<Card>
						<CardHeader>
							<div className="flex items-center">
								<MapPin className="h-5 w-5 mr-2 text-blue-600" />
								<CardTitle className="text-lg font-medium">
									Gym Location
								</CardTitle>
							</div>
							<CardDescription>
								Update your gym's address and location information.
							</CardDescription>
						</CardHeader>
						<CardContent>
							{isLoading ? (
								<div className="space-y-4">
									<div className="flex justify-between items-center">
										<p className="text-sm font-medium">Address</p>
										<Skeleton className="h-4 w-40" />
									</div>
									<Separator />
									<div className="flex justify-between items-center">
										<p className="text-sm font-medium">City</p>
										<Skeleton className="h-4 w-32" />
									</div>
									<Separator />
									<div className="flex justify-between items-center">
										<p className="text-sm font-medium">State/Province</p>
										<Skeleton className="h-4 w-16" />
									</div>
									<Separator />
									<div className="flex justify-between items-center">
										<p className="text-sm font-medium">Postal Code</p>
										<Skeleton className="h-4 w-24" />
									</div>
									<Separator />
									<div className="flex justify-between items-center">
										<p className="text-sm font-medium">Country</p>
										<Skeleton className="h-4 w-32" />
									</div>
								</div>
							) : (
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<p className="text-sm font-medium">Address</p>
										<p className="text-sm text-muted-foreground">
											{gymData.location.address}
										</p>
									</div>
									<Separator />
									<div className="flex justify-between items-center">
										<p className="text-sm font-medium">City</p>
										<p className="text-sm text-muted-foreground">
											{gymData.location.city}
										</p>
									</div>
									<Separator />
									<div className="flex justify-between items-center">
										<p className="text-sm font-medium">State/Province</p>
										<p className="text-sm text-muted-foreground">
											{gymData.location.state}
										</p>
									</div>
									<Separator />
									<div className="flex justify-between items-center">
										<p className="text-sm font-medium">Postal Code</p>
										<p className="text-sm text-muted-foreground">
											{gymData.location.postalCode}
										</p>
									</div>
									<Separator />
									<div className="flex justify-between items-center">
										<p className="text-sm font-medium">Country</p>
										<p className="text-sm text-muted-foreground">
											{gymData.location.country}
										</p>
									</div>
								</div>
							)}
						</CardContent>
						<CardFooter>
							<Sheet open={locationOpen} onOpenChange={setLocationOpen}>
								<SheetTrigger asChild>
									<Button
										variant="outline"
										className="w-full sm:w-auto"
										disabled={isLoading}
									>
										Edit Location
									</Button>
								</SheetTrigger>
								<SheetContent>
									<SheetHeader>
										<SheetTitle>Edit Gym Location</SheetTitle>
										<SheetDescription>
											Update your gym's address and location information.
										</SheetDescription>
									</SheetHeader>
									<EditLocationForm
										initialData={gymData.location}
										onSave={handleLocationSave}
										onCancel={() => setLocationOpen(false)}
									/>
								</SheetContent>
							</Sheet>
						</CardFooter>
					</Card>
				</div>
			</div>
		</section>
	);
}
