import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
	return (
		<div className="container mx-auto py-6 px-4">
			<div className="space-y-6">
				{/* Basic Information Skeleton */}
				<Card>
					<CardHeader>
						<CardTitle>Basic Information</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="font-semibold">Name</p>
								<Skeleton className="h-6 w-32 mt-1" />
							</div>
							<div>
								<p className="font-semibold">Email</p>
								<Skeleton className="h-6 w-48 mt-1" />
							</div>
							<div>
								<p className="font-semibold">Member Since</p>
								<Skeleton className="h-6 w-40 mt-1" />
							</div>
							<div>
								<p className="font-semibold">Role</p>
								<Skeleton className="h-6 w-24 mt-1" />
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Health Profile Skeleton */}
				<Card>
					<CardHeader>
						<CardTitle>Health Profile</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
							{Array.from({ length: 6 }).map((_, index) => (
								<div key={index as number}>
									<Skeleton className="h-5 w-24 mb-1" />
									<Skeleton className="h-6 w-20" />
								</div>
							))}
							F
							<div className="col-span-2">
								<Skeleton className="h-5 w-32 mb-2" />
								<div className="flex flex-wrap gap-2">
									{Array.from({ length: 3 }).map((_, index) => (
										<Skeleton key={index as number} className="h-6 w-24" />
									))}
								</div>
							</div>
							<div className="col-span-2">
								<Skeleton className="h-5 w-24 mb-2" />
								<div className="flex flex-wrap gap-2">
									{Array.from({ length: 3 }).map((_, index) => (
										<Skeleton key={index} className="h-6 w-24" />
									))}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Workout Plan Skeleton */}
				<Card>
					<CardHeader>
						<CardTitle>Active Workout Plan</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<Skeleton className="h-5 w-24 mb-1" />
								<Skeleton className="h-6 w-48" />
							</div>
							<div>
								<Skeleton className="h-5 w-24 mb-1" />
								<Skeleton className="h-20 w-full" />
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div>
									<Skeleton className="h-5 w-24 mb-1" />
									<Skeleton className="h-6 w-32" />
								</div>
								<div>
									<Skeleton className="h-5 w-24 mb-1" />
									<Skeleton className="h-6 w-32" />
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Diet Plan Skeleton */}
				<Card>
					<CardHeader>
						<CardTitle>Diet Plan</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<Skeleton className="h-5 w-24 mb-1" />
								<Skeleton className="h-6 w-48" />
							</div>
							<div>
								<Skeleton className="h-5 w-24 mb-1" />
								<Skeleton className="h-20 w-full" />
							</div>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{Array.from({ length: 4 }).map((_, index) => (
									<div key={index as number}>
										<Skeleton className="h-5 w-32 mb-1" />
										<Skeleton className="h-6 w-24" />
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
