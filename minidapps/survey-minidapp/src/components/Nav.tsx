"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import Dropdown from "./buttons/Dropdown";
import WalletBtn from "./buttons/WalletBtn";
import { useLiff } from "../context/LiffProvider";
import LineLoginBtn from "./buttons/LineLoginBtn";
import { useParams } from "next/navigation";
import { navTranslations, NavMessages } from "../messages";

export interface MenuItem {
  title: string;
  route?: string;
  children?: MenuItem[];
}

export default function Nav() {
  const params = useParams();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { liffObject, loading } = useLiff();

  const locale = params.locale as keyof typeof navTranslations;
  const messages: NavMessages = navTranslations[locale] || navTranslations.en;

  const menuItems: MenuItem[] = [
    {
      title: messages.survey,
      route: "/square/surveys",
    },
    {
      title: messages.create,
      route: "/survey/create",
    },
    {
      title: messages.store,
      route: "/store",
    },
  ];

  if (loading) {
    return <div></div>;
  }

  return (
    <>
      <div className="flex justify-start w-1/3 text-4xl font-bold text-violet-300">
        <Link href="/square/surveys">
          <h1>DESTAT</h1>
        </Link>
      </div>
      <div className="lg:flex md:flex justify-evenly w-1/3 ml-4 text-white hidden">
        {menuItems.map((item) => {
          return item.hasOwnProperty("children") ? (
            <Dropdown key={item.title} item={item} />
          ) : (
            <Link
              key={item.title}
              className="hover:text-blue-500 font-semibold text-xl text-white"
              href={item?.route || ""}
            >
              {item.title}
            </Link>
          );
        })}
      </div>
      <div className="flex justify-end lg:w-1/3 md:w-1/3 w-2/4 ml-5">
        <WalletBtn />
      </div>
      <div className="flex flex-col justify-end ml-4 lg:hidden md:hidden">
        <div
          className="space-y-2"
          onClick={() => setIsNavOpen((prev) => !prev)}
        >
          <span className="block h-0.5 w-8 animate-pulse bg-white"></span>
          <span className="block h-0.5 w-8 animate-pulse bg-white"></span>
          <span className="block h-0.5 w-8 animate-pulse bg-white"></span>
        </div>
        <div
          className={`${
            isNavOpen ? "block" : "hidden"
          } flex flex-col absolute top-16 right-0 bg-purple-300 p-3 rounded-sm gap-3`}
        >
          {menuItems.map((item) => {
            return item.hasOwnProperty("children") ? (
              <Dropdown key={item.title} item={item} />
            ) : (
              <Link
                key={item.title}
                className="hover:text-blue-500 font-semibold text-sm text-white"
                href={item?.route || ""}
              >
                {item.title}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
