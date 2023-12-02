"use client";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

 

interface AuthSessionProviderProps {
    children: React.ReactNode;
    session: Session | null | undefined;  
}

const AuthSessionProvider = ({children, session}: AuthSessionProviderProps) => {
    return ( <SessionProvider session={session}>{children}</SessionProvider> );
}
 
export default AuthSessionProvider;