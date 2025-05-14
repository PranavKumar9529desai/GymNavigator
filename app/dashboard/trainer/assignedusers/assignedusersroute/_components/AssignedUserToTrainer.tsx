'use client';
import { DataCard } from '@/components/Table/UserCard';
import { DataTable } from '@/components/Table/UsersTable';
import { StatusCard } from '@/components/common/StatusCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import {
	ArrowUpDown,
	Dumbbell,
	Search,
	UserCheck,
	Users,
	UtensilsCrossed,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { AssignedUser } from '../_actiions/GetuserassignedTotrainers';
import { getUsersAssignedToTrainer } from '../_actiions/GetuserassignedTotrainers';

const columns: ColumnDef<AssignedUser>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
			>
				User Name
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => {
			const router = useRouter();
			return (
				<div
					className="cursor-pointer hover:text-primary"
					onClick={() =>
						row.original.id &&
						router.push(
							`/dashboard/trainer/assignedusers/assignedusersroute/${row.original.id}`,
						)
					}
					onKeyUp={() =>
						row.original.id &&
						router.push(
							`/dashboard/trainer/assignedusers/assignedusersroute/${row.original.id}`,
						)
					}
				>
					{row.getValue('name')}
				</div>
			);
		},
	},
	{
		accessorKey: 'activeWorkoutPlan',
		header: 'Workout Plan',
		cell: ({ row }) => {
			const hasWorkoutPlan = row.original.hasActiveWorkoutPlan;
			const planName = row.original.activeWorkoutPlanName;

			return (
				<div className="flex items-center gap-2">
					{hasWorkoutPlan ? (
						<Badge className="bg-green-100 text-green-800 hover:bg-green-200">
							<Dumbbell className="w-3 h-3 mr-1" />
							{planName}
						</Badge>
					) : (
						<Badge variant="secondary" className="bg-gray-100 text-gray-600">
							No Active Plan
						</Badge>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: 'dietPlan',
		header: 'Diet Plan',
		cell: ({ row }) => {
			const hasDietPlan = row.original.hasActiveDietPlan;
			const planName = row.original.dietPlanName;

			return (
				<div className="flex items-center gap-2">
					{hasDietPlan ? (
						<Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
							<UtensilsCrossed className="w-3 h-3 mr-1" />
							{planName}
						</Badge>
					) : (
						<Badge variant="secondary" className="bg-gray-100 text-gray-600">
							No Diet Plan
						</Badge>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: 'membershipStatus',
		header: 'Status',
		cell: ({ row }) => {
			const status = row.original.membershipStatus;
			return (
				<Badge
					className={`${
						status === 'active'
							? 'bg-green-100 text-green-800'
							: 'bg-red-100 text-red-800'
					}`}
				>
					{status}
				</Badge>
			);
		},
	},
];

export default function AssignedUserToTrainer() {
	const router = useRouter();
	const { data: users = [] } = useQuery({
		queryKey: ['assigned-users'],
		queryFn: getUsersAssignedToTrainer,
	});

	const [searchTerm, setSearchTerm] = useState('');
	const [filteredUsers, setFilteredUsers] = useState<AssignedUser[]>(users);

	// Calculate stats
	const totalUsers = users.length;
	const activeUsers = users.filter(
		(u) => u.membershipStatus === 'active',
	).length;
	const usersWithWorkoutPlan = users.filter(
		(u) => u.hasActiveWorkoutPlan,
	).length;
	const usersWithDietPlan = users.filter((u) => u.hasActiveDietPlan).length;

	const statusCards = [
		{
			title: 'Total Assigned Users',
			value: totalUsers,
			icon: Users,
			gradient: 'blue',
		},
		{
			title: 'Active Users',
			value: activeUsers,
			icon: UserCheck,
			gradient: 'green',
		},
		{
			title: 'With Workout Plan',
			value: usersWithWorkoutPlan,
			icon: Dumbbell,
			gradient: 'yellow',
		},
		{
			title: 'With Diet Plan',
			value: usersWithDietPlan,
			icon: UtensilsCrossed,
			gradient: 'red',
		},
	] as const;

	useEffect(() => {
		const filtered = users.filter((user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()),
		);
		setFilteredUsers(filtered);
	}, [searchTerm, users]);

	return (
		<div className="container mx-auto p-6 space-y-8">
			<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
				<h1 className="text-3xl font-bold text-gray-900 text-center w-full">
					Assigned Users
				</h1>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{statusCards.map((card) => (
					<StatusCard key={card.title} {...card} />
				))}
			</div>
			<div className="flex items-center space-x-2">
				<Search className="w-5 h-5 text-gray-400" />
				<Input
					placeholder="Search users..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full md:w-[300px]"
				/>
			</div>
			{/* Desktop View */}
			<div className="hidden md:block rounded-lg border bg-card">
				<DataTable data={filteredUsers} columns={columns} filterColumn="name" />
			</div>

			{/* Mobile View */}
			<div className="md:hidden space-y-4">
				<DataCard
					data={filteredUsers}
					renderCard={(user) => (
						<div
							className="p-4 space-y-3 bg-white rounded-lg border cursor-pointer hover:border-primary transition-colors"
							onClick={() =>
								user.id &&
								router.push(
									`/dashboard/trainer/assignedusers/assignedusersroute/${user.id}`,
								)
							}
							onKeyUp={() =>
								user.id &&
								router.push(
									`/dashboard/trainer/assignedusers/assignedusersroute/${user.id}`,
								)
							}
						>
							<div className="flex items-center justify-between">
								<h3 className="font-medium text-lg">{user.name}</h3>
								<Badge
									className={`${
										user.membershipStatus === 'active'
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'
									}`}
								>
									{user.membershipStatus}
								</Badge>
							</div>

							<div className="space-y-3">
								{/* Workout Plan Section */}
								<div className="p-3 bg-gray-50 rounded-lg">
									<p className="text-sm font-medium text-gray-600 mb-2">
										Workout Plan
									</p>
									{user.hasActiveWorkoutPlan ? (
										<Badge className="bg-green-100 text-green-800">
											<Dumbbell className="w-3 h-3 mr-1" />
											{user.activeWorkoutPlanName}
										</Badge>
									) : (
										<Badge
											variant="secondary"
											className="bg-gray-100 text-gray-600"
										>
											No Active Plan
										</Badge>
									)}
								</div>

								{/* Diet Plan Section */}
								<div className="p-3 bg-gray-50 rounded-lg">
									<p className="text-sm font-medium text-gray-600 mb-2">
										Diet Plan
									</p>
									{user.hasActiveDietPlan ? (
										<Badge className="bg-blue-100 text-blue-800">
											<UtensilsCrossed className="w-3 h-3 mr-1" />
											{user.dietPlanName}
										</Badge>
									) : (
										<Badge
											variant="secondary"
											className="bg-gray-100 text-gray-600"
										>
											No Diet Plan
										</Badge>
									)}
								</div>
							</div>
						</div>
					)}
				/>
			</div>
		</div>
	);
}
