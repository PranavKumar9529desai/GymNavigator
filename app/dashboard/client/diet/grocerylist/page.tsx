import { GrocerySelector } from './_components/grocery-selector';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { queryClient } from '@/app/queryClient';
import { fetchSavedGroceryLists } from './_actions/fetch-saved-grocery-lists';

export default async function GroceryListPage() {
	// Prefetch the grocery lists data
	await queryClient.prefetchQuery({
		queryKey: ['groceryLists'],
		queryFn: async () => {
			const result = await fetchSavedGroceryLists();
			if (!result.success || !result.groceryLists) {
				return [];
			}
			return result.groceryLists;
		},
	});

	return (
		<div className="container py-8">
			<HydrationBoundary state={dehydrate(queryClient)}>
				<GrocerySelector />
			</HydrationBoundary>
		</div>
	);
}
