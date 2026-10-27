import React from "react";
import { ethers } from "ethers";
import Link from "next/link";

export default function SurveyCard({
  id,
  title,
  desc,
  reward,
  remaining,
  respondents,
  daysLeft,
  finished,
}: {
  id: string;
  title: string;
  desc: string;
  reward: ethers.BigNumberish;
  remaining: number;
  respondents: number;
  daysLeft: number;
  finished: boolean;
}) {
  return (
    <div className="ml-2">
      <Link href={`surveys/${id}`}>
        <div className="flex flex-col rounded-lg bg-violet-400 my-1 w-80 h-auto flex-shrink-0">
          <div className="flex flex-col relative">
            <div className="flex justify-between items-center">
              {finished ? (
                <div className="absolute bg-red-400 rounded-2xl px-3 py-0.5 top-2 left-2">
                  <span className="text-white font-bold">Finished</span>
                </div>
              ) : (
                <div>
                  <div className="absolute bg-lime-400 rounded-2xl px-3 py-0.5 top-2 left-2">
                    <span className="text-white font-bold">In Progress</span>
                  </div>
                  {daysLeft < 1 ? (
                    <div
                      className={`absolute bg-amber-600 rounded-2xl px-3 py-0.5 top-2 left-32 ${
                        daysLeft > 0 ? "animate-pulse" : ""
                      }`}
                    >
                      <span className="text-white font-bold">
                        {daysLeft < 0
                          ? "Finished"
                          : `h-${Math.floor(daysLeft * 24)}`}
                      </span>
                    </div>
                  ) : (
                    <div className="absolute bg-teal-500 rounded-2xl px-3 py-0.5 top-2 left-32">
                      <span className="text-white font-bold">
                        D-{Math.floor(daysLeft)}
                      </span>
                    </div>
                  )}
                </div>
              )}
              <span className="absolute text-white top-2 right-3">
                <span className="font-bold">{reward}</span> KAIA
              </span>
            </div>

            {/* Room for image */}
            <div className="h-64 bg-violet-800 rounded-t-lg mt-11">
              <img
                className="h-full w-full object-cover rounded-t-lg"
                src="https://cyqrsixkgnoiflgq.public.blob.vercel-storage.com/IMG_9055-GNxneDxjn0bwyou8SDKDhRHJD0xoJg.png"
              />
            </div>
            {/* Room for image */}

            <div className="px-5 pt-2">
              <h1 className="text-xl font-bold text-violet-800 mt-1">
                {title.length > 20 ? title.substring(0, 20) + "..." : title}
              </h1>
              <p className="text-white mt-1 break-words">
                {desc.length > 65 ? desc.substring(0, 65) + "..." : desc}
              </p>
            </div>
            <div className="flex justify-start items-center my-4 px-5">
              <div className="flex flex-col mr-8">
                <span className="text-white">Remains</span>
                <span className="text-white font-bold">{remaining}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white">Respondents</span>
                <span className="text-white font-bold">{respondents}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
