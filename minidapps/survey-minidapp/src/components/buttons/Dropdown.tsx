"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MenuItem } from "../Nav";

interface Props {
  item: MenuItem;
}

export default function Dropdown(props: Props) {
  const { item } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const menuItems = item?.children ? item.children : [];

  const toggle = () => {
    setIsOpen((old) => !old);
  };

  const transClass = isOpen ? "flex" : "hidden";

  return (
    <>
      <div className="relative">
        <button className="hover:text-blue-400" onClick={toggle}>
          <span className="font-semibold text-sm lg:text-xl md:text-xl text-white">
            {item.title}
          </span>
        </button>
        <div
          className={`absolute top-8 z-30 flex flex-col py-4 bg-zinc-400 ${transClass}`}
        >
          {menuItems.map((item) => (
            <Link
              key={item.route}
              className="hover:bg-zinc-100 hover:text-zinc-100 px-4 py-1"
              href={item?.route || ""}
              onClick={toggle}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
      {isOpen ? (
        <div
          className="fixed top-0 right-0 bottom-0 left-0 z-20 bg-black/40"
          onClick={toggle}
        ></div>
      ) : (
        <></>
      )}
    </>
  );
}
