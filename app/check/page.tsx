"use client";

import Image from "next/image";
import "animate.css";
import { useEffect } from "react";
import { CheckForm } from "@components/checkForm";

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
    <>
      <div
        className="flex flex-col items-center justify-center overflow-hidden animate-gradient"
        style={{
          backgroundSize: "400% 400%",
          backgroundImage:
            "linear-gradient(288deg, rgba(26,46,91,100) 38%, rgba(60,132,206,1) 78%, rgba(3,180, 237,100) 88%, rgba(255,255,255,51) 99%)",
          height: "calc(var(--vh, 1vh) * 100)",
        }}
      >
        {/* 메인 컨텐츠 */}
        <main
          className="flex flex-col items-center w-full max-w-md px-4"
          style={{ height: "100%" }}
        >
          {/* 이미지 */}
          <div className="w-full relative" style={{ maxHeight: "30vh", zIndex: 10 }}>
            <Image
              src="/mainQR.jpg"
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
              zIndex: 10,
            }}
          >
            <h1 style={{color:`black`, fontWeight:`bold`, 
            fontSize:`25px`, textAlign:`center`, marginTop:`10px`}}>
              당첨여부 확인하기
          </h1> 
            {/* Main form component */}
            <CheckForm />
          </div>
          <div className="absolute inset-0 z-0 opacity-10 gradient">
            <Image
              src="/svg/circuit.svg"
              layout="fill"
              objectFit="cover"
              alt="Circuit Background"
              className="svg"
            />
          </div>
        </main>
      </div>
    </>
  );
}



