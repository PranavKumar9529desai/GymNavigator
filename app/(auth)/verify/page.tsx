'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'error' | 'verified'>('loading');
  const [message, setMessage] = useState('Verifying your sign-in link...');
  
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid or expired verification link');
      toast({
        title: 'Verification Failed',
        description: 'The verification link is invalid or has expired.',
        variant: 'destructive',
      });
      return;
    }

    // This page is rendered when the user clicks the magic link
    // NextAuth automatically handles the verification and redirects to callbackUrl
    // This component is just to show a nice UI during that process
    
    const redirectTimer = setTimeout(() => {
      setStatus('verified');
      setMessage('Verification successful! Redirecting to dashboard...');
      toast({
        title: 'Success!',
        description: 'Email verified successfully.',
      });
    }, 2000);
    
    return () => {
      clearTimeout(redirectTimer);
    };
  }, [searchParams, toast]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-950/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
          <CardDescription>
            {status === 'loading' && 'We\'re verifying your email address'}
            {status === 'verified' && 'Email verified successfully'}
            {status === 'error' && 'There was a problem verifying your email'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pt-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center
            ${status === 'loading' ? 'bg-blue-100 text-blue-600' : 
              status === 'verified' ? 'bg-green-100 text-green-600' : 
              'bg-red-100 text-red-600'}`}
          >
            {status === 'loading' ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <Mail className="h-8 w-8" />
            )}
          </div>
          
          <p className="text-center text-gray-700">{message}</p>
          
          {status === 'error' && (
            <div className="w-full">
              <Button 
                variant="default" 
                className="w-full mt-4"
                onClick={() => window.location.href = '/signin'}
              >
                Return to Sign In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
