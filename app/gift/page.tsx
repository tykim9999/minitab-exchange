"use client";

import Image from "next/image";
import "animate.css";

import { useState } from "react";
import { BadgeCheck, Badge } from "lucide-react"
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";

// Main component for the home page
export default function Home() {
  const [isReceived, setIsReceived] = useState(false);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center">
      {/* Main content */}
      <main className="flex flex-col gap-8 row-start-2 items-center z-10 overflow-x-hidden">
        {/* Title */}
        <h1 className="text-3xl font-bold animate__animated animate__slideInDown">
          2024 Minitab Exchange
        </h1>
        {/* Subtitle */}
        <h2 className="text-2xl font-light animate__animated animate__slideInLeft">
          도서 증정 이벤트 당첨자 확인
        </h2>
        <ContextMenu>
          <div className="gap-4">
            <ContextMenuTrigger>
              <div className="flex items-center justify-center overflow-hidden rounded-md">
                <Image
                  src="/bookA.png"
                  alt="gift"
                  width={210*1.5}
                  height={297*1.5}
                  className="flex items-center justify-center"
                />
              </div>
            </ContextMenuTrigger>
            <div className="text-1xl text-right font-bold animate__animated animate__slideInDown">
              실무 사례가 있는 고질적인 품질문제 해결 방법
              <p className="text-sm text-right">by 신용균, 이은지</p>
            </div>
          </div>
          <Button
            className="mt-10 w-40 h-14 font-bold animate__animated animate__headShake"
            style={{ animationDelay: "1.1s", animationDuration: "2.0s" }}
            size="lg"
            variant={isReceived ? "secondary" : "destructive"}
            onClick={() => {
              setIsReceived(!isReceived);
            }}
          >
            {isReceived ? <BadgeCheck className="w-4 h-4 mr-2" /> : <Badge className="w-4 h-4 mr-2" />}
            {isReceived ? "수령완료" : "수령대기"}
          </Button>{" "}
        </ContextMenu>
      </main>
    </div>
  );
}
