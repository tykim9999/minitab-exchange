"use client";

import Image from "next/image";
import "animate.css";
import { MainForm } from "@/components/mainForm";

// Main component for the home page
export default function Home() {
  

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center">

      {/* Main content */}
      <main className="flex flex-col gap-8 row-start-2 items-center z-10 overflow-x-hidden">
        {/* Title */}
        <h1 className="text-1xl font-bold animate__animated animate__slideInDown">
          2024 Minitab Exchange
        </h1>

        {/* Subtitle */}
        <h2 className="text-3xl font-light animate__animated animate__slideInRight">
          QR코드 속 책을 찾아라!
        </h2>
        <h2 className="text-3xl font-light animate__animated animate__slideInRight">
        그리고 추가 깜짝 이벤트까지!
        </h2>

        {/* Main form component */}
        <MainForm/>

        {/* Main image */}
        <Image
          className="dark:invert"
          src="/main.jpg"
          alt="Next.js logo"
          width={430}
          height={932}
          priority
        />
      </main>
    </div>
  );
}
