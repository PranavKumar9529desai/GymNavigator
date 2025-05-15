'use server';

import { SigninReqConfig } from '@/lib/AxiosInstance/Signin/sign-in-axios';
import type { ApiResponse } from '@/lib/AxiosInstance/Signin/sign-in-client';

/**
 * Gets user information by phone number
 */
export async function getUserByPhone(phoneNumber: string): Promise<{
  success: boolean;
  exists: boolean;
  userId?: string;
  message: string;
}> {
  try {
    const axiosInstance = await SigninReqConfig();
    const response = await axiosInstance.get('/getuserbyphone', {
      params: { phone: phoneNumber },
    });

    const apiResponse = response.data as ApiResponse<{
      exists: boolean;
      userId?: string;
    }>;

    if (!apiResponse.success) {
      return {
        success: false,
        exists: false,
        message: apiResponse.message || 'Failed to find user information',
      };
    }

    return {
      success: true,
      exists: apiResponse.data?.exists || false,
      userId: apiResponse.data?.userId,
      message: 'User information retrieved successfully',
    };
  } catch (error) {
    console.error('Error getting user by phone number:', error);
    return {
      success: false,
      exists: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
