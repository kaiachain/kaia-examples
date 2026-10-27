"use client";

import React from "react";
import ItemCard from "../../../components/ItemCard";

const exampleItems = [
  {
    itemIdentifier: "crypto-payment-test",
    name: "testItem-1",
    imageUrl:
      "https://cyqrsixkgnoiflgq.public.blob.vercel-storage.com/IMG_9055-GNxneDxjn0bwyou8SDKDhRHJD0xoJg.png",
    price: "1", // 1 KAIA
    currencyCode: "KAIA",
    pgType: "CRYPTO",
  },
  {
    itemIdentifier: "usd-payment-test",
    name: "testItem-2",
    imageUrl:
      "https://cyqrsixkgnoiflgq.public.blob.vercel-storage.com/IMG_9055-GNxneDxjn0bwyou8SDKDhRHJD0xoJg.png",
    price: "100", // 1 USD
    currencyCode: "USD",
    pgType: "STRIPE",
  },
  {
    itemIdentifier: "jpy-payment-test",
    name: "testItem-3",
    imageUrl:
      "https://cyqrsixkgnoiflgq.public.blob.vercel-storage.com/IMG_9055-GNxneDxjn0bwyou8SDKDhRHJD0xoJg.png",
    price: "100", // 100 JPY
    currencyCode: "JPY",
    pgType: "STRIPE",
  },
  {
    itemIdentifier: "krw-payment-test",
    name: "testItem-4",
    imageUrl:
      "https://cyqrsixkgnoiflgq.public.blob.vercel-storage.com/IMG_9055-GNxneDxjn0bwyou8SDKDhRHJD0xoJg.png",
    price: "1000", // 1000 KRW
    currencyCode: "KRW",
    pgType: "STRIPE",
  },
];

export default function Page() {
  return (
    <div className="flex flex-wrap mx-10 my-5 gap-5">
      {exampleItems.map((item) => (
        <ItemCard
          key={item.itemIdentifier}
          itemIdentifier={item.itemIdentifier}
          imageUrl={item.imageUrl}
          name={item.name}
          price={item.price}
          pgType={item.pgType}
          currencyCode={item.currencyCode}
        />
      ))}
    </div>
  );
}
