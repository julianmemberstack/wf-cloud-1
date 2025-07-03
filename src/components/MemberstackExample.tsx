'use client';

import { useMemberstack } from './MemberstackProvider';

export function MemberstackExample() {
  const { memberstack, member, loading } = useMemberstack();

  // Show login modal
  const showLogin = () => {
    if (memberstack) {
      memberstack.showModal('login');
    }
  };

  // Show signup modal
  const showSignup = () => {
    if (memberstack) {
      memberstack.showModal('signup');
    }
  };

  // Logout user
  const logout = async () => {
    if (memberstack) {
      try {
        await memberstack.logout();
        console.log('User logged out successfully');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      marginBottom: '24px'
    }}>
      <h3 style={{ 
        fontSize: '1.25rem', 
        fontWeight: '600', 
        marginBottom: '16px',
        color: '#2d3748'
      }}>
        Memberstack Auth Example
      </h3>

      {member ? (
        <div>
          <p style={{ marginBottom: '16px', color: '#4a5568' }}>
            Welcome back, <strong>{member.auth.email}</strong>!
          </p>
          <button
            onClick={logout}
            style={{
              backgroundColor: '#e53e3e',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: '16px', color: '#4a5568' }}>
            You are not logged in. Try the auth modals:
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={showLogin}
              style={{
                backgroundColor: '#3182ce',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Show Login
            </button>
            <button
              onClick={showSignup}
              style={{
                backgroundColor: '#38a169',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              Show Signup
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 