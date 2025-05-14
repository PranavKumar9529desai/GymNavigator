'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type {
	GroceryCategory,
	GroceryItem,
	GroceryListResponse,
} from '@/lib/AI/prompts/grocery-list-prompts';
import { cn } from '@/lib/utils';
import {
	Check,
	ChevronDown,
	ChevronUp,
	Clipboard,
	Download,
	MinusCircle,
	Printer,
	Save,
	Search,
	ShoppingCart,
	Trash2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTransition } from 'react';
import { saveGroceryList } from '../_actions/save-grocery-list';

// Grocery list print styles
const printStyles = `
@media print {
  @page { size: portrait; margin: 1cm; }
  body * { visibility: hidden; }
  .grocery-print-content, .grocery-print-content * { visibility: visible; }
  .grocery-print-content { position: absolute; left: 0; top: 0; width: 100%; }
  .print-hidden { display: none !important; }
  .accordion-content { display: block !important; }
}`;

interface GroceryListViewProps {
	groceryList: GroceryListResponse;
	timeFrame: 'weekly' | 'monthly';
}

export function GroceryListView({
	groceryList,
	timeFrame,
}: GroceryListViewProps) {
	const [purchasedItems, setPurchasedItems] = useState<Set<string>>(new Set());
	const [searchQuery, setSearchQuery] = useState('');
	const [isSaving, startSaving] = useTransition();
	const { toast } = useToast();
	const [modifiedGroceryList, setModifiedGroceryList] =
		useState<GroceryListResponse>(groceryList);
	const [filterPurchased, setFilterPurchased] = useState<
		'all' | 'purchased' | 'unpurchased'
	>('all');

	// Add print styles to document head
	useEffect(() => {
		const styleElement = document.createElement('style');
		styleElement.textContent = printStyles;
		document.head.appendChild(styleElement);

		return () => {
			document.head.removeChild(styleElement);
		};
	}, []);

	// Calculate stats
	const totalItems = modifiedGroceryList.categories.reduce(
		(acc, cat) => acc + cat.items.length,
		0,
	);
	const totalPurchased = purchasedItems.size;
	const progress =
		totalItems > 0 ? Math.round((totalPurchased / totalItems) * 100) : 0;

	/**
	 * Toggle purchased state of an item
	 */
	const toggleItemPurchased = (categoryId: string, itemName: string) => {
		const itemId = `${categoryId}-${itemName}`;
		const newPurchasedItems = new Set(purchasedItems);

		if (newPurchasedItems.has(itemId)) {
			newPurchasedItems.delete(itemId);
		} else {
			newPurchasedItems.add(itemId);
		}

		setPurchasedItems(newPurchasedItems);
	};

	/**
	 * Remove an item from the grocery list
	 */
	const deleteItem = (categoryId: string, itemName: string) => {
		setModifiedGroceryList((prevList) => {
			const newList = { ...prevList };

			// Find the category and remove the item
			const categoryIndex = newList.categories.findIndex(
				(cat) => cat.id === categoryId,
			);
			if (categoryIndex !== -1) {
				// Filter out the item with the matching name
				newList.categories[categoryIndex] = {
					...newList.categories[categoryIndex],
					items: newList.categories[categoryIndex].items.filter(
						(item) => item.name !== itemName,
					),
				};

				// If the category is now empty, remove it
				if (newList.categories[categoryIndex].items.length === 0) {
					newList.categories = newList.categories.filter(
						(_, index) => index !== categoryIndex,
					);
				}
			}

			// Also remove from purchased items if it was there
			const itemId = `${categoryId}-${itemName}`;
			if (purchasedItems.has(itemId)) {
				const newPurchasedItems = new Set(purchasedItems);
				newPurchasedItems.delete(itemId);
				setPurchasedItems(newPurchasedItems);
			}

			return newList;
		});

		toast({
			title: 'Item removed',
			description: `"${itemName}" has been removed from your grocery list`,
			duration: 3000,
		});
	};

	/**
	 * Copy grocery list to clipboard with purchase status
	 */
	const copyToClipboard = () => {
		const text = modifiedGroceryList.categories
			.map((category) => {
				const header = `== ${category.name.toUpperCase()} ==\n`;
				const items = category.items
					.map((item) => {
						const itemId = `${category.id}-${item.name}`;
						const status = purchasedItems.has(itemId) ? '[✓] ' : '[ ] ';
						return `${status}${item.name} - ${item.quantity} ${item.unit}${item.notes ? ` (${item.notes})` : ''}`;
					})
					.join('\n');
				return `${header}${items}`;
			})
			.join('\n\n');

		navigator.clipboard.writeText(text);
		toast({
			title: 'Copied to clipboard',
			description: 'Grocery list copied to clipboard',
			duration: 3000,
		});
	};

	/**
	 * Print grocery list
	 */
	const printList = () => {
		window.print();
	};

	/**
	 * Export grocery list as CSV
	 */
	const exportAsCsv = () => {
		const headers = 'Category,Item,Quantity,Unit,Notes,Purchased\n';
		const rows = modifiedGroceryList.categories
			.flatMap((category) => {
				return category.items.map((item) => {
					const itemId = `${category.id}-${item.name}`;
					const purchased = purchasedItems.has(itemId) ? 'Yes' : 'No';
					return `"${category.name}","${item.name}","${item.quantity}","${item.unit}","${item.notes}","${purchased}"`;
				});
			})
			.join('\n');

		const csvContent = `${headers}${rows}`;
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');

		link.setAttribute('href', url);
		link.setAttribute('download', `${timeFrame}_grocery_list.csv`);
		link.style.visibility = 'hidden';

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleSaveList = () => {
		startSaving(async () => {
			try {
				const result = await saveGroceryList({
					timeFrame,
					groceryList: modifiedGroceryList,
				});

				if (result.success) {
					toast({
						title: 'Grocery list saved',
						description: 'Your grocery list has been saved successfully',
						duration: 3000,
					});
				} else {
					toast({
						variant: 'destructive',
						title: 'Save failed',
						description: result.error || 'Failed to save grocery list',
						duration: 3000,
					});
				}
			} catch (error) {
				toast({
					variant: 'destructive',
					title: 'Save failed',
					description: 'An unexpected error occurred',
					duration: 3000,
				});
				console.error(error);
			}
		});
	};

	// Filter items based on search query and purchase status
	const filteredCategories = modifiedGroceryList.categories
		.map((category) => {
			const filteredItems = category.items.filter((item) => {
				const itemId = `${category.id}-${item.name}`;
				const matchesSearch =
					item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					category.name.toLowerCase().includes(searchQuery.toLowerCase());

				const matchesPurchaseFilter =
					filterPurchased === 'all' ||
					(filterPurchased === 'purchased' && purchasedItems.has(itemId)) ||
					(filterPurchased === 'unpurchased' && !purchasedItems.has(itemId));

				return matchesSearch && matchesPurchaseFilter;
			});

			return {
				...category,
				filteredItems,
			};
		})
		.filter((category) => category.filteredItems.length > 0);

	return (
		<Card className="w-full shadow-md print:shadow-none grocery-print-content">
			<CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 print:hidden">
				<div>
					<CardTitle className="text-xl font-bold">
						{timeFrame === 'weekly' ? 'Weekly' : 'Monthly'} Grocery List
					</CardTitle>
					<div className="text-sm text-muted-foreground mt-1">
						{totalItems} items total • {totalPurchased} purchased ({progress}%
						complete)
					</div>
				</div>

				<div className="flex flex-wrap gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={handleSaveList}
						disabled={isSaving}
					>
						<Save className="h-4 w-4 mr-1" />
						Save
					</Button>
					<Button variant="outline" size="sm" onClick={copyToClipboard}>
						<Clipboard className="h-4 w-4 mr-1" />
						Copy
					</Button>
					<Button variant="outline" size="sm" onClick={exportAsCsv}>
						<Download className="h-4 w-4 mr-1" />
						Export
					</Button>
					<Button variant="outline" size="sm" onClick={printList}>
						<Printer className="h-4 w-4 mr-1" />
						Print
					</Button>
				</div>
			</CardHeader>

			<CardContent className="p-4 pt-0">
				{/* Search and filter - hidden when printing */}
				<div className="flex flex-col md:flex-row gap-2 mb-4 print:hidden">
					<div className="relative flex-1">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search items..."
							className="pl-8"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<div className="flex gap-2">
						<Button
							variant={filterPurchased === 'all' ? 'default' : 'outline'}
							size="sm"
							onClick={() => setFilterPurchased('all')}
						>
							All
						</Button>
						<Button
							variant={
								filterPurchased === 'unpurchased' ? 'default' : 'outline'
							}
							size="sm"
							onClick={() => setFilterPurchased('unpurchased')}
						>
							To Buy
						</Button>
						<Button
							variant={filterPurchased === 'purchased' ? 'default' : 'outline'}
							size="sm"
							onClick={() => setFilterPurchased('purchased')}
						>
							Purchased
						</Button>
					</div>
				</div>

				{/* Progress bar */}
				<div className="w-full h-2 bg-secondary mb-6 rounded-full overflow-hidden print:hidden">
					<div
						className="h-full bg-primary transition-all duration-500 ease-in-out"
						style={{ width: `${progress}%` }}
					/>
				</div>

				{/* Empty state */}
				{filteredCategories.length === 0 && (
					<div className="flex flex-col items-center justify-center py-10 text-center">
						<ShoppingCart className="h-12 w-12 text-muted-foreground mb-2" />
						<h3 className="text-lg font-medium">No grocery items found</h3>
						<p className="text-muted-foreground mt-1">
							{searchQuery
								? 'Try using different search terms'
								: 'Your grocery list is empty'}
						</p>
					</div>
				)}

				{/* Grocery list accordion */}
				<ScrollArea className="max-h-[60vh] pr-4 print:max-h-full">
					<Accordion
						type="multiple"
						defaultValue={filteredCategories.map((c) => c.id)}
						className="w-full"
					>
						{filteredCategories.map((category) => (
							<AccordionItem key={category.id} value={category.id}>
								<AccordionTrigger className="py-3">
									<div className="flex items-center justify-between w-full pr-4">
										<span className="font-medium">{category.name}</span>
										<Badge variant="outline" className="ml-2">
											{category.filteredItems.length}
										</Badge>
									</div>
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-2">
										{category.filteredItems.map((item) => {
											const itemId = `${category.id}-${item.name}`;
											const isPurchased = purchasedItems.has(itemId);

											return (
												<div
													key={itemId}
													className={cn(
														'flex items-center justify-between p-2 rounded-md',
														'hover:bg-muted/50 transition-colors',
														isPurchased && 'bg-muted/20',
													)}
												>
													<div className="flex items-center gap-3 flex-1">
														<Checkbox
															id={itemId}
															checked={isPurchased}
															onCheckedChange={() =>
																toggleItemPurchased(category.id, item.name)
															}
															className="h-5 w-5"
														/>
														<div className="flex flex-col">
															<label
																htmlFor={itemId}
																className={cn(
																	'text-sm font-medium leading-none cursor-pointer flex items-center',
																	isPurchased &&
																		'line-through text-muted-foreground',
																)}
															>
																{item.name}
															</label>
															{(item.notes || item.quantity) && (
																<span className="text-xs text-muted-foreground mt-1">
																	{item.quantity > 0 &&
																		`${item.quantity} ${item.unit} `}
																	{item.notes && `• ${item.notes}`}
																</span>
															)}
														</div>
													</div>

													<div className="print:hidden">
														<Button
															variant="ghost"
															size="icon"
															className="h-7 w-7 opacity-50 hover:opacity-100"
															onClick={() => deleteItem(category.id, item.name)}
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</div>
											);
										})}
									</div>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
