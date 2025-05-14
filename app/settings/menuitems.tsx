import { ReactNode } from 'react';
import {
	Settings,
	UserCog,
	CreditCard,
	Heart,
	User,
	Building,
	Dumbbell,
	Bell,
	Shield,
	UserCircle,
	UserCheck,
	CalendarClock,
	MessageSquare,
} from 'lucide-react';

export type Role = 'owner' | 'client' | 'trainer';

export interface MenuItem {
	label: string;
	path: string;
	icon?: ReactNode;
	description?: string;
	category: 'account' | 'preferences' | 'business' | 'other';
}

// Settings items organized by role and category
export const settingsMenuItems: Record<Role, MenuItem[]> = {
	owner: [
		// Account settings
		{
			label: 'Profile',
			path: '/settings/profile',
			icon: <UserCircle size={22} />,
			description: 'Update your personal information',
			category: 'account',
		},
		{
			label: 'Security',
			path: '/settings/security',
			icon: <Shield size={22} />,
			description: 'Manage your account security',
			category: 'account',
		},
		// Business settings
		{
			label: 'Gym Settings',
			path: '/settings/gym',
			icon: <Building size={22} />,
			description: 'Manage your gym details and configuration',
			category: 'business',
		},
		{
			label: 'Trainer Management',
			path: '/settings/trainer',
			icon: <UserCog size={22} />,
			description: 'Manage trainers and their profiles',
			category: 'business',
		},
		// Preferences
		{
			label: 'Payment Settings',
			path: '/settings/payment',
			icon: <CreditCard size={22} />,
			description: 'Configure payment methods and subscriptions',
			category: 'preferences',
		},
		{
			label: 'Notifications',
			path: '/settings/notifications',
			icon: <Bell size={22} />,
			description: 'Manage notification preferences',
			category: 'preferences',
		},
	],
	client: [
		// Account
		{
			label: 'Profile',
			path: '/settings/profile',
			icon: <UserCircle size={22} />,
			description: 'Update your personal information',
			category: 'account',
		},
		{
			label: 'Health Profile',
			path: '/settings/healthprofile',
			icon: <Heart size={22} />,
			description: 'Manage your health information and fitness goals',
			category: 'account',
		},
		// Preferences
		{
			label: 'Workout Preferences',
			path: '/settings/workouts',
			icon: <Dumbbell size={22} />,
			description: 'Set your workout preferences and goals',
			category: 'preferences',
		},
		{
			label: 'Schedule',
			path: '/settings/schedule',
			icon: <CalendarClock size={22} />,
			description: 'Configure your workout schedule',
			category: 'preferences',
		},
		{
			label: 'Payment Settings',
			path: '/settings/payment',
			icon: <CreditCard size={22} />,
			description: 'Manage your payment methods and subscriptions',
			category: 'preferences',
		},
		{
			label: 'Notifications',
			path: '/settings/notifications',
			icon: <Bell size={22} />,
			description: 'Configure notification settings',
			category: 'preferences',
		},
	],
	trainer: [
		// Account
		{
			label: 'Trainer Profile',
			path: '/settings/trainer',
			icon: <User size={22} />,
			description: 'Edit your profile and expertise',
			category: 'account',
		},
		{
			label: 'Security',
			path: '/settings/security',
			icon: <Shield size={22} />,
			description: 'Manage your account security',
			category: 'account',
		},
		// Preferences
		{
			label: 'Client Preferences',
			path: '/settings/clients',
			icon: <UserCheck size={22} />,
			description: 'Set preferences for client management',
			category: 'preferences',
		},
		{
			label: 'Communication',
			path: '/settings/communication',
			icon: <MessageSquare size={22} />,
			description: 'Configure communication preferences',
			category: 'preferences',
		},
		{
			label: 'Payment Settings',
			path: '/settings/payment',
			icon: <CreditCard size={22} />,
			description: 'Manage payment methods and payouts',
			category: 'preferences',
		},
		{
			label: 'Notifications',
			path: '/settings/notifications',
			icon: <Bell size={22} />,
			description: 'Set your notification preferences',
			category: 'preferences',
		},
	],
};
