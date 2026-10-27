"use client";

import liff from "@line/liff";
import { type LiffMessage } from "@liff/send-messages/lib/type";
import DappPortalSDK from "@linenext/dapp-portal-sdk";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { inviteMessages } from "../messages";
import { set } from "react-hook-form";

interface LiffContextType {
  liffObject: any;
  liffError: any;
  dappPortalSDK: DappPortalSDK | null;
  inviteFriends: () => void;
  encodedUID: string | null; // referer's encodedUID
  loading: boolean;
}

const LiffContext = createContext<LiffContextType | undefined>(undefined);

export const LiffProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [liffObject, setLiffObject] = useState<typeof liff | null>(null);
  const [liffError, setLiffError] = useState(null);
  const [dappPortalSDK, setDappPortalSDK] = useState<DappPortalSDK | null>(
    null
  );
  const [encodedUID, setEncodedUID] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const locale = params.locale as keyof typeof inviteMessages;

  const initDappPortalSDK = async () => {
    const sdk = await DappPortalSDK.init({
      clientId: process.env.NEXT_PUBLIC_DAPP_PORTAL_CLIENT_ID as string,
      chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
    });
    setDappPortalSDK(sdk);
  };

  const getFlexMessage = (locale: string, encodedUID: string): LiffMessage => {
    const message = inviteMessages[locale] || inviteMessages["en"];
    return {
      type: "flex",
      altText: message.altText,
      contents: {
        type: "bubble",
        hero: {
          type: "image",
          url: "https://cyqrsixkgnoiflgq.public.blob.vercel-storage.com/IMG_9055-GNxneDxjn0bwyou8SDKDhRHJD0xoJg.png",
          size: "full",
          aspectRatio: "20:13",
          aspectMode: "cover",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              // text: message.contentsText1,
              text: encodedUID,
              weight: "bold",
              size: "xl",
            },
            {
              type: "text",
              text: message.contentsText2,
              wrap: true,
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "button",
              style: "primary",
              action: {
                type: "uri",
                label: message.footerLabel,
                uri:
                  "https://liff.line.me/2006655154-K808DVbx?encodedUID=" +
                  encodedUID,
              },
            },
          ],
        },
      },
    };
  };

  const inviteFriends = async () => {
    if (liff && !liff.isLoggedIn()) {
      liff.login();
      return;
    }

    let encodedUID;
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invite/encode`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: liff.getAccessToken(),
          }),
        }
      ).then((res) => res.json());
      encodedUID = result.encodedUID;
    } catch (error) {
      alert("Error when encoding user ID");
    }

    const msg = getFlexMessage(locale, encodedUID);

    if (liff.isApiAvailable("shareTargetPicker")) {
      await liff.shareTargetPicker([msg]);
    } else {
      alert("ShareTargetPicker is not available");
    }
  };

  const parseEncodedUID = (paramsStr: string) => {
    const paramsAll = paramsStr.split("?")[1];
    const params = paramsAll.split("&");
    const encodedUID = params.find((param) => param.includes("encodedUID"));
    return encodedUID?.split("=")[1];
  };

  useEffect(() => {
    let encodedUID;
    liff
      .init({
        liffId: process.env.NEXT_PUBLIC_LIFF_ID as string,
      })
      .then(() => {
        console.log("liff initialization is done");

        // invited by friends
        if (window.location.search !== "") {
          encodedUID = parseEncodedUID(window.location.search);
          setEncodedUID(encodedUID as string);
        }
        setLiffObject(liff);
        initDappPortalSDK().then(() => {
          console.log("miniDappSDK initialization is done");
          setLoading(false);
        });
      })
      .catch((error: any) => {
        console.log(`liff initialization failed: ${error}`);
        setLiffError(error.toString());
      });
  }, []);

  return (
    <LiffContext.Provider
      value={{
        liffObject,
        liffError,
        dappPortalSDK,
        encodedUID,
        inviteFriends,
        loading,
      }}
    >
      {children}
    </LiffContext.Provider>
  );
};

export const useLiff = () => {
  const context = useContext(LiffContext);
  if (!context) {
    throw new Error("useLiff must be used within a LiffProvider");
  }
  return context;
};
