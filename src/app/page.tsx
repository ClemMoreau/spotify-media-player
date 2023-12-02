"use client";

import Image from 'next/image'
import styles from './page.module.css'
import { useEffect } from 'react';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

import sdk from "../lib/ClientInstance";
import { signIn, useSession } from 'next-auth/react';


export default function Home() {

  const session = useSession();
  console.log(session);
  return (
    <main className={styles.main}>
      <button onClick={() => {
        signIn("spotify");
      }
      }>
        Sign In
      </button>
    </main>
  )
}
