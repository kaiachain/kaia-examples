import React from "react";
import { useLiff } from "../../context/LiffProvider";

export default function LineLoginBtn() {
  const { liffObject, liffError } = useLiff();

  const loginRequest = async () => {
    if (!liffObject) {
      return;
    }
    try {
      await liffObject.login({
        redirectUri: window.location.href,
      });
    } catch (e) {
      console.error(e);
      localStorage.setItem("LIFF_INIT_ERROR", JSON.stringify(e));
    }
  };

  return (
    <button
      onClick={() => {
        loginRequest();
      }}
      className="bg-green-400 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
    >
      LINE Login
    </button>
  );
}
