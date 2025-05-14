'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EnhancedGroceryList } from './_components/enhanced-grocery-list';
import { generateGroceryList } from '@/lib/AI/grocery-list';
import { useState, useTransition } from 'react';
import type { DietPlan } from '@/lib/AI/types/diet-types';
import type { GroceryListResponse } from '@/lib/AI/prompts/grocery-list-prompts';
import { ArrowRight, RefreshCcw } from 'lucide-react';

/**
 * Example wrapper page showing the enhanced grocery list component
 */
export default function GroceryListExamplePage() {
	const [isGenerating, startGenerating] = useTransition();
	const [groceryList, setGroceryList] = useState<GroceryListResponse | null>(
		null,
	);
	const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly'>('weekly');
	const { toast } = useToast();

	// Example diet plan - in real app this would come from API/database
	const sampleDietPlan: DietPlan = {
		id: 'sample-diet-1',
		name: 'Balanced Diet Plan',
		dailyCalories: 2000,
		days: [
			{
				dayNumber: 1,
				meals: [
					{
						name: 'Breakfast',
						time: '8:00 AM',
						items: [
							{
								name: 'Oatmeal',
								quantity: '1 cup',
								notes: 'Steel-cut preferred',
							},
							{ name: 'Berries', quantity: '1/2 cup', notes: 'Mixed berries' },
							{ name: 'Almonds', quantity: '1 oz', notes: 'Raw, unsalted' },
						],
					},
					{
						name: 'Lunch',
						time: '12:30 PM',
						items: [
							{
								name: 'Grilled Chicken Breast',
								quantity: '6 oz',
								notes: 'Skinless',
							},
							{ name: 'Brown Rice', quantity: '1 cup', notes: 'Cooked' },
							{ name: 'Broccoli', quantity: '1 cup', notes: 'Steamed' },
							{ name: 'Olive Oil', quantity: '1 tbsp', notes: 'Extra virgin' },
						],
					},
					{
						name: 'Dinner',
						time: '7:00 PM',
						items: [
							{ name: 'Salmon', quantity: '6 oz', notes: 'Wild-caught' },
							{ name: 'Sweet Potato', quantity: '1 medium', notes: 'Baked' },
							{ name: 'Spinach', quantity: '2 cups', notes: 'Raw' },
							{ name: 'Avocado', quantity: '1/2', notes: 'Sliced' },
						],
					},
				],
			},
			// Additional days would be included in a real app
		],
	};

	// Generate grocery list using AI
	const handleGenerateGroceryList = () => {
		startGenerating(async () => {
			toast({
				description: `Generating ${timeFrame} grocery list...`,
			});

			try {
				const result = await generateGroceryList([sampleDietPlan], timeFrame);
				setGroceryList(result);

				toast({
					title: 'List generated',
					description: 'Your grocery list has been generated successfully!',
				});
			} catch (error) {
				toast({
					variant: 'destructive',
					title: 'Generation failed',
					description: 'Could not generate grocery list. Please try again.',
				});
				console.error('Error generating grocery list:', error);
			}
		});
	};

	return (
		<div className="container max-w-6xl py-6 space-y-8">
			<div className="flex flex-col">
				<h1 className="text-2xl font-bold tracking-tight">Grocery List</h1>
				<p className="text-muted-foreground">
					Generate and manage your grocery lists based on your dietary plans.
				</p>
			</div>

			<Tabs defaultValue="generate" className="w-full">
				<TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
					<TabsTrigger value="generate">Generate New List</TabsTrigger>
					<TabsTrigger value="saved">Saved Lists</TabsTrigger>
				</TabsList>

				<TabsContent value="generate" className="space-y-6">
					<Card className="p-6">
						<div className="space-y-4">
							<h2 className="text-lg font-medium">Create Grocery List</h2>
							<p className="text-sm text-muted-foreground">
								Generate a grocery list based on your meal plan. Select the time
								frame and click generate.
							</p>

							<div className="flex flex-col sm:flex-row gap-4">
								<div className="grid grid-cols-2 gap-2 max-w-xs">
									<Button
										variant={timeFrame === 'weekly' ? 'default' : 'outline'}
										onClick={() => setTimeFrame('weekly')}
									>
										Weekly
									</Button>
									<Button
										variant={timeFrame === 'monthly' ? 'default' : 'outline'}
										onClick={() => setTimeFrame('monthly')}
									>
										Monthly
									</Button>
								</div>

								<Button
									onClick={handleGenerateGroceryList}
									disabled={isGenerating}
									className="w-full sm:w-auto"
								>
									{isGenerating ? (
										<>
											<RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
											Generating...
										</>
									) : (
										<>
											Generate List
											<ArrowRight className="ml-2 h-4 w-4" />
										</>
									)}
								</Button>
							</div>
						</div>
					</Card>

					{isGenerating ? (
						<GroceryListSkeleton />
					) : groceryList ? (
						<EnhancedGroceryList
							groceryList={groceryList}
							timeFrame={timeFrame}
						/>
					) : (
						<div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-lg">
							<h3 className="text-lg font-medium">No grocery list generated</h3>
							<p className="text-muted-foreground mt-1 max-w-md">
								Click the "Generate List" button above to create a grocery list
								based on your meal plan.
							</p>
						</div>
					)}
				</TabsContent>

				<TabsContent value="saved">
					<div className="flex flex-col items-center justify-center py-12 text-center bg-muted/30 rounded-lg">
						<h3 className="text-lg font-medium">Saved Lists</h3>
						<p className="text-muted-foreground mt-1 max-w-md">
							Your saved grocery lists will appear here.
						</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}

/**
 * Loading skeleton for grocery list
 */
function GroceryListSkeleton() {
	return (
		<Card className="w-full shadow-md p-4">
			<div className="flex flex-col space-y-3">
				<div className="flex items-center justify-between">
					<Skeleton className="h-8 w-[200px]" />
					<div className="flex gap-2">
						<Skeleton className="h-9 w-[60px]" />
						<Skeleton className="h-9 w-[60px]" />
						<Skeleton className="h-9 w-[60px]" />
					</div>
				</div>

				<Skeleton className="h-8 w-full mt-2" />
				<Skeleton className="h-2 w-full mt-1" />

				{[1, 2, 3].map((i) => (
					<div key={i} className="pt-4">
						<Skeleton className="h-6 w-[140px] mb-3" />
						{[1, 2, 3].map((j) => (
							<div key={j} className="flex items-center gap-2 mb-3">
								<Skeleton className="h-5 w-5 rounded-sm" />
								<div className="space-y-1 flex-1">
									<Skeleton className="h-4 w-[80%]" />
									<Skeleton className="h-3 w-[60%]" />
								</div>
							</div>
						))}
					</div>
				))}
			</div>
		</Card>
	);
}
