import { useRouter } from 'next/router';
import React,{ useEffect } from 'react';
import { apiClient } from '../../services/api'; // adapter selon ton chemin

export default function Activate() {
  const router = useRouter();
  const { key } = router.query;

  useEffect(() => {
    const activateAccount = async () => {
      if (key) {
        try {
          await apiClient({
            method: 'POST',
            path: 'auth/registration/verify-email',
            data:{key:key}
, });
          router.push('/InformationForm');
        } catch (error) {
          console.error("Error during activation", error);
        }
      }
    };

    activateAccount();
  }, [key, router]);

  return <div>Activating your account, please wait...</div>;
}
