"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import "animate.css";
import { Fireworks } from "@fireworks-js/react";
import type { FireworksHandlers } from "@fireworks-js/react";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";

export const dynamic = "force-dynamic";

export default function GiftPage() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isFireworksVisible, setIsFireworksVisible] = useState(true); // 기본 불꽃놀이
  const [isCelebrationFireworks, setIsCelebrationFireworks] = useState(false); // 추가 불꽃놀이
  const fireworksRef = useRef<FireworksHandlers>(null);

  const [winnerStatus, setWinnerStatus] = useState<string>("X"); // 기본값은 'X'
  const [winnerName, setWinnerName] = useState<string>("당첨자"); // 기본값은 '당첨자'

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const status = searchParams.get("winner_status") || "X";
    const userId = searchParams.get("userId"); // URL에서 user_id 가져오기
    setWinnerStatus(status);

    // 불꽃놀이 설정
    setIsFireworksVisible(true);
    setTimeout(() => {
      setIsFireworksVisible(false); // 3초 후 기본 불꽃놀이 종료
    }, 3000);

    // user_id로 API 호출해서 이름 가져오기
    if (userId) {
      fetch(`/api/getUserName?user_id=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.name) {
            setWinnerName(data.name); // API에서 가져온 이름 설정
          }
        })
        .catch((error) => {
          console.error("Error fetching user name:", error);
        });
    }

    // 만약 winnerStatus가 'O'라면 팝업과 추가 불꽃놀이 실행
    if (status === "O") {
      setIsPopupVisible(true);
      setIsCelebrationFireworks(true);
      setTimeout(() => {
        setIsCelebrationFireworks(false); // 3초 후 추가 불꽃놀이 종료
      }, 3000);
    }
  }, []); // 초기 렌더링 시만 실행

  return (
    <div
      className="min-h-screen grid grid-rows-[auto_1fr_auto] items-start justify-items-center"
      style={{ backgroundColor: "#1B3C71" }}
    >
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
        <ContextMenu>
          <div className="gap-4">
            <ContextMenuTrigger>
              <div className="flex items-center justify-center overflow-hidden rounded-md">
                <Image
                  src="/bookB.jpg"
                  alt="gift"
                  width={210}
                  height={297}
                  className="flex items-center justify-center"
                />
              </div>
            </ContextMenuTrigger>
            <div className="text-1xl text-right font-bold animate__animated animate__slideInDown">
              Minitab  공정데이터 분석방법론
              <p className="text-sm text-right">by 김영일</p>
            </div>
          </div>
          <div
            className="mt-10 w-80 h-14 font-bold bg-red-600 text-white text-center flex items-center justify-center rounded-lg animate__animated animate__headShake"
            style={{ animationDelay: "1.1s", animationDuration: "2.0s" }}
          >
            본 화면을 이벤트 담당자에게 보여주세요!
          </div>
        </ContextMenu>

        {/* 초기 기본 불꽃놀이 */}
        {isFireworksVisible && (
          <Fireworks
            ref={fireworksRef}
            options={{ opacity: 0.5, explosion: 2 }}
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

        {/* 추가 불꽃놀이 (팝업이 뜰 때만 실행) */}
        {isCelebrationFireworks && (
          <Fireworks
            ref={fireworksRef}
            options={{
              opacity: 0.8,
              explosion: 5,
              intensity: 8,
            }}
            style={{
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              position: "fixed",
              zIndex: 51,
            }}
          />
        )}

        {/* 팝업 */}
        {isPopupVisible && winnerStatus === "O" && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div
              className="bg-white p-6 rounded-2xl shadow-2xl text-center"
              style={{
                width: "80vw", // 팝업의 적당한 크기 유지
                height: "auto", // 높이를 자동으로 설정하여 내용이 잘리지 않도록 함
                maxWidth: "450px",
                maxHeight: "550px",
              }}
            >
              {/* 축하 메시지 */}
              <h2 className="text-2xl font-extrabold mb-2 text-gray-800">
                🎉 {winnerName}님 🎉
              </h2>
              {/* <h2 className="text-2xl font-extrabold mb-2 text-gray-800">
                축하드립니다!
              </h2> */}
              <h3 className="text-lg font-semibold mb-6 text-gray-600">
                스타벅스 기프티콘 5만원권에 당첨되셨습니다!
              </h3>

              {/* 이미지 컨테이너 */}
              <div
                className="relative bg-gray-200 mb-6 rounded-lg overflow-hidden"
                style={{ width: "250px", height: "150px" }}
              >
                <Image
                  src="/starbucks.png"
                  alt="스타벅스 기프티콘 이미지"
                  layout="intrinsic"
                  width={250}
                  height={250}
                  objectFit="contain"
                />
              </div>

              {/* 닫기 버튼 */}
              <button
                className="bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:from-green-500 hover:to-green-700 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => setIsPopupVisible(false)}
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
