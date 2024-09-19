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
  const [isFireworksVisible, setIsFireworksVisible] = useState(true); // 기본 불꽃놀이
  const [isCelebrationFireworks, setIsCelebrationFireworks] = useState(false); // 추가 불꽃놀이
  const fireworksRef = useRef<FireworksHandlers>(null);
  const [winnerStatus, setWinnerStatus] = useState<string>("X"); // 기본값은 'X'
  const [winnerName, setWinnerName] = useState<string>("당첨자"); // 기본값은 '당첨자'
  const [bookId, setBookId] = useState<number | null>(null);

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
      // 헤더에 userId를 포함하여 GET 요청
      fetch("/api/getUserName", {
        method: "GET",
        headers: {
          "user-id": userIdFromSession, // 헤더에 userId를 추가
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

    // 만약 winnerStatus가 'O'라면 팝업과 추가 불꽃놀이 실행
    if (status === "O") {
      setIsImageVisible(true);
      setIsPopupVisible(true);
      setIsCelebrationFireworks(true);
      setTimeout(() => {
        setIsCelebrationFireworks(false); // 3초 후 추가 불꽃놀이 종료
      }, 3000);
    }
  }, []); // 빈 배열을 의존성으로 설정하여 컴포넌트 마운트 시에만 실행
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
              {/* 스타벅스 이미지: 당첨자에게만 표시 */}
              {isImageVisible && winnerStatus === "O" ? (
                <div className="relative flex flex-col items-center">
                  {/* 왕관 이모티콘 */}
                  <div className="absolute top-[-35px] text-4xl">👑</div>
                  {/* 스타벅스 이미지 */}
                  <Image
                    src="/starbucks.png"
                    alt="스타벅스 기프티콘 이미지"
                    layout="intrinsic"
                    width={100}
                    height={50}
                    objectFit="contain"
                  />
                </div>
              ) : (
                <div className="hidden" /> // 이미지가 없는 경우 숨기기
              )}

              <div className="flex items-center justify-center">
                {bookId === 1 ? (
                  <Image
                    src="/bookA.png"
                    alt="Book A"
                    width={210}
                    height={297}
                    className="flex items-center justify-center"
                  />
                ) : bookId === 2 ? (
                  <Image
                    src="/bookB.jpg"
                    alt="Book B"
                    width={210}
                    height={297}
                    className="flex items-center justify-center"
                  />
                ) : (
                  <p>데이터가 없습니다</p>
                )}
              </div>
            </ContextMenuTrigger>

            <div className="text-1xl text-right font-bold animate__animated animate__slideInDown mt-4">
              {bookId === 1
                ? "실무 사례가 있는 고질적인 품질문제 해결 방법"
                : bookId === 2
                ? "Minitab 공정데이터 분석방법론"
                : "도서 정보 없음"}
              <p className="text-sm text-right mt-2">
                {bookId === 1
                  ? "by 신용균, 이은지"
                  : bookId === 2
                  ? "by 김영일"
                  : "정보 없음"}
              </p>
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
                width: "80vw",
                height: "auto",
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
              <h2 className="text-3xl font-extrabold mb-2 text-gray-800">
                🎉 {winnerName}님 🎉
              </h2>
              <h3
                className="text-1xl font-extrabold text-black"
                style={{
                  marginTop: "15px",
                }}
              >
                스타벅스 기프티콘 5만원권에 <br />
                <span className="text-1xl font-extrabold text-black">
                  당첨 되셨습니다!
                </span>
              </h3>

              {/* 이미지 컨테이너 */}
              <div
                className="relative bg-gray-200 mb-6 rounded-lg overflow-hidden"
                style={{
                  width: "250px",
                  height: "160px",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
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
                className="bg-black text-white font-semibold rounded-full shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                onClick={() => setIsPopupVisible(false)}
                style={{
                  fontSize: "1rem", // 폰트 크기를 작게 조정
                  lineHeight: "1.25rem",
                  width: "250px", // 이미지의 가로 길이와 일치시키기
                  padding: "0.75rem", // 패딩 조정
                  textAlign: "center", // 텍스트 중앙 정렬
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
