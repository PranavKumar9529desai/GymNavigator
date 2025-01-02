"use server";
import { OwnerReqConfig } from "../../../../lib/AxiosInstance/ownerAxios";
import { AxiosResponse } from "axios";

interface responseType {
  gymname: string;
  gymid: number;
}

export const GetAttendanceQrData = async () => {
  const ownerAxios = await OwnerReqConfig();
  try {
    const response: AxiosResponse<responseType> = await ownerAxios.get(
      `attendanceqrdata`
    );
    console.log("response from the attendance", response.data);
    return {
      gymname: response.data.gymname,
      gymid: response.data.gymid,
    };
  } catch (error) {
    console.log("Error:", error);
  }
};
