"use client";

import { Section, Block, Link, Container } from "../../devlink/_Builtin";
import { Navbar } from "../../devlink/Navbar";
import { Footer } from "../../devlink/Footer";
import { useState } from "react";

export default function Home() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  const calculatePayment = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const payments = parseFloat(loanTerm) * 12;

    if (principal && rate && payments) {
      const monthlyPaymentCalc = 
        (principal * rate * Math.pow(1 + rate, payments)) / 
        (Math.pow(1 + rate, payments) - 1);
      setMonthlyPayment(monthlyPaymentCalc);
    }
  };

  return (
    <>
      <Navbar 
        navbarLinkFeatures="Hello"
        navbarLinkProducts="Webflow"
        navbarLinkResources="Cloud"
        navbarLinkContact=""
      />
      
      <Section
        tag="section"
        className="margin-bottom-24px"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container>
          <Block
            tag="div"
            className="hero-split"
            style={{
              textAlign: "center",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <h1
              className="margin-bottom-24px"
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                color: "#3245ff",
              }}
            >
              🎉 Your Webflow Cloud App is Live!
            </h1>
            <Block tag="p" className="margin-bottom-24px">
              This page content is located in `src/app/page.tsx`. You can edit this file to customize your homepage content, styling, and layout.
            </Block>
            <div>
              <Link
                button={true}
                options={{
                  href: "#",
                }}
                className="button-primary"
              >
                Explore Features
              </Link>
            </div>
          </Block>
        </Container>
      </Section>
      
      <Section
        tag="section"
        style={{
          padding: "60px 0",
          backgroundColor: "#f8f9ff",
        }}
      >
        <Container>
          <Block
            tag="div"
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: 600,
                color: "#3245ff",
                marginBottom: "20px",
              }}
            >
              🏠 Mortgage Payment Calculator
            </h2>
            <p style={{ marginBottom: "40px", color: "#666" }}>
              Calculate your monthly mortgage payment based on loan amount, interest rate, and term.
            </p>

            <div
              style={{
                display: "grid",
                gap: "20px",
                marginBottom: "30px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Loan Amount ($)
                </label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="350000"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e0e7ff",
                    borderRadius: "8px",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="6.5"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e0e7ff",
                    borderRadius: "8px",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    color: "#333",
                  }}
                >
                  Loan Term (Years)
                </label>
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  placeholder="30"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e0e7ff",
                    borderRadius: "8px",
                    fontSize: "16px",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <button
              onClick={calculatePayment}
              style={{
                backgroundColor: "#3245ff",
                color: "white",
                padding: "12px 30px",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                marginBottom: "30px",
              }}
            >
              Calculate Payment
            </button>

            {monthlyPayment > 0 && (
              <div
                style={{
                  backgroundColor: "white",
                  padding: "30px",
                  borderRadius: "12px",
                  border: "2px solid #3245ff",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.2rem",
                    color: "#333",
                    marginBottom: "10px",
                  }}
                >
                  Monthly Payment
                </h3>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "700",
                    color: "#3245ff",
                  }}
                >
                  ${monthlyPayment.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            )}
          </Block>
        </Container>
      </Section>
      
      <Footer />
    </>
  );
}
