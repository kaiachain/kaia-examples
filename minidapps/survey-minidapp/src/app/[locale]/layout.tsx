import React from "react";
import "./styles/globals.css";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { Web3Provider } from "../../context/Web3Provider";
import { Metadata } from "next";
import { LiffProvider } from "../../context/LiffProvider";

export const metadata: Metadata = {
  title: {
    default: "home",
    template: "%s | DESTAT",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen w-full bg-purple-100 px-2">
        <LiffProvider>
          <Web3Provider>
            <Header />
            <main className="mt-24">{children}</main>
            <Footer />
          </Web3Provider>
        </LiffProvider>
      </body>
    </html>
  );
}
