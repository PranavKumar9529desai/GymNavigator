'use client';
import { queryClient } from '@/lib/queryClient';
import { DataCard } from '@/components/Table/UserCard';
import { DataTable } from '@/components/Table/UsersTable';
import { StatusCard } from '@/components/common/StatusCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Dumbbell, Search, UserCheck, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { AssignableUser } from '../_actions/get-assignable-users';
import { getAssignableUsers } from '../_actions/get-assignable-users';
import type { WorkoutPlan } from '../_actions/get-workout-plans';
import { getWorkoutPlans } from '../_actions/get-workout-plans';

const columns: ColumnDef<AssignableUser>[] = [
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
				<button
					type="button"
					className="cursor-pointer hover:text-primary w-full text-left"
					onClick={() =>
						row.original.id &&
						router.push(
							`/dashboard/trainer/workouts/assignworkout/${row.original.id}`,
						)
					}
					onKeyDown={(e) =>
						e.key === 'Enter' &&
						row.original.id &&
						router.push(
							`/dashboard/trainer/workouts/assignworkout/${row.original.id}`,
						)
					}
				>
					{row.getValue('name')}
				</button>
			);
		},
	},
	{
		accessorKey: 'activeWorkoutPlan',
		header: 'Current Workout Plan',
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
		accessorKey: 'assign',
		header: 'Assign Plan',
		cell: ({ row }) => {
			const router = useRouter();
			return (
				<Button
					size="sm"
					onClick={() =>
						row.original.id &&
						router.push(
							`/dashboard/trainer/workouts/assignworkout/${row.original.id}`,
						)
					}
				>
					{row.original.hasActiveWorkoutPlan ? 'Change Plan' : 'Assign Plan'}
				</Button>
			);
		},
	},
];

export default function UserWorkoutAssignment() {
	const router = useRouter();

	const { data: users = [] } = useQuery({
		queryKey: ['assignable-users'],
		queryFn: getAssignableUsers,
	});

	const { data: workoutPlans = [] } = useQuery({
		queryKey: ['workout-plans'],
		queryFn: getWorkoutPlans,
	});

	const [searchTerm, setSearchTerm] = useState('');
	const [filteredUsers, setFilteredUsers] = useState<AssignableUser[]>(users);

	// Calculate stats
	const totalUsers = users.length;
	const totalWorkoutPlans = workoutPlans.length;
	const usersWithWorkoutPlan = users.filter(
		(u) => u.hasActiveWorkoutPlan,
	).length;
	const usersWithoutWorkoutPlan = totalUsers - usersWithWorkoutPlan;

	const statusCards = [
		{
			title: 'Total Assigned Users',
			value: totalUsers,
			icon: Users,
			gradient: 'blue',
		},
		{
			title: 'Users With Workout Plans',
			value: usersWithWorkoutPlan,
			icon: UserCheck,
			gradient: 'green',
		},
		{
			title: 'Users Without Workout Plans',
			value: usersWithoutWorkoutPlan,
			icon: Users,
			gradient: 'yellow',
		},
		{
			title: 'Available Workout Plans',
			value: totalWorkoutPlans,
			icon: Dumbbell,
			gradient: 'red',
		},
	] as const;

	useEffect(() => {
		const filtered = users.filter((user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()),
		);
		setFilteredUsers(filtered);
	}, [searchTerm, users]);

	const _handleAssignWorkout = async () => {
		// ...existing assignment code...

		const response = { success: true }; // Mock response for demonstration
		if (response.success) {
			// Invalidate all relevant caches to ensure fresh data
			queryClient.invalidateQueries({ queryKey: ['assignable-users'] });
			queryClient.invalidateQueries({ queryKey: ['workout-plans'] });

			// ...existing success handling...
		}
	};

	return (
		<div className="container mx-auto p-6 space-y-8">
			<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
				<h1 className="text-3xl font-bold text-gray-900 text-center w-full">
					Assign Workout Plans
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
						// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
						<div
							className="p-4 space-y-3 bg-white rounded-lg border cursor-pointer hover:border-primary transition-colors"
							onClick={() =>
								user.id &&
								router.push(
									`/dashboard/trainer/workouts/assignworkout/${user.id}`,
								)
							}
						>
							<div className="flex items-center justify-between">
								<h3 className="font-medium text-lg">{user.name}</h3>
								<Button size="sm">
									{user.hasActiveWorkoutPlan ? 'Change Plan' : 'Assign Plan'}
								</Button>
							</div>

							<div className="space-y-3">
								{/* Workout Plan Section */}
								<div className="p-3 bg-gray-50 rounded-lg">
									<p className="text-sm font-medium text-gray-600 mb-2">
										Current Workout Plan
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
							</div>
						</div>
					)}
				/>
			</div>
		</div>
	);
}
