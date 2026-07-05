'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const nameEQ = 'token=';
    const cookies = document.cookie.split(';');
    let token = null;
    
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(nameEQ)) {
        token = decodeURIComponent(cookie.substring(nameEQ.length));
        break;
      }
    }

    if (token) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return null;
}
