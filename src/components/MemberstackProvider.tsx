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
}

const MemberstackContext = createContext<MemberstackContextType | undefined>(undefined);

export function MemberstackProvider({ children }: { children: ReactNode }) {
  const [memberstack, setMemberstack] = useState<unknown>(null);
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark as client-side
    setIsClient(true);

    const initializeMemberstack = async () => {
      try {
        const publicKey = process.env.NEXT_PUBLIC_MEMBERSTACK_KEY;
        
        if (!publicKey) {
          console.error('Memberstack public key not found in environment variables');
          setLoading(false);
          return;
        }

        // Dynamic import to ensure it only loads on client side
        const memberstackDOM = await import('@memberstack/dom');
        
        // Initialize Memberstack
        const ms = memberstackDOM.default.init({
          publicKey,
          useCookies: true,
          sessionDurationDays: 30,
        });

        setMemberstack(ms);

        // Check current member
        const checkCurrentMember = async () => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: currentMember } = await (ms as any).getCurrentMember();
            setMember(currentMember);
          } catch (error) {
            console.error('Error checking current member:', error);
          } finally {
            setLoading(false);
          }
        };

        checkCurrentMember();

        // Listen for auth changes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const authListener = (ms as any).onAuthChange((currentMember: MemberData | null) => {
          setMember(currentMember);
        });

        // Cleanup function - store it for later cleanup
        return () => {
          if (authListener && authListener.unsubscribe) {
            authListener.unsubscribe();
          }
        };
      } catch (error) {
        console.error('Error initializing Memberstack:', error);
        setLoading(false);
      }
    };

    initializeMemberstack();
  }, []);

  const value = {
    memberstack,
    member,
    loading,
  };

  // Don't render until client-side to prevent SSR issues
  if (!isClient) {
    return (
      <MemberstackContext.Provider value={{ memberstack: null, member: null, loading: true }}>
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