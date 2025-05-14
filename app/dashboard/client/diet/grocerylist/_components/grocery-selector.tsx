'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { GroceryListResponse } from '@/lib/AI/prompts/grocery-list-prompts';
import { cn } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { CalendarIcon, Clock, RefreshCcw, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useTransition } from 'react';
import {
	type SavedGroceryList,
	fetchSavedGroceryLists,
} from '../_actions/fetch-saved-grocery-lists';
import { getWeeklyDietPlan } from '../_actions/get-weekly-dietplan';
import { GroceryListView } from './grocery-list-view';
import { SavedGroceryListView } from './saved-grocery-list-view';

export function GrocerySelector() {
	const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly'>('weekly');
	const [_isPending, _startTransition] = useTransition();
	const [activeTab, setActiveTab] = useState<'weekly' | 'monthly'>('weekly');
	const [viewMode, setViewMode] = useState<'saved' | 'generating'>('saved');
	const queryClient = useQueryClient();

	// Use React Query to fetch saved grocery lists
	const { data: savedListsData, isLoading } = useQuery({
		queryKey: ['groceryLists'],
		queryFn: async () => {
			const result = await fetchSavedGroceryLists();
			if (!result.success || !result.groceryLists) {
				throw new Error(result.error || 'Failed to load grocery lists');
			}
			return result.groceryLists;
		},
	});

	// Process the saved lists data
	const savedLists = savedListsData
		? {
				weekly:
					savedListsData
						.filter((list) => list.timeFrame === 'weekly')
						.sort(
							(a, b) =>
								new Date(b.createdAt).getTime() -
								new Date(a.createdAt).getTime(),
						)[0] || null,
				monthly:
					savedListsData
						.filter((list) => list.timeFrame === 'monthly')
						.sort(
							(a, b) =>
								new Date(b.createdAt).getTime() -
								new Date(a.createdAt).getTime(),
						)[0] || null,
				others: savedListsData.filter((list, _index, arr) => {
					const sortedWeeklies = [...arr]
						.filter((l) => l.timeFrame === 'weekly')
						.sort(
							(a, b) =>
								new Date(b.createdAt).getTime() -
								new Date(a.createdAt).getTime(),
						);
					const sortedMonthlies = [...arr]
						.filter((l) => l.timeFrame === 'monthly')
						.sort(
							(a, b) =>
								new Date(b.createdAt).getTime() -
								new Date(a.createdAt).getTime(),
						);

					return (
						!(
							list.timeFrame === 'weekly' && list.id === sortedWeeklies[0]?.id
						) &&
						!(
							list.timeFrame === 'monthly' && list.id === sortedMonthlies[0]?.id
						)
					);
				}),
			}
		: { weekly: null, monthly: null, others: [] };

	// Use mutation for generating a new grocery list
	const {
		mutate: generateGroceryList,
		data: groceryList,
		error,
		isPending: isGenerating,
	} = useMutation({
		mutationFn: async (selectedTimeFrame: 'weekly' | 'monthly') => {
			const result = await getWeeklyDietPlan({ timeFrame: selectedTimeFrame });
			if (!result.success || !result.groceryList) {
				throw new Error(result.error || 'Failed to load grocery list');
			}
			return result.groceryList;
		},
		onSuccess: () => {
			// After successful generation, refetch the saved lists
			queryClient.invalidateQueries({ queryKey: ['groceryLists'] });
		},
	});

	const fetchGroceryList = (selectedTimeFrame: 'weekly' | 'monthly') => {
		setViewMode('generating');
		setTimeFrame(selectedTimeFrame);
		generateGroceryList(selectedTimeFrame);
	};

	const handleTabChange = (value: string) => {
		const newTimeFrame = value as 'weekly' | 'monthly';
		setActiveTab(newTimeFrame);

		// If we have a saved list for this timeframe, show it
		if (savedLists[newTimeFrame]) {
			setViewMode('saved');
		} else {
			// If no saved list exists, we might want to generate one
			setViewMode('generating');
		}
	};

	// Show loading state while checking for saved lists
	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center p-6">
				<Spinner className="w-8 h-8 text-primary" />
				<p className="mt-3 text-sm text-muted-foreground">
					Loading your grocery lists...
				</p>
			</div>
		);
	}

	return (
		<div className="w-full">
			<Tabs
				defaultValue="weekly"
				onValueChange={handleTabChange}
				className="w-full"
			>
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-xl font-semibold">Grocery List</h2>
					<TabsList>
						<TabsTrigger value="weekly" disabled={isGenerating}>
							Weekly
						</TabsTrigger>
						<TabsTrigger value="monthly" disabled={isGenerating}>
							Monthly
						</TabsTrigger>
					</TabsList>
				</div>

				<div className="mt-4">
					{viewMode === 'generating' ? (
						<>
							{isGenerating ? (
								<div className="flex flex-col items-center justify-center p-6">
									<Spinner className="w-8 h-8 text-primary" />
									<p className="mt-3 text-sm text-muted-foreground">
										Generating your {timeFrame} grocery list...
									</p>
								</div>
							) : error ? (
								<div className="p-4 text-center rounded-lg bg-destructive/10">
									<p className="text-destructive text-sm">
										{(error as Error).message}
									</p>
									<Button
										variant="outline"
										className="mt-3"
										onClick={() => fetchGroceryList(activeTab)}
									>
										Try Again
									</Button>
								</div>
							) : groceryList ? (
								<GroceryListView
									groceryList={groceryList}
									timeFrame={activeTab}
								/>
							) : (
								<div className="p-4 text-center rounded-lg bg-muted/50">
									<p className="mb-3 text-sm">
										Generate a new {activeTab} grocery list based on your diet
										plan
									</p>
									<Button
										onClick={() => fetchGroceryList(activeTab)}
										className={cn(
											isGenerating && 'opacity-50 cursor-not-allowed',
										)}
										disabled={isGenerating}
									>
										Generate List
									</Button>
									{savedLists[activeTab] && (
										<Button
											variant="outline"
											className="ml-2"
											onClick={() => setViewMode('saved')}
										>
											View Saved
										</Button>
									)}
								</div>
							)}
						</>
					) : (
						<>
							{savedLists[activeTab] ? (
								<div className="space-y-3">
									<div className="bg-muted/20 p-3 rounded-lg">
										<div className="flex justify-between items-center mb-2">
											<div className="flex items-center gap-2">
												<ShoppingCart className="w-4 h-4 text-primary" />
												<h3 className="text-lg font-medium">
													{activeTab === 'weekly' ? 'Weekly' : 'Monthly'}{' '}
													Grocery List
												</h3>
											</div>
											<div className="text-xs text-muted-foreground flex items-center">
												<Clock className="w-3 h-3 mr-1" />
												{format(
													new Date(savedLists[activeTab]?.createdAt),
													'MMM d, yyyy',
												)}
											</div>
										</div>
										<div className="mt-2">
											<Button
												variant="ghost"
												size="sm"
												className="text-xs p-2 h-8"
												onClick={() => {
													setViewMode('generating');
												}}
											>
												<RefreshCcw className="w-3 h-3 mr-1" />
												<span>Generate New</span>
											</Button>
										</div>
									</div>
									{/* @ts-ignore */}
									<SavedGroceryListView groceryList={savedLists[activeTab]!} />
								</div>
							) : (
								<div className="p-4 text-center rounded-lg bg-muted/50">
									<p className="mb-3 text-sm">
										You don't have a saved {activeTab} grocery list yet
									</p>
									<Button
										onClick={() => fetchGroceryList(activeTab)}
										className={cn(
											isGenerating && 'opacity-50 cursor-not-allowed',
										)}
										disabled={isGenerating}
									>
										Generate List
									</Button>
								</div>
							)}
						</>
					)}
				</div>
			</Tabs>
		</div>
	);
}
