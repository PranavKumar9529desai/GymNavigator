import AttendanceClient from './_components/AttendanceClient';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
	title: 'Attendance History | GymNavigator',
	description:
		'View and track your gym attendance history with detailed calendar view and progress statistics.',
};

export default function ViewAttendancePage() {
	return <AttendanceClient />;
}
