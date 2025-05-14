'use server';

import { auth } from '@/app/(auth)/auth';
import { ClientReqConfig } from '@/lib/AxiosInstance/clientAxios';
import { z } from 'zod';

// Schema for validating parameters
const UpdateItemParamsSchema = z.object({
	itemId: z.number(),
	isPurchased: z.boolean(),
});

export type UpdateGroceryItemResult = {
	success: boolean;
	// @ts-ignore
	updatedItem?: any;
	error?: string;
};

/**
 * Update a grocery item's purchased status
 */
export async function updateGroceryItem(
	params: z.infer<typeof UpdateItemParamsSchema>,
): Promise<UpdateGroceryItemResult> {
	try {
		const { itemId, isPurchased } = UpdateItemParamsSchema.parse(params);
		const session = await auth();

		if (!session?.user?.id) {
			return { success: false, error: 'User not authenticated' };
		}

		// Update the grocery item in the backend
		const clientAxios = await ClientReqConfig();
		const response = await clientAxios.patch(`/diet/groceryitem/${itemId}`, {
			isPurchased,
		});

		if (!response.data?.success) {
			return {
				success: false,
				error: response.data?.error || 'Failed to update grocery item',
			};
		}

		return {
			success: true,
			updatedItem: response.data.data,
		};
	} catch (error) {
		console.error('Error in updateGroceryItem:', error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'An unknown error occurred',
		};
	}
}
