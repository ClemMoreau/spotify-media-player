"use client";

import styles from './page.module.css'
import { useEffect, useState } from 'react';

import { signIn, useSession } from 'next-auth/react';
import WebPlayback from '@/components/WebPlayback/WebPlayback';
import { AuthUser } from './api/auth/[...nextauth]/authOptions';


export default function Home() {

  const session = useSession();
  const [token, setToken] = useState<string>("");
  
  useEffect(() => {
    if (session.status === "authenticated") {
      const user = session.data.user as AuthUser;
      setToken(user.access_token);
    }
  }, [session]);

  return (
    <main className={styles.main}>
      {session.status === "authenticated" && token !== ""
        ? 
        (
        <>
          <div className={styles.mainContainer}></div>
          <div className={styles.playbackContainer}>
            <WebPlayback token={token} /> 
          </div>
        </>
        )
        :
        <button onClick={() => {
        signIn("spotify");
      }
      }>
        Sign In
      </button>}
          </main>
  )
}
