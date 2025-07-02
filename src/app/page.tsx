"use client";

import { Section, Block, Link, Container } from "../../devlink/_Builtin";
import { Navbar } from "../../devlink/Navbar";
import { Footer } from "../../devlink/Footer";

export default function Home() {
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
                background: "linear-gradient(83.21deg, #3245ff 0%, #bc52ee 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
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
      
      <Footer />
    </>
  );
}
