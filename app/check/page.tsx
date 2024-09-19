"use client";

import Image from "next/image";
import "animate.css";
import { CheckForm } from "@components/checkForm";

// Main component for the home page
export default function Home() {
  return (
    <div
      className="relative flex flex-col items-center justify-center overflow-hidden animate-gradient"
      style={{
        backgroundSize: "400% 400%",
        backgroundImage:
          "linear-gradient(288deg, rgba(26,46,91,100) 38%, rgba(60,132,206,1) 78%, rgba(3,180, 237,100) 88%, rgba(255,255,255,51) 99%)",
        height: "calc(var(--vh, 1vh) * 100)",
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-10">
        <Image
          src="/svg/circuit.svg"
          layout="fill"
          objectFit="cover"
          alt="Circuit Background"
          className="svg"
        />
      </div>

      {/* Main content */} 
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

        <div style={{backgroundColor: `white`, width:`350px`, height:`350px`, 
                    borderRadius:`15px`}}>
          <h1 style={{color:`black`, fontWeight:`bold`, 
            fontSize:`25px`, textAlign:`center`, marginTop:`10px`}}>
              당첨여부 확인하기
          </h1> 
          {/* Main form component */}
          <CheckForm />
        </div>
      </main>
    </div>
  );
}
