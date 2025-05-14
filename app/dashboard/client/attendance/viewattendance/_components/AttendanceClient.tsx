'use client';
import { useQuery } from '@tanstack/react-query';
import type { AttendanceData } from '../_actions/get-attendance';
import axios from 'axios';
import CalendarSkeleton from './CalendarSkeleton';
import MonthAttendance from './MonthAttendance';

async function fetchAttendanceDataClient(): Promise<AttendanceData> {
	const token = localStorage.getItem('jwt');
	const response = await axios.post<{
		success: boolean;
		data?: string[];
	}>(
		`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/attendance/monthlyattendance`,
		undefined,
		{ headers: { Authorization: `Bearer ${token}` } },
	);
	const days = response.data.data || [];
	return { attendanceDays: days.map((d) => new Date(d)) };
}

export default function AttendanceClient() {
	const { data, isLoading, error } = useQuery<AttendanceData, Error>({
		queryKey: ['attendanceDays'],
		queryFn: fetchAttendanceDataClient,
		staleTime: 1000 * 60 * 60 * 24,
	});

	if (isLoading) return <CalendarSkeleton />;
	if (error) return <div>Error loading attendance.</div>;

	return <MonthAttendance initialData={data?.attendanceDays ?? []} />;
}
