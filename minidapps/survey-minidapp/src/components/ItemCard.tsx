import React from "react";
import { useWeb3 } from "../context/Web3Provider";
import currency from "currency.js";
import currencyCodes from "currency-codes";
interface ItemCardProps {
  itemIdentifier: string;
  imageUrl: string;
  name: string;
  price: string;
  pgType: string;
  currencyCode: string;
}

export default function ItemCard(Props: ItemCardProps) {
  const { provider, account, pProvider } = useWeb3();

  const priceFormat = (amount: string, code: string) => {
    const currencyInfo = currencyCodes.code(code);

    if (!currencyInfo) {
      throw new Error(`Unsupported currency code: ${code}`);
    }

    const decimalPlaces = currencyInfo.digits;
    return currency(amount, { precision: decimalPlaces })
      .divide(10 ** decimalPlaces)
      .format()
      .substring(1);
  };

  const finalizePayment = async (id: string) => {
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/store/finalize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        }
      );

      const data = await result.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const hostPayment = async () => {
    if (!pProvider || !account || !provider) {
      alert("Please connect wallet");
      return;
    }

    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/store`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            buyerAddress: account,
            itemIdentifier: Props.itemIdentifier,
            name: Props.name,
            imageUrl: Props.imageUrl,
            pgType: Props.pgType,
            currencyCode: Props.currencyCode,
            price: Props.price,
            testMode: true,
          }),
        }
      );

      const data = await result.json();
      pProvider.startPayment(data.pId).then(() => {
        finalizePayment(data.pId);
        alert("Payment is success");
      });
    } catch (error) {
      alert("Payment is failed");
    }
  };
  return (
    <div className="flex flex-col items-center bg-slate-400 rounded-2xl w-32 h-56">
      <img
        className="rounded-lg mb-1.5"
        src={Props.imageUrl}
        alt={Props.name}
      />
      <h1>{Props.name}</h1>
      <p>
        {Props.pgType === "STRIPE"
          ? `${priceFormat(Props.price, Props.currencyCode)} ${
              Props.currencyCode
            }`
          : `${Props.price} ${Props.currencyCode}`}
      </p>
      <button
        className="flex justify-center items-center bg-slate-700 text-white rounded-lg w-20 h-8"
        onClick={hostPayment}
      >
        Buy
      </button>
    </div>
  );
}
