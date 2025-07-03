'use client';

import { useState } from 'react';
import { useMemberstack } from './MemberstackProvider';

export function AuthModals() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { memberstack, member } = useMemberstack();

  const openLoginModal = () => {
    setShowLoginModal(true);
    setError('');
  };
  
  const openSignupModal = () => {
    setShowSignupModal(true);
    setError('');
  };
  
  const closeModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    setError('');
    setLoginEmail('');
    setLoginPassword('');
    setSignupEmail('');
    setSignupPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberstack) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await memberstack.loginMemberEmailPassword({
        email: loginEmail,
        password: loginPassword,
      });
      
      console.log('Login successful:', result);
      closeModals();
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberstack) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await memberstack.signupMemberEmailPassword({
        email: signupEmail,
        password: signupPassword,
      });
      
      console.log('Signup successful:', result);
      closeModals();
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <>
      {/* Auth Buttons */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        {member ? (
          <button
            onClick={logout}
            style={{
              backgroundColor: "#e53e3e",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "500",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#c53030";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#e53e3e";
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <button
              onClick={openLoginModal}
              style={{
                backgroundColor: "#3182ce",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2c5282";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#3182ce";
              }}
            >
              Login
            </button>
            <button
              onClick={openSignupModal}
              style={{
                backgroundColor: "#38a169",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#2f855a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#38a169";
              }}
            >
              Sign Up
            </button>
          </>
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "32px",
            borderRadius: "12px",
            width: "400px",
            maxWidth: "90vw",
            position: "relative"
          }}>
            <button
              onClick={closeModals}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#666"
              }}
            >
              ×
            </button>
            
            <h2 style={{ marginBottom: "24px", textAlign: "center", color: "#2d3748" }}>
              Login to Your Account
            </h2>
            
            {error && (
              <div style={{
                backgroundColor: "#fed7d7",
                color: "#c53030",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "16px",
                fontSize: "14px"
              }}>
                {error}
              </div>
            )}

            <form 
              onSubmit={handleLogin}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#4a5568" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    opacity: isLoading ? 0.7 : 1
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#4a5568" }}>
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    opacity: isLoading ? 0.7 : 1
                  }}
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? "#a0aec0" : "#3182ce",
                  color: "white",
                  border: "none",
                  padding: "12px",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  marginTop: "8px"
                }}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "32px",
            borderRadius: "12px",
            width: "400px",
            maxWidth: "90vw",
            position: "relative"
          }}>
            <button
              onClick={closeModals}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#666"
              }}
            >
              ×
            </button>
            
            <h2 style={{ marginBottom: "24px", textAlign: "center", color: "#2d3748" }}>
              Create Your Account
            </h2>
            
            {error && (
              <div style={{
                backgroundColor: "#fed7d7",
                color: "#c53030",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "16px",
                fontSize: "14px"
              }}>
                {error}
              </div>
            )}

            <form 
              onSubmit={handleSignup}
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#4a5568" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    opacity: isLoading ? 0.7 : 1
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#4a5568" }}>
                  Password
                </label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    opacity: isLoading ? 0.7 : 1
                  }}
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? "#a0aec0" : "#38a169",
                  color: "white",
                  border: "none",
                  padding: "12px",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontWeight: "500",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  marginTop: "8px"
                }}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 