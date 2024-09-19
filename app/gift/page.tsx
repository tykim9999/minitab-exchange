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
  const fireworksRef = useRef<FireworksHandlers>(null);
  const [winnerStatus, setWinnerStatus] = useState<string>("X");
  const [winnerName, setWinnerName] = useState<string>("당첨자");
  const [bookId, setBookId] = useState<number | null>(null);

  useEffect(() => {
    // 뷰포트 높이 계산 및 CSS 변수 설정
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

    // 콘솔에 출력
    console.log("User ID:", userIdFromSession);
    console.log("Winner Status:", status);
    console.log("Book ID from Session:", bookIdFromSession);

    // 불꽃놀이 설정
    setIsFireworksVisible(true);
    setTimeout(() => {
      setIsFireworksVisible(false); // 3초 후 기본 불꽃놀이 종료
    }, 3000);

    // user_id로 API 호출해서 이름 가져오기
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
        });
    }

    // 당첨자 처리
    if (status === "O") {
      setIsImageVisible(true);
      setIsPopupVisible(true);
      setIsCelebrationFireworks(true);
      setTimeout(() => {
        setIsCelebrationFireworks(false); // 3초 후 추가 불꽃놀이 종료
      }, 3000);
    }
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: "#1B3C71",
        height: "calc(var(--vh, 1vh) * 100)",
      }}
    >
      {/* Main content */}
      <main
        className="flex flex-col items-center w-full max-w-md px-4 relative"
        style={{ height: "100%" }}
      >
        {/* 이미지 */}
        <div className="flex justify-center items-center w-full">
          <Image
            src="/mainQR.jpg"
            alt="2024 Minitab Exchange"
            width={500}
            height={300}
            className="rounded-lg shadow-lg w-full h-auto"
            style={{ maxHeight: "30vh" }}
          />
        </div>

        <ContextMenu>
          <div className="gap-2 flex flex-col items-center mt-2">
            <ContextMenuTrigger>
              {/* 스타벅스 이미지: 당첨자에게만 표시 */}
              {isImageVisible && winnerStatus === "O" ? (
                <div className="relative flex flex-col items-center">
                  {/* 왕관 이모티콘 */}
                  <div className="absolute top-[-25px] text-2xl">👑</div>
                  {/* 스타벅스 이미지 */}
                  <Image
                    src="/starbucks.png"
                    alt="스타벅스 기프티콘 이미지"
                    width={100}
                    height={50}
                    className="object-contain"
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
                    className="w-auto h-auto"
                    style={{ maxHeight: "40vh", minHeight :"30vh" }}
                  />
                ) : bookId === 2 ? (
                  <Image
                    src="/bookB.jpg"
                    alt="Book B"
                    width={210}
                    height={297}
                    className="w-auto h-auto"
                    style={{ maxHeight: "40vh" }}
                  />
                ) : (
                  <p>데이터가 없습니다</p>
                )}
              </div>
            </ContextMenuTrigger>

            {/* 책 제목 및 저자 */}
            <div className="text-lg text-center font-bold mt-2">
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

            {/* 안내 메시지 */}
            <div
              className="w-full max-w-xs h-12 font-bold bg-red-600 text-white flex items-center justify-center rounded-lg mt-2"
              style={{
                animationDelay: "1.1s",
                animationDuration: "2.0s",
                borderRadius: "10px",
                paddingLeft:"10px",
                paddingRight:"10px"
              }}
            >
              본 화면을 이벤트 담당자에게 보여주세요!
            </div>
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
                width: "80vw",
                maxWidth: "450px",
                maxHeight: "550px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              {/* 축하 메시지 */}
              <h2 className="text-2xl font-extrabold mb-2 text-gray-800">
                 {winnerName}님 
              </h2>
              <h3 className="text-lg font-extrabold text-black mt-2">
                스타벅스 기프티콘 5만원권에 <br />
                당첨 되셨습니다!
              </h3>

              {/* 이미지 컨테이너 */}
              <div
                className="relative bg-gray-200 mb-4 rounded-lg overflow-hidden mt-4"
                style={{
                  width: "250px",
                  height: "160px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Image
                  src="/starbucks.png"
                  alt="스타벅스 기프티콘 이미지"
                  width={250}
                  height={250}
                  className="object-contain"
                />
              </div>

              {/* 닫기 버튼 */}
              <button
                className="bg-black text-white font-semibold rounded-full shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => setIsPopupVisible(false)}
                style={{
                  fontSize: "1rem",
                  lineHeight: "1.25rem",
                  width: "250px",
                  padding: "0.75rem",
                  textAlign: "center",
                  borderRadius: "10px",
                }}
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
