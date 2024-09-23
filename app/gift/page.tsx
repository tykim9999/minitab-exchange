"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import "animate.css";
import { Fireworks } from "@fireworks-js/react";
import type { FireworksHandlers } from "@fireworks-js/react";
import { ContextMenu, ContextMenuTrigger } from "@components/ui/context-menu";

export const dynamic = "force-dynamic";

export default function GiftPage() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [isFireworksVisible, setIsFireworksVisible] = useState(true);
  const [isCelebrationFireworks, setIsCelebrationFireworks] = useState(false);
  const [loading, setLoading] = useState(true);
  const fireworksRef = useRef<FireworksHandlers>(null);
  const [winnerStatus, setWinnerStatus] = useState<string>("X");
  const [winnerName, setWinnerName] = useState<string | null>();
  const [bookId, setBookId] = useState<number | null>(null);

  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener("resize", setViewportHeight);

    return () => {
      window.removeEventListener("resize", setViewportHeight);
    };
  }, []);

  useEffect(() => {
    // 세션 스토리지에서 값 가져오기
    const userIdFromSession = sessionStorage.getItem("userId");
    const status = sessionStorage.getItem("winnerStatus") || "X";
    const bookIdFromSession = sessionStorage.getItem("bookId");

    setWinnerStatus(status);
    setBookId(bookIdFromSession ? parseInt(bookIdFromSession) : null);

    console.log("User ID:", userIdFromSession);
    console.log("Winner Status:", status);
    console.log("Book ID from Session:", bookIdFromSession);

    // 불꽃놀이 설정
    setIsFireworksVisible(true);
    setTimeout(() => {
      setIsFireworksVisible(false);
    }, 3000);

    if (userIdFromSession) {
      fetch("/api/getUserName", {
        method: "GET",
        headers: {
          "user-id": userIdFromSession,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.name) {
            setWinnerName(data.name);
          }
        })
        .catch((error) => {
          console.error("Error fetching user name:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    if (status === "O") {
      setIsImageVisible(true);
      setIsPopupVisible(true);
      setIsCelebrationFireworks(true);
      setTimeout(() => {
        setIsCelebrationFireworks(false);
      }, 3000);
    }
  }, []);

  if (loading) {
    return null; // 로딩 중일 때 아무것도 표시하지 않음
  }

  return (
    <div
      className="flex flex-col items-center justify-between overflow-hidden animate-gradient"
      style={{
        backgroundSize: "400% 400%",
        backgroundImage:
          "linear-gradient(288deg, rgba(26,46,91,100) 38%, rgba(60,132,206,1) 78%, rgba(3,180, 237,100) 88%, rgba(255,255,255,51) 99%)",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <div className="absolute inset-0 z-0 opacity-10 gradient overflow-hidden">
        <Image
          src="/svg/circuit.svg"
          layout="fill"
          objectFit="cover"
          alt="Circuit Background"
          className="svg"
        />
      </div>
      <main
        className="flex flex-col items-center w-full max-w-md px-2 relative space-y-4"
        style={{ width: "100%" }}
      >
        {/* 메인 배너 이미지 */}
        <div className="flex justify-center items-center w-full">
          <Image
            src="/mainBanner.jpg"
            alt="2024 Minitab Exchange"
            width={500}
            height={300}
            className="rounded-lg shadow-lg w-full h-auto"
            style={{ maxHeight: "30vh", objectFit: "cover" }}
          />
        </div>

        <ContextMenu>
          <div className="flex flex-col items-center space-y-2">
            <ContextMenuTrigger>
              {/* 스타벅스 이미지: 당첨자에게만 표시 */}
              {isImageVisible && winnerStatus === "O" ? (
                <div className="relative flex flex-col items-center">
                  <div className="absolute -top-6 text-2xl">👑</div>
                  <Image
                    src="/starbucksCard.jpg"
                    alt="스타벅스 기프티콘 이미지"
                    width={100}
                    height={50}
                    className="object-contain rounded-lg" 
                  />
                </div>
              ) : null}

              {/* 책 이미지 */}
              <div className="flex items-center justify-center">
                {bookId === 1 ? (
                  <Image
                    src="/bookA.png"
                    alt="Book A"
                    width={210}
                    height={297}
                    className="w-full h-auto"
                    style={{ maxHeight: "40vh", objectFit: "contain" }}
                  />
                ) : bookId === 2 ? (
                  <Image
                    src="/bookB.jpg"
                    alt="Book B"
                    width={210}
                    height={297}
                    className="w-full h-auto"
                    style={{ maxHeight: "40vh", objectFit: "contain" }}
                  />
                ) : (
                  <p className="text-white">데이터가 없습니다</p>
                )}
              </div>
            </ContextMenuTrigger>

            {/* 책 제목 및 저자 */}
            <div className="text-lg text-center font-bold">
              {bookId === 1
                ? "실무 사례가 있는 고질적인 품질문제 해결 방법"
                : bookId === 2
                ? "Minitab 공정데이터 분석방법론"
                : "도서 정보 없음"}
              <p className="text-sm text-right mt-1">
                {bookId === 1
                  ? "by 신용균, 이은지"
                  : bookId === 2
                  ? "by 김영일"
                  : "정보 없음"}
              </p>
            </div>

            {/* 빨간색 영역 */}
            <div
              className="w-full bg-red-600 text-white flex items-center justify-center rounded-lg px-4 py-2 text-sm font-bold"
              style={{
                animationDelay: "1.1s",
                animationDuration: "2.0s",
              }}
            >
              본 화면을 이벤트 담당자에게 보여주세요!
            </div>
          </div>
        </ContextMenu>


        {/* 기본 불꽃놀이 */}
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
              className="bg-white p-4 rounded-2xl shadow-2xl text-center w-10/12 max-w-sm space-y-4"
              style={{
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                // maxHeight: "90vh",
                overflowY: "auto"
              }}
            >
              {/* 축하 메시지 */}
              <h2 className="text-2xl font-black text-gray-800">
                {winnerName + "님"}
              </h2>
              <h3 className="text-sm font-bold text-black">
              {winnerName + "님"}, 스타벅스 기프티콘 5만원권에 <br />
                당첨 되셨습니다!
              </h3>


              {/* 이미지 컨테이너 */}
              <div className="bg-gray-200 rounded-lg overflow-hidden">
                <Image
                  src="/starbucksCard.jpg"
                  alt="스타벅스 기프티콘 이미지"
                  width={250}
                  height={150}
                  className="object-contain w-full h-full"
                  
                />
              </div>
              <div className="h-5"></div> {/* 빈 공간 추가 */}

              {/* 닫기 버튼 */}
              <button
                className="bg-black text-white font-semibold rounded-2xl shadow-2xl hover:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-5/6 py-2"
                onClick={() => setIsPopupVisible(false)}
              >
                확인
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}