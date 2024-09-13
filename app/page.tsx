"use client";

import Image from "next/image";
import "animate.css";
import { MainForm } from "@/components/mainForm";

// Main component for the home page
export default function Home() {
  return (
      <div className="min-h-screen grid grid-rows-[auto_1fr_auto] items-start justify-items-center" style={{ backgroundColor: '#1B3C71' }}>
        {/* Main content */}  {/* Main content */}
      <main className="flex flex-col gap-8 row-start-2 items-center z-10 overflow-x-hidden">
        <div className="flex justify-center items-center animate__animated animate__slideInDown">
          <Image
            src="/mainQR.jpg" // 이미지 경로
            alt="2024 Minitab Exchange"
            width={500} // 원하는 가로 크기 (px 단위로 조정 가능)
            height={300} // 원하는 세로 크기 (px 단위로 조정 가능)
            className="rounded-lg shadow-lg" // 이미지에 테두리나 그림자 추가 가능
          />
        </div>

        <div style={{backgroundColor: `white`, width:`350px`, height:`500px`, borderRadius:`15px`}}>
        {/* Main form component */}
        <MainForm />
        </div>
      </main>
    </div>
  );
}
