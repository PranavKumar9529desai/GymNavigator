'use server';

import { cookies } from 'next/headers';
import { randomBytes, createHmac } from 'crypto';

// In a real app, these tokens should be stored in a database with expiration times
// For this example, we'll use encrypted cookies with a server-side secret

const OTP_COOKIE_NAME = 'gym_nav_otp_token';
const OTP_SECRET = process.env.NEXTAUTH_SECRET || 'default-secret-key-change-this';
const OTP_EXPIRY = 10 * 60 * 1000; // 10 minutes in milliseconds

/**
 * Generate a random 6-digit OTP code
 */
export function createOtpToken(): string {
  // Generate a random 6-digit number
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Hash an OTP code with the phone number for verification
 */
function hashOtp(phoneNumber: string, otpCode: string): string {
  const hmac = createHmac('sha256', OTP_SECRET);
  hmac.update(`${phoneNumber}:${otpCode}`);
  return hmac.digest('hex');
}

/**
 * Store an OTP in an encrypted cookie
 */
export async function storeOtpToken(phoneNumber: string, otpCode: string): Promise<boolean> {
  try {
    // Generate a hash of the OTP and phone number
    const hashedOtp = hashOtp(phoneNumber, otpCode);
    
    // Create a token with expiration time
    const expiry = Date.now() + OTP_EXPIRY;
    
    // Store as JSON string with expiry time
    const tokenData = JSON.stringify({
      hash: hashedOtp,
      expiry,
    });
    
    // Store in a cookie with the phone number as part of the name
    // This allows multiple devices/numbers to request OTPs without conflicts
    cookies().set(`${OTP_COOKIE_NAME}_${phoneNumber}`, tokenData, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      maxAge: OTP_EXPIRY / 1000, // Convert to seconds for cookie
      path: '/',
    });
    
    return true;
  } catch (error) {
    console.error('Error storing OTP token:', error);
    return false;
  }
}

/**
 * Verify an OTP code against the stored token
 */
export async function verifyOtpToken(phoneNumber: string, otpCode: string): Promise<boolean> {
  try {
    // Get the token from the cookie
    const cookieName = `${OTP_COOKIE_NAME}_${phoneNumber}`;
    const token = cookies().get(cookieName);
    
    if (!token || !token.value) {
      return false;
    }
    
    // Parse the token data
    const tokenData = JSON.parse(token.value);
    
    // Check if the token is expired
    if (tokenData.expiry < Date.now()) {
      // Clean up expired token
      cookies().delete(cookieName);
      return false;
    }
    
    // Compute the hash of the provided OTP
    const hashedOtp = hashOtp(phoneNumber, otpCode);
    
    // Check if the hashes match
    const isValid = hashedOtp === tokenData.hash;
    
    // If valid, delete the token to prevent reuse
    if (isValid) {
      cookies().delete(cookieName);
    }
    
    return isValid;
  } catch (error) {
    console.error('Error verifying OTP token:', error);
    return false;
  }
}
