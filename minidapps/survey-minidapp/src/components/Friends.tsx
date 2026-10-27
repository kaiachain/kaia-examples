"use client";
import React from "react";
import { useLiff } from "../context/LiffProvider";
import { useParams } from "next/navigation";
import { inviteMessages } from "../messages";

export default function Friends() {
  const params = useParams();
  const { liffObject, loading, inviteFriends } = useLiff();

  const locale = params.locale as keyof typeof inviteMessages;
  const messages = inviteMessages[locale] || inviteMessages.en;

  if (loading) {
    return <div></div>;
  }

  if (liffObject && !liffObject.isInClient()) {
    return <div></div>;
  }

  return (
    <div className="flex flex-row items-center justify-center mb-3">
      <label htmlFor="inviteButton" className="text-xl font-bold">
        {messages.inviteMessage}
      </label>
      <button
        id="inviteButton"
        onClick={() => inviteFriends()}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 ml-2 rounded"
      >
        {messages.invite}
      </button>
    </div>
  );
}
