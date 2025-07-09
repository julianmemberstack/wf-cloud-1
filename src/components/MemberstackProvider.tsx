'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface MemberData {
  auth?: {
    email?: string;
  };
  [key: string]: unknown;
}

interface MemberstackContextType {
  memberstack: unknown;
  member: MemberData | null;
  loading: boolean;
  error: string | null;
}

const MemberstackContext = createContext<MemberstackContextType | undefined>(undefined);

export function MemberstackProvider({ children }: { children: ReactNode }) {
  const [memberstack, setMemberstack] = useState<unknown>(null);
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side
    setIsClient(true);

    const initializeMemberstack = async () => {
      try {
        console.log('🔄 Starting Memberstack initialization...');
        
        const publicKey = process.env.NEXT_PUBLIC_MEMBERSTACK_KEY;
        console.log('🔑 Public key check:', publicKey ? '✅ Found' : '❌ Missing');
        
        if (!publicKey) {
          const errorMsg = 'Memberstack public key not found in environment variables';
          console.error('❌', errorMsg);
          setError(errorMsg);
          setLoading(false);
          return;
        }

        console.log('📦 Importing Memberstack DOM...');
        // Dynamic import to ensure it only loads on client side
        const memberstackDOM = await import('@memberstack/dom');
        console.log('✅ Memberstack DOM imported successfully');

        console.log('🚀 Initializing Memberstack with config...');
        // Initialize Memberstack
        const ms = memberstackDOM.default.init({
          publicKey,
          useCookies: true,
          sessionDurationDays: 30,
        });

        console.log('✅ Memberstack initialized successfully');
        setMemberstack(ms);

        // Check current member
        const checkCurrentMember = async () => {
          try {
            console.log('👤 Checking current member...');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: currentMember } = await (ms as any).getCurrentMember();
            console.log('👤 Current member:', currentMember ? '✅ Found' : '❌ Not logged in');
            setMember(currentMember);
          } catch (memberError) {
            console.error('❌ Error checking current member:', memberError);
            // Don't set the main error for this, as it's normal if no user is logged in
          } finally {
            setLoading(false);
          }
        };

        checkCurrentMember();

        // Listen for auth changes
        console.log('👂 Setting up auth change listener...');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const authListener = (ms as any).onAuthChange((currentMember: MemberData | null) => {
          console.log('🔄 Auth change detected:', currentMember ? '✅ User logged in' : '❌ User logged out');
          setMember(currentMember);
        });

        // Cleanup function - store it for later cleanup
        return () => {
          console.log('🧹 Cleaning up Memberstack listener...');
          if (authListener && authListener.unsubscribe) {
            authListener.unsubscribe();
          }
        };
      } catch (initError) {
        const errorMsg = `Failed to initialize Memberstack: ${initError instanceof Error ? initError.message : 'Unknown error'}`;
        console.error('❌', errorMsg, initError);
        setError(errorMsg);
        setLoading(false);
      }
    };

    initializeMemberstack();
  }, []);

  const value = {
    memberstack,
    member,
    loading,
    error,
  };

  // Don't render until client-side to prevent SSR issues
  if (!isClient) {
    return (
      <MemberstackContext.Provider value={{ memberstack: null, member: null, loading: true, error: null }}>
        {children}
      </MemberstackContext.Provider>
    );
  }

  return (
    <MemberstackContext.Provider value={value}>
      {children}
    </MemberstackContext.Provider>
  );
}

export function useMemberstack() {
  const context = useContext(MemberstackContext);
  if (context === undefined) {
    throw new Error('useMemberstack must be used within a MemberstackProvider');
  }
  return context;
} 