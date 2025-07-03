"use client";

import { Section, Container } from "../../devlink/_Builtin";
import { ButtonPrimary } from "../../devlink/ButtonPrimary";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useMemberstack } from "../components/MemberstackProvider";
import { AuthModals } from "../components/AuthModals";

interface MortgageRatesData {
  frm_30?: string;
  frm_15?: string;
}

interface ApiResponse {
  success: boolean;
  data?: MortgageRatesData;
  error?: string;
}

export default function Home() {
  const { memberstack, member, loading } = useMemberstack();
  
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [costBreakdown, setCostBreakdown] = useState<{
    principal: number;
    interest: number;
    totalCost: number;
    chartData: Array<{ name: string; value: number; color: string }>;
  } | null>(null);
  const [mortgageRates, setMortgageRates] = useState<MortgageRatesData | null>(null);

  const fetchMortgageRates = async () => {
    try {
      const response = await fetch('/app/api/mortgage-rates');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json() as ApiResponse;
      
      if (result.success && result.data) {
        setMortgageRates(result.data);
      } else {
        console.error('Failed to fetch mortgage rates:', result.error);
        // Set fallback data for testing
        setMortgageRates({ frm_30: "6.95", frm_15: "6.12" });
      }
    } catch (error) {
      console.error('Error fetching mortgage rates:', error);
      // Set fallback data for testing
      setMortgageRates({ frm_30: "6.95", frm_15: "6.12" });
    }
  };

  useEffect(() => {
    fetchMortgageRates();
  }, []);

  const calculateCosts = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const payments = parseFloat(loanTerm) * 12;

    if (principal && rate && payments) {
      const monthlyPayment = 
        (principal * rate * Math.pow(1 + rate, payments)) / 
        (Math.pow(1 + rate, payments) - 1);
      
      const totalPayments = monthlyPayment * payments;
      const totalInterest = totalPayments - principal;
      
      setCostBreakdown({
        principal: principal,
        interest: totalInterest,
        totalCost: totalPayments,
        chartData: [
          { name: "Principal", value: principal, color: "#3245ff" },
          { name: "Interest", value: totalInterest, color: "#ff6b6b" }
        ]
      });
    }
  };

  return (
    <Section
      tag="section"
      style={{
        padding: "40px 20px",
        backgroundColor: "#fafbfc",
        minHeight: "100vh",
      }}
    >
      <Container>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h1 style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#1a202c",
              marginBottom: "12px",
              lineHeight: "1.2"
            }}>
              Mortgage Cost Calculator
            </h1>
            <p style={{ 
              fontSize: "1.1rem", 
              color: "#718096", 
              maxWidth: "600px", 
              margin: "0 auto",
              lineHeight: "1.6"
            }}>
              Discover the true cost of your mortgage with a detailed breakdown of principal and interest payments over time.
            </p>
          </div>

          {/* Memberstack Status */}
          <div style={{
            backgroundColor: "white",
            padding: "20px 24px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            marginBottom: "32px",
            textAlign: "center"
          }}>
            <div style={{
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#4a5568",
              marginBottom: "12px"
            }}>
              Memberstack Authentication
            </div>
            <div style={{ fontSize: "0.875rem", color: "#718096", marginBottom: "16px" }}>
              {loading ? (
                <span>🔄 Loading Memberstack...</span>
              ) : memberstack ? (
                <span>✅ Memberstack Connected | {member ? 'User logged in' : 'No user logged in'}</span>
              ) : (
                <span>❌ Memberstack not initialized</span>
              )}
            </div>
            
            {/* Auth Buttons */}
            {memberstack !== null && !loading && (
              <AuthModals />
            )}
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "400px 1fr", 
            gap: "40px", 
            alignItems: "start" 
          }}>
            {/* Input Form */}
            <div style={{
              backgroundColor: "white",
              padding: "32px",
              borderRadius: "16px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: "1px solid #e2e8f0"
            }}>
              <h3 style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                color: "#2d3748",
                marginBottom: "24px"
              }}>
                Loan Details
              </h3>

              <div style={{ display: "grid", gap: "24px" }}>
                <div>
                  <label style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#4a5568",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    Loan Amount
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{
                      position: "absolute",
                      left: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#a0aec0",
                      fontSize: "1.1rem",
                      fontWeight: "500"
                    }}>$</span>
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      placeholder="350,000"
                      style={{
                        width: "100%",
                        padding: "16px 16px 16px 32px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "12px",
                        fontSize: "1.1rem",
                        fontWeight: "500",
                        outline: "none",
                        transition: "all 0.2s",
                        backgroundColor: "#f7fafc"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#667eea";
                        e.target.style.backgroundColor = "white";
                        e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e2e8f0";
                        e.target.style.backgroundColor = "#f7fafc";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <label style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "#4a5568",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}>
                      Interest Rate
                    </label>
                    {mortgageRates && mortgageRates.frm_30 && (
                      <button
                        type="button"
                        onClick={() => setInterestRate(mortgageRates.frm_30?.toString() || "")}
                        style={{
                          fontSize: "0.75rem",
                          padding: "4px 8px",
                          backgroundColor: "#f0f4f8",
                          color: "#667eea",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "500",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#667eea";
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#f0f4f8";
                          e.currentTarget.style.color = "#667eea";
                        }}
                      >
                        Use Current Rate ({mortgageRates.frm_30}%)
                      </button>
                    )}
                  </div>
                  <div style={{ position: "relative" }}>
                    <span style={{
                      position: "absolute",
                      right: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#a0aec0",
                      fontSize: "1.1rem",
                      fontWeight: "500"
                    }}>%</span>
                    <input
                      type="number"
                      step="0.01"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="6.50"
                      style={{
                        width: "100%",
                        padding: "16px 32px 16px 16px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "12px",
                        fontSize: "1.1rem",
                        fontWeight: "500",
                        outline: "none",
                        transition: "all 0.2s",
                        backgroundColor: "#f7fafc"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#667eea";
                        e.target.style.backgroundColor = "white";
                        e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e2e8f0";
                        e.target.style.backgroundColor = "#f7fafc";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#4a5568",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}>
                    Loan Term
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{
                      position: "absolute",
                      right: "16px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#a0aec0",
                      fontSize: "0.875rem",
                      fontWeight: "500"
                    }}>years</span>
                    <input
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                      placeholder="30"
                      style={{
                        width: "100%",
                        padding: "16px 60px 16px 16px",
                        border: "2px solid #e2e8f0",
                        borderRadius: "12px",
                        fontSize: "1.1rem",
                        fontWeight: "500",
                        outline: "none",
                        transition: "all 0.2s",
                        backgroundColor: "#f7fafc"
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#667eea";
                        e.target.style.backgroundColor = "white";
                        e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e2e8f0";
                        e.target.style.backgroundColor = "#f7fafc";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "32px" }}>
                <ButtonPrimary
                  as="button"
                  buttonText="Calculate Total Cost"
                  onClick={calculateCosts}
                  style={{
                    width: "100%",
                    fontSize: "1.1rem",
                    fontWeight: "600"
                  }}
                />
              </div>
            </div>

            {/* Results */}
            <div style={{ minHeight: "400px" }}>
              {costBreakdown ? (
                <div style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  border: "1px solid #e2e8f0",
                  overflow: "hidden"
                }}>
                  {/* Header */}
                  <div style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    padding: "24px 32px",
                    color: "white"
                  }}>
                    <h3 style={{
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      margin: "0",
                      textAlign: "center"
                    }}>
                      Your Total Mortgage Cost
                    </h3>
                  </div>

                  <div style={{ padding: "32px" }}>
                    {/* Summary Cards */}
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(3, 1fr)", 
                      gap: "16px", 
                      marginBottom: "32px" 
                    }}>
                      <div style={{
                        textAlign: "center",
                        padding: "20px",
                        backgroundColor: "#f0f4f8",
                        borderRadius: "12px",
                        border: "2px solid #667eea"
                      }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                          Principal
                        </div>
                        <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#667eea" }}>
                          ${costBreakdown.principal.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </div>
                      </div>

                      <div style={{
                        textAlign: "center",
                        padding: "20px",
                        backgroundColor: "#fef5e7",
                        borderRadius: "12px",
                        border: "2px solid #f6ad55"
                      }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                          Interest
                        </div>
                        <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#f6ad55" }}>
                          ${costBreakdown.interest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </div>
                      </div>

                      <div style={{
                        textAlign: "center",
                        padding: "20px",
                        backgroundColor: "#e6fffa",
                        borderRadius: "12px",
                        border: "2px solid #38b2ac"
                      }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "#4a5568", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                          Total Cost
                        </div>
                        <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "#38b2ac" }}>
                          ${costBreakdown.totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </div>
                      </div>
                    </div>

                    {/* Chart */}
                    <div style={{ height: "350px", marginTop: "24px" }}>
                      <h4 style={{ 
                        textAlign: "center", 
                        marginBottom: "24px", 
                        fontSize: "1.1rem", 
                        fontWeight: "600", 
                        color: "#4a5568" 
                      }}>
                        Cost Breakdown
                      </h4>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={costBreakdown.chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(1)}%`}
                            outerRadius={120}
                            fill="#8884d8"
                            dataKey="value"
                            strokeWidth={3}
                            stroke="white"
                          >
                            {costBreakdown.chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? "#667eea" : "#f6ad55"} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => [
                              `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
                              'Amount'
                            ]}
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e2e8f0",
                              borderRadius: "8px",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  backgroundColor: "white",
                  borderRadius: "16px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  border: "1px solid #e2e8f0",
                  padding: "48px 32px",
                  textAlign: "center",
                  color: "#a0aec0"
                }}>
                  <div style={{ fontSize: "4rem", marginBottom: "16px" }}>📊</div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "8px", color: "#4a5568" }}>
                    Ready to Calculate
                  </h3>
                  <p style={{ fontSize: "1rem", lineHeight: "1.5" }}>
                    Enter your loan details and click &quot;Calculate Total Cost&quot; to see your mortgage breakdown with an interactive chart.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
