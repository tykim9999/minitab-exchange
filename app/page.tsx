"use client";

import Image from "next/image";
import "animate.css";
import { useEffect } from "react";
import { MainForm } from "@components/mainForm";

export default function Home() {
  // 뷰포트 높이를 계산하여 CSS 변수로 설정
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    // 초기 실행
    setViewportHeight();

    // 화면 크기 변경 시 뷰포트 높이 재계산
    window.addEventListener("resize", setViewportHeight);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", setViewportHeight);
    };
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "#1B3C71",
        height: "calc(var(--vh, 1vh) * 100)",
      }}
    >
      {/* 메인 컨텐츠 */}
      <main
        className="flex flex-col items-center w-full max-w-md px-4"
        style={{ height: "100%" }}
      >
        {/* 이미지 */}
        <div
          className="w-full relative"
          style={{ maxHeight: "30vh" }}
        >
          <Image
            src="/mainBanner.jpg"
            alt="2024 Minitab Exchange"
            width={500}
            height={300}
            className="rounded-lg shadow-lg w-full h-auto"
            style={{ maxHeight: "30vh" }}
          />

        </div>

        {/* 폼 컨테이너 */}
        <div
          className="bg-white w-full rounded-lg mt-4 overflow-y-auto"
          style={{
            maxHeight: "calc(70vh - 1rem)", // 필요하다면 이 부분도 조정
          }}
        >
          {/* Main form component */}
          <MainForm />
        </div>

      </main>
    </div>
  );
}
