import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen w-full bg-[#0d0a08] flex items-center justify-center">
      <AuthenticateWithRedirectCallback continueSignUpUrl="/portal-mubes?mode=signup" />
    </div>
  );
}
