"use client";

import Image from "next/image";
import "animate.css";
import { MainForm } from "@components/mainForm";

export default function Home() {
  return (
    <div
      className="h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#1B3C71" }}
    >
      {/* 메인 컨텐츠 */}
      <main className="flex flex-col items-center w-full max-w-md px-4 overflow-y-auto" style={{ maxHeight: "100vh" }}>
        {/* 이미지 */}
        <div className="w-full">
          <Image
            src="/mainQR.jpg"
            alt="2024 Minitab Exchange"
            width={500}
            height={300}
            className="rounded-lg shadow-lg w-full h-auto"
          />
        </div>

        {/* 폼 컨테이너 */}
        <div className="bg-white w-full rounded-lg mt-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 이미지 높이 - 여백)" }}>
          {/* Main form component */}
          <MainForm />
        </div>
      </main>
    </div>
  );
}
