'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Loader2 } from 'lucide-react';

function CallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      return;
    }

    const handleCallback = async () => {
      try {
        const { data } = await api.post('/auth/google/callback', { code });
        setAuth(data.user, data.token);
        router.push('/dashboard');
      } catch (err) {
        console.error('Auth callback failed', err);
        router.push('/login?error=auth_failed');
      }
    };

    handleCallback();
  }, [searchParams, router, setAuth]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <h2 className="text-xl font-outfit font-semibold gradient-text">Authenticating with Google...</h2>
      <p className="text-muted-foreground text-sm">Please wait while we secure your session.</p>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense>
      <CallbackContent />
    </Suspense>
  );
}
