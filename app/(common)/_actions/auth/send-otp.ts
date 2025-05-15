'use server';

import { getUserByPhone } from './get-user-by-phone';
import { createOtpToken, storeOtpToken } from './otp-utils';

/**
 * Sends an OTP verification code to the specified phone number
 * @param phoneNumber - The phone number to send the OTP code to
 * @returns Object with success status and message
 */
export async function sendOtpCode(phoneNumber: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Validate phone number format (basic validation)
    if (!phoneNumber || phoneNumber.length < 10) {
      return {
        success: false,
        message: 'Please provide a valid phone number',
      };
    }

    // Check if user exists with this phone number
    const userResult = await getUserByPhone(phoneNumber);
    
    if (!userResult.success) {
      // Don't reveal if the phone number exists or not for security
      console.error('Error checking phone number:', userResult.message);
      return {
        success: false,
        message: 'Failed to process request. Please try again later.',
      };
    }
    
    if (!userResult.exists) {
      // For security, don't reveal that the phone doesn't exist in our system
      console.log('Phone number not found, but responding with success');
      
      // In production, you might still want to simulate sending an OTP
      // to avoid timing attacks that could reveal if a phone exists
      
      return {
        success: true,
        message: 'Verification code sent!',
      };
    }
    
    // Generate a 6-digit OTP code
    const otpCode = createOtpToken();
    
    // Store the OTP for later verification
    // This would typically be stored in a database with an expiration time
    const tokenStored = await storeOtpToken(phoneNumber, otpCode);
    
    if (!tokenStored) {
      return {
        success: false,
        message: 'Failed to generate verification code. Please try again.',
      };
    }
    
    // In a real implementation, you would integrate with an SMS provider like Twilio
    // For this example, we'll just simulate sending the code
    console.log(`[SIMULATED SMS] Sending code ${otpCode} to ${phoneNumber}`);
    
    // In production:
    // await sendSmsViaTwilio(phoneNumber, `Your GymNavigator verification code: ${otpCode}`);
    
    return {
      success: true,
      message: 'Verification code sent!',
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
    };
  }
}
