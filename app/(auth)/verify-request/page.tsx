import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleCheck, Mail } from 'lucide-react';
import Link from 'next/link';

export default function VerifyRequestPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-950/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription>
            A sign in link has been sent to your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pt-6">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <Mail className="h-10 w-10" />
          </div>
          
          <div className="text-center space-y-4">
            <p className="text-gray-700">
              We've sent you a secure sign-in link. Please check your email and click the link to continue.
            </p>
            
            <div className="flex items-center justify-center gap-2 text-sm text-green-600">
              <CircleCheck className="h-4 w-4" />
              <span>No password required</span>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500 max-w-xs">
            The link will expire in 10 minutes. If you don't see the email, check your spam folder.
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline" className="w-full">
            <Link href="/signin">
              Return to sign in
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
