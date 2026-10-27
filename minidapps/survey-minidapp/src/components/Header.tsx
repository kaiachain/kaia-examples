import React from "react";
import Nav from "./Nav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | destat",
    default: "Loading...",
  },
  description: "Decentralized statistics square",
};

export default function Header() {
  return (
    <header className="flex flex-row items-center fixed bg-violet-800 py-4 px-5 w-full left-0 top-0 z-10">
      <Nav />
    </header>
  );
}
