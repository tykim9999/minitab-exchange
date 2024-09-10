"use client";

import Image from "next/image";
import "animate.css";
import { MainForm } from "@/components/mainForm";
import { useRef, useState } from "react";
import { Fireworks } from "@fireworks-js/react";
import type { FireworksHandlers } from "@fireworks-js/react";

// Main component for the home page
export default function Home() {
  // Ref for fireworks component
  const fireworksRef = useRef<FireworksHandlers>(null);

  // State to control fireworks display
  const [isFireworksVisible, setIsFireworksVisible] = useState(false);

  // Function to update fireworks visibility
  const updateFireworksVisibility = (value: boolean) => {
    setIsFireworksVisible(value);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center">
      {/* Fireworks container */}
      <div className="z-0">
        {isFireworksVisible && (
          <Fireworks
            ref={fireworksRef}
            options={{ opacity: 0.5 }}
            style={{
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              position: "fixed",
              background: "#000",
            }}
          />
        )}
      </div>

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
        <MainForm updateFireworks={updateFireworksVisibility} />

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
