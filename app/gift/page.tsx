"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import "animate.css";
import { Fireworks } from "@fireworks-js/react";
import type { FireworksHandlers } from "@fireworks-js/react";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";


export default function Home() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isFireworksVisible, setIsFireworksVisible] = useState(true);
  const [isCelebrationFireworks, setIsCelebrationFireworks] = useState(false);
  const fireworksRef = useRef<FireworksHandlers>(null);

  // 페이지 로드 후 가벼운 불꽃놀이 시작
  useEffect(() => {
    // 2초 후 팝업 및 초기 불꽃놀이 실행
    const timer = setTimeout(() => {
      setIsPopupVisible(true); // 팝업창 띄움
      setIsFireworksVisible(true); // 불꽃놀이 시작

      // 초기 불꽃놀이 5초 후 종료
      setTimeout(() => {
        setIsFireworksVisible(false);
      }, 5000);
    }, 2000); // 2초 후 팝업 및 불꽃놀이 시작

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 제거
  }, []);

  // 팝업이 열렸을 때 축하 불꽃놀이 시작
  useEffect(() => {
    if (isPopupVisible) {
      setIsCelebrationFireworks(true); // 기프티콘 등장 시 불꽃놀이
      // 축하 불꽃놀이 5초 후 종료
      setTimeout(() => {
        setIsCelebrationFireworks(false);
      }, 5000);
    }
  }, [isPopupVisible]);

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
          여러분이 발견한 책은?
        </h2>
        <ContextMenu>
          <div className="gap-4">
            <ContextMenuTrigger>
              <div className="flex items-center justify-center overflow-hidden rounded-md">
                <Image
                  src="/bookA.png"
                  alt="gift"
                  width={210 * 1.5}
                  height={297 * 1.5}
                  className="flex items-center justify-center"
                />
              </div>
            </ContextMenuTrigger>
            <div className="text-1xl text-right font-bold animate__animated animate__slideInDown">
              실무 사례가 있는 고질적인 품질문제 해결 방법
              <p className="text-sm text-right">by 신용균, 이은지</p>
            </div>
          </div>
          <div
            className="mt-10 w-80 h-14 font-bold bg-red-600 text-white text-center flex items-center justify-center rounded-lg animate__animated animate__headShake"
            style={{ animationDelay: "1.1s", animationDuration: "2.0s" }}
          >
            본 화면을 이벤트 담당자에게 보여주세요!
          </div>
        </ContextMenu>
      </main>

      {/* 초기 불꽃놀이 */}
      {isFireworksVisible && (
        <Fireworks
          ref={fireworksRef}
          options={{ opacity: 0.5, explosion: 3 }}
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            position: "fixed",
            zIndex: 50,
          }}
        />
      )}

      {/* 축하 불꽃놀이 (팝업이 뜰 때) */}
      {isCelebrationFireworks && (
        <Fireworks
          ref={fireworksRef}
          options={{
            opacity: 0.7,
            explosion: 500, // 더 많은 불꽃
            intensity: 1000, // 강도 높이기
          }}
          style={{
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            position: "fixed",
            zIndex: 50,
          }}
        />
      )}

      {/* 팝업창 */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-200 p-10 rounded-lg text-center shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-black">
              축하 드립니다!
            </h2>
            <h2 className="text-xl font-bold mb-4 text-black">
              스타벅스 기프티콘 5만원권에 당첨되셨습니다!
            </h2>
            <div className="bg-white-500 p-4 mb-4 rounded flex items-center justify-center">
              <img
                src="/starbucks.png"
                alt="스타벅스 기프티콘 이미지"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
              onClick={() => setIsPopupVisible(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
