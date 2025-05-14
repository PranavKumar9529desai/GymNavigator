import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ViewDietLoading() {
	return (
		<div className="container mx-auto py-6 px-4 max-w-4xl">
			<div className="mb-6">
				<Skeleton className="h-8 w-64 mx-auto" />
			</div>

			<Card className="shadow-sm border-0 bg-white/50 backdrop-blur-sm">
				<CardHeader className="pb-2 pt-4">
					<div className="flex items-center justify-center">
						<Skeleton className="h-7 w-48" />
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-6">
						{/* Diet summary skeleton */}
						<div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
							<div className="flex items-center justify-between mb-3">
								<Skeleton className="h-5 w-32" />
								<Skeleton className="h-4 w-24" />
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{/* Chart skeleton */}
								<div>
									<Skeleton className="h-4 w-32 mb-3" />
									<div className="h-44 bg-gray-50 rounded-lg flex items-center justify-center">
										<div className="h-28 w-28 rounded-full">
											<Skeleton className="h-full w-full rounded-full" />
										</div>
									</div>
								</div>

								{/* Calorie & nutrition skeleton */}
								<div className="flex flex-col justify-between">
									<div className="mb-4">
										<Skeleton className="h-4 w-28 mb-3" />
										<Skeleton className="h-2 w-full mb-2" />
										<div className="flex justify-between">
											<Skeleton className="h-3 w-28" />
											<Skeleton className="h-3 w-10" />
										</div>
									</div>

									<div>
										<Skeleton className="h-4 w-28 mb-3" />
										<div className="bg-gray-50 p-3 rounded-lg">
											<div className="grid grid-cols-4 gap-2">
												{[...Array(4)].map((_, i) => (
													<div
														key={`nutrition-skeleton-${i}`}
														className="flex flex-col items-center"
													>
														<Skeleton className="h-6 w-6 rounded-full mb-1" />
														<Skeleton className="h-4 w-10" />
														<Skeleton className="mt-1 h-3 w-8" />
													</div>
												))}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Meals skeletons */}
						<div>
							<Skeleton className="h-5 w-32 mb-3" />
							<div className="space-y-4">
								{[...Array(4)].map((_, i) => (
									<div
										key={`meal-skeleton-${i}`}
										className="mb-4 rounded-lg shadow-sm border border-gray-100 overflow-hidden"
									>
										<div className="bg-gray-50 p-3 flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Skeleton className="h-6 w-6 rounded-full" />
												<div>
													<Skeleton className="h-4 w-40" />
													<Skeleton className="mt-1 h-3 w-20" />
												</div>
											</div>
											<Skeleton className="h-8 w-8 rounded-full" />
										</div>
										<div className="p-3 bg-white">
											<div className="grid grid-cols-4 gap-2">
												{[...Array(4)].map((_, j) => (
													<div
														key={`meal-nutrition-skeleton-${i}-${j}`}
														className="flex flex-col items-center"
													>
														<Skeleton className="h-6 w-6 rounded-full mb-1" />
														<Skeleton className="h-3 w-8" />
														<Skeleton className="mt-1 h-2 w-6" />
													</div>
												))}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="mt-6 text-center text-xs text-gray-500">
				<span>Updated daily based on your fitness goals</span>
			</div>
		</div>
	);
}
