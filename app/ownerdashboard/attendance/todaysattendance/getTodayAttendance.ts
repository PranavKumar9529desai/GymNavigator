import { OwnerReqConfig } from "../../../../lib/AxiosInstance/ownerAxios"

interface AttendanceUser {
  id: number;
  name: string;
  isPresent: boolean;
  trainerid: number | null;
  shift   : "Morning" | "Evening";
  attendanceTime: string | null;
}

interface TodayAttendanceResponse {
  msg: string;
  users: AttendanceUser[];
}

const TodayAttendance = async (): Promise<TodayAttendanceResponse> => {
  try {
    const owneraxios = await OwnerReqConfig();
    const response = await owneraxios.get<TodayAttendanceResponse>("/todaysattendance");
    console.log("Today's attendance data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching today's attendance:", error);
    return {
      msg: "Failed to fetch attendance data",
      users: []
    };
  }
};

export { TodayAttendance, type AttendanceUser };