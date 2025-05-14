'use client';

import UserprofileImage from '@/assests/gymd.webp';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Award, Calendar, MapPin, Phone, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useState } from 'react';

// TOOD send data to the backend
export default function UserProfileCard() {
	const [userData, setUserData] = useState({
		name: 'John Doe',
		challengeName: '30-Day Fitness Challenge',
		joinedDate: undefined as Date | undefined,
		completionDate: undefined as Date | undefined,
		contact: '',
		address: '',
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setUserData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleDateChange = (
		date: Date | undefined,
		field: 'joinedDate' | 'completionDate',
	) => {
		setUserData((prevData) => ({ ...prevData, [field]: date }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Submitting user data:', userData);
		// Add logic to send data to backend here
		alert('the new alert is triggred after the form submission');
	};

	return (
		<div className="bg-slate-100 flex px-4 py-2 lg:w-full min-h-screen justify-center items-center lg:px-1 lg:py-1">
			<Card className="w-full max-w-md mx-auto">
				<CardHeader className="bg-gradient-to-tr from-blue-600 to-violet-600 text-white p-4">
					<div className="flex items-center">
						<div className="relative w-20 h-20 mr-4">
							<Image
								src={UserprofileImage}
								alt={`${userData.name}'s profile picture`}
								layout="fill"
								objectFit="cover"
								className="rounded-full border-2 border-white"
							/>
						</div>
						<div>
							<h2 className="text-2xl font-bold">{userData.name}</h2>
							<p className="text-blue-200 flex items-center text-nowrap text-sm lg:text-base">
								<Award className="w-4 h-4 mr-1 text-yellow-400" />
								{userData.challengeName}
							</p>
						</div>
					</div>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className="p-6 space-y-4">
						<div>
							<Label>Start Date</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant={'outline'}
										className={cn(
											'w-full justify-start text-left font-normal',
											!userData.joinedDate && 'text-muted-foreground',
										)}
									>
										<Calendar className="mr-2 h-4 w-4" />
										{userData.joinedDate ? (
											format(userData.joinedDate, 'PPP')
										) : (
											<span>Pick a date</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<CalendarComponent
										mode="single"
										selected={userData.joinedDate}
										onSelect={(date) => handleDateChange(date, 'joinedDate')}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>
						<div>
							<Label>Completion Date</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant={'outline'}
										className={cn(
											'w-full justify-start text-left font-normal',
											!userData.completionDate && 'text-muted-foreground',
										)}
									>
										<Calendar className="mr-2 h-4 w-4" />
										{userData.completionDate ? (
											format(userData.completionDate, 'PPP')
										) : (
											<span>Pick a date</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<CalendarComponent
										mode="single"
										selected={userData.completionDate}
										onSelect={(date) =>
											handleDateChange(date, 'completionDate')
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>
						<div>
							<Label>Contact</Label>
							<div className="flex items-center">
								<Phone className="w-4 h-4 mr-2 text-purple-600" />
								<Input
									id="contact"
									name="contact"
									type="tel"
									value={userData.contact}
									onChange={handleInputChange}
									placeholder="Enter your phone number"
									required
								/>
							</div>
						</div>
						<div>
							<Label>Address</Label>
							<div className="flex items-center">
								<MapPin className="w-4 h-4 mr-2 text-red-600" />
								<Input
									id="address"
									name="address"
									type="text"
									value={userData.address}
									onChange={handleInputChange}
									placeholder="Enter your address (optional)"
								/>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button
							type="submit"
							className="w-full bg-gradient-to-tr from-blue-600 to-violet-600 "
						>
							Save Profile
							<TrendingUp className="ml-2 w-5 h-5" />
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
