'use client';
import { invalidateQueries, queryClient } from '@/lib/queryClient';
// @ts-nocheck
import { toast } from '@/hooks/use-toast';
import { type RefObject, useEffect, useRef, useState } from 'react';
// Updated imports for server actions
import {
	assignExistingWorkoutPlan,
	createOrUpdateCustomWorkoutPlan,
} from '../../_actions/assign-workout-plan';
import type {
	WorkoutPlan,
	WorkoutSchedule,
} from '../../_actions/generate-ai-workout';
import { refineWorkout } from '../../_actions/refine-workout';
import { useWorkoutChatStore } from '../../_store/workout-chat-store';

import ActionButtons from './action-buttons';
import FeedbackSection from './feedback-section';
import WeeklyScheduleTabs from './weekly-schedule-tabs';
import WorkoutDayDetails from './workout-day-details';
import WorkoutHeader from './workout-header';

interface WorkoutResultsProps {
	workoutPlan: WorkoutPlan;
	onSave?: (plan: WorkoutPlan) => void;
	onDiscard: () => void;
	isLoading?: boolean;
	userId: string;
	userName?: string;
}

export default function WorkoutResults({
	workoutPlan,
	onSave,
	onDiscard,
	isLoading = false,
	userId,
	userName = 'Client',
}: WorkoutResultsProps) {
	const [plan, setPlan] = useState<WorkoutPlan>(workoutPlan);
	const [editMode, setEditMode] = useState(false);
	const [activeTab, setActiveTab] = useState(
		plan.schedules?.[0]?.dayOfWeek || 'Monday',
	);
	const [isSaving, setIsSaving] = useState(false);
	const [isAssigning, setIsAssigning] = useState(false);
	const [savedWorkoutPlanId, setSavedWorkoutPlanId] = useState<number | null>(
		workoutPlan.id ?? null,
	);
	const tabsRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;

	// Fetch state and actions from Zustand store
	const {
		conversationHistory,
		isSubmittingFeedback,
		feedbackError,
		showFeedbackChat,
		initializeConversation,
		addUserMessage,
		addAIMessage,
		setSubmittingFeedback,
		setFeedbackError,
		toggleFeedbackChat,
		setShowFeedbackChat,
		saveWorkoutToHistory,
	} = useWorkoutChatStore();

	// Initialize conversation with initial workout
	useEffect(() => {
		setPlan(workoutPlan);
		setSavedWorkoutPlanId(workoutPlan.id ?? null);
		setActiveTab(workoutPlan.schedules?.[0]?.dayOfWeek || 'Monday');
		initializeConversation(workoutPlan);
		setEditMode(false);
	}, [workoutPlan, initializeConversation]);

	const handleSave = async () => {
		setIsSaving(true);

		try {
			const planToSave = { ...plan, id: savedWorkoutPlanId ?? undefined };
			const result = await createOrUpdateCustomWorkoutPlan(planToSave);

			if (result.success && result.workoutPlanId) {
				setSavedWorkoutPlanId(result.workoutPlanId);
				setPlan((prevPlan) => ({ ...prevPlan, id: result.workoutPlanId }));

				// Add delay for toast visibility
				setTimeout(() => {
					toast({
						title: 'Workout Saved',
						description: `"${result.workoutPlanName}" has been saved successfully.`,
					});

					// Log for debugging
					console.log('Toast notification triggered:', {
						type: 'save',
						plan: result.workoutPlanName,
					});
				}, 100);

				if (onSave) {
					onSave({ ...plan, id: result.workoutPlanId });
				}
			} else {
				throw new Error(result.error || 'Failed to save workout');
			}
		} catch (error) {
			console.error('Error saving workout:', error);
			toast({
				title: 'Error Saving',
				description:
					error instanceof Error
						? error.message
						: 'There was a problem saving your workout plan.',
				variant: 'destructive',
			});
		} finally {
			setIsSaving(false);
		}
	};

	const handleAssignWorkout = async () => {
		if (!savedWorkoutPlanId) {
			toast({
				title: 'Cannot Assign',
				description: 'Please save the workout plan before assigning it.',
				variant: 'destructive',
			});
			return;
		}

		setIsAssigning(true);

		try {
			const result = await assignExistingWorkoutPlan(
				userId,
				savedWorkoutPlanId,
			);

			if (result.success) {
				const wasUpdate = result.previousPlan !== null;

				// Invalidate relevant queries if specified in the response
				if (result.invalidateQueries && result.invalidateQueries.length > 0) {
					invalidateQueries(result.invalidateQueries);
				} else {
					// Fallback to invalidating common queries
					queryClient.invalidateQueries({ queryKey: ['assignable-users'] });
					queryClient.invalidateQueries({ queryKey: ['workout-plans'] });
				}

				// Force a small delay to ensure UI updates before showing toast
				setTimeout(() => {
					toast({
						title: wasUpdate ? 'Workout Updated' : 'Workout Assigned',
						description: wasUpdate
							? `Previous plan "${result.previousPlan?.name}" replaced with "${result.newPlan.name}".`
							: `Workout "${result.newPlan.name}" assigned to ${userName}.`,
					});

					// Log toast call for debugging
					console.log('Toast notification triggered:', {
						type: wasUpdate ? 'update' : 'assign',
						plan: result.newPlan.name,
					});
				}, 100);
			} else {
				throw new Error(result.error || 'Failed to assign workout');
			}
		} catch (error) {
			console.error('Error assigning workout:', error);
			setTimeout(() => {
				toast({
					title: 'Assignment Failed',
					description:
						error instanceof Error
							? error.message
							: 'There was a problem assigning the workout.',
					variant: 'destructive',
				});
			}, 100);
		} finally {
			setIsAssigning(false);
		}
	};

	const handleSendFeedback = async (feedback: string) => {
		try {
			setFeedbackError(null);
			setSubmittingFeedback(true);
			addUserMessage(feedback);

			const result = await refineWorkout({
				userId,
				originalWorkoutPlan: plan,
				feedback,
				conversationHistory: conversationHistory.map(
					({ type, message, timestamp }) => ({
						type,
						message,
						timestamp,
					}),
				),
			});

			if (result.success && result.workoutPlan) {
				addAIMessage(
					"I've refined the workout plan based on your feedback. Here's the updated version!",
					result.workoutPlan,
				);
				setPlan(result.workoutPlan);
				setSavedWorkoutPlanId(null);

				toast({
					title: 'Workout Plan Updated',
					description:
						'The AI has refined your workout plan. Please save the changes.',
				});
			} else {
				const aiErrorMessage =
					result.error ||
					"Sorry, I couldn't refine the workout based on that feedback.";
				addAIMessage(aiErrorMessage);
				setFeedbackError(aiErrorMessage);
				toast({
					title: 'Refinement Error',
					description: aiErrorMessage,
					variant: 'destructive',
				});
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : 'An unexpected error occurred';
			addAIMessage(`Sorry, an error occurred: ${errorMessage}`);
			setFeedbackError(errorMessage);
			toast({
				title: 'Error',
				description: errorMessage,
				variant: 'destructive',
			});
		} finally {
			setSubmittingFeedback(false);
		}
	};

	const currentSchedule =
		plan.schedules.find((s) => s.dayOfWeek === activeTab) || plan.schedules[0];

	const scrollTabs = (direction: 'left' | 'right') => {
		if (tabsRef.current) {
			const scrollAmount = direction === 'left' ? -200 : 200;
			const currentScroll = tabsRef.current.scrollLeft;
			tabsRef.current.scrollTo({
				left: currentScroll + scrollAmount,
				behavior: 'smooth',
			});
			console.log(
				`Scrolling ${direction}: ${currentScroll} -> ${
					currentScroll + scrollAmount
				}`,
			);
		}
	};

	return (
		<div className="space-y-8">
			<WorkoutHeader
				plan={plan}
				setPlan={(newPlan) => {
					setPlan(newPlan);
					setSavedWorkoutPlanId(null);
				}}
				editMode={editMode}
				setEditMode={setEditMode}
				showFeedbackChat={showFeedbackChat}
				setShowFeedbackChat={setShowFeedbackChat}
			/>

			{showFeedbackChat && (
				<FeedbackSection
					plan={plan}
					feedbackError={feedbackError}
					isSubmittingFeedback={isSubmittingFeedback}
					conversationHistory={conversationHistory}
					onSendFeedback={handleSendFeedback}
				/>
			)}

			<WeeklyScheduleTabs
				plan={plan}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				tabsRef={tabsRef}
				scrollTabs={scrollTabs}
			/>

			{currentSchedule && (
				<WorkoutDayDetails currentSchedule={currentSchedule} />
			)}

			<ActionButtons
				onSave={handleSave}
				onDiscard={onDiscard}
				onAssign={handleAssignWorkout}
				isSaving={isSaving}
				isAssigning={isAssigning}
				savedWorkoutPlanId={savedWorkoutPlanId}
				showFeedbackChat={showFeedbackChat}
				toggleFeedback={toggleFeedbackChat}
			/>
		</div>
	);
}
