import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "@styles/mainForm.css";

interface FormValues {
  members_name: string;
  members_phone_number: string;
  members_company?: string;
  members_message?: string;
}

export function MainForm() {
  const form = useForm<FormValues>();
  const [showPopup, setShowPopup] = useState(false); // 팝업창 표시 상태
  const [isSubmitted, setIsSubmitted] = useState(false); // 제출 후 인풋 숨기기
  const [isSubmitting, setIsSubmitting] = useState(false); // 로딩 상태 관리
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [formValues, setFormValues] = useState<FormValues | null>(null); // 폼 데이터를 저장할 상태

  // 컴포넌트가 마운트되었을 때 세션에서 userId와 winnerStatus 값을 가져옵니다.
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedWinnerStatus = sessionStorage.getItem("winnerStatus");
    const storedBookId = sessionStorage.getItem("bookId");

    // 콘솔에 출력
    console.log("User ID:", storedUserId);
    console.log("Winner Status:", storedWinnerStatus);
    console.log("Book ID :", storedBookId);
  }, []);

  // 폼 제출 처리
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true); // 제출 시작 시 로딩 활성화
    try {
      setFormValues(values); // 폼 데이터를 상태에 저장
      setIsSubmitted(true); // 폼을 숨기고 팝업을 표시
      setShowPopup(true);
    } finally {
      setIsSubmitting(false); // 제출이 끝나면 로딩 비활성화
    }
  };

  // 동의 여부 처리
  const handleConsent = async (consent: boolean) => {
    if (loading) return; // 로딩 중일 때는 아무 작업도 하지 않음
    setLoading(true); // 버튼 클릭 시 로딩 상태로 설정

    if (!consent) {
      // "아니요" 선택 시 페이지 리로드
      window.location.reload(); // 첫 화면으로 리다이렉트
    } else {
      // "예" 선택 시 폼 데이터를 서버로 전송하여 저장
      try {
        const response = await fetch("/api/members/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formValues,
            privacy_consent: "O", // 개인정보 동의 여부 추가
          }),
        });

        if (response.ok) {
          const result = await response.json();
          sessionStorage.setItem("userId", result.userId || ""); // 사용자 ID를 문자열로 저장
          sessionStorage.setItem("winnerStatus", result.winner_status || ""); // 당첨 상태를 문자열로 저장
          sessionStorage.setItem("bookId", result.members_book_id || ""); // 당첨 상태를 문자열로 저장
          setShowPopup(false); // 팝업창 닫기
          window.location.href = "/gift";
        } else {
          const result = await response.json();
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error("Error saving data:", error);
        alert("회원 정보 저장에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }
  };

  // 팝업창 컴포넌트
  const Popup = () => (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="agree" style={{ maxWidth: "300px", width: "100%" }}>
          <p className="consent-title">※ 개인정보 처리에 관한 동의 여부</p>
          <p className="agree-text">
            귀하는 (주)이레테크 데이터랩스에서 수집한 귀하의 개인정보 활용 업무
            처리에 동의합니다. 이벤트 진행 및 당첨자 선정, 마케팅 자료 활용 목적
            외에 다른 목적으로 사용하지 않습니다. 귀하는 개인정보의 수집 및
            이용에 대한 동의를 거부할 수 있으며,
            <span style={{ fontWeight: "bolder" }}>
              {" "}동의를 거부할 경우 이벤트 참여 및 경품 수령이 제한될 수 있습니다.
            </span>
          </p>
        </div>

        <div className="popup-buttons ">
          <button
            onClick={() => handleConsent(true)}
            className="button button-yes"
            disabled={loading}
          >
            {loading ? "처리 중..." : "예"}
          </button>
          <button
            onClick={() => handleConsent(false)}
            className="button button-no"
            disabled={loading}
          >
            {loading ? "처리 중..." : "아니오"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* 제출 후 폼을 숨기고 팝업창을 표시 */}
      {!isSubmitted ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="input-submit">
            <p className="members">이름</p>
            <div className="input-container">
              <label htmlFor="members_name" className="text-right"></label>
              <input
                id="members_name"
                {...form.register("members_name")}
                className="input"
                placeholder="이름을 입력해주세요"
                maxLength={10}
                required
              />
            </div>

            <p className="members">전화번호</p>
            <div className="input-container">
              <label htmlFor="members_phone_number" className="text-right"></label>
              <input
                id="members_phone_number"
                {...form.register("members_phone_number")}
                className="input"
                placeholder="01012345678"
                type="tel"
                maxLength={11}
                pattern="\d{11}"
                required
              />
            </div>

            <p className="members">회사명</p>
            <div className="input-container">
              <label htmlFor="members_company" className="text-right"></label>
              <input
                id="members_company"
                {...form.register("members_company")}
                className="input"
                placeholder="회사명을 입력해주세요"
                maxLength={20}
                required
              />
            </div>

            <p className="members">응원메세지</p>
            <div className="input-container">
              <label htmlFor="members_message" className="text-right"></label>
              <textarea
                id="members_message"
                {...form.register("members_message")}
                className="text"
                placeholder="300자 이내로 작성해주세요!"
                maxLength={300}
                rows={5}
                required
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="submitButton flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Spinner />
                  <span className="ml-2">제출 중...</span>
                </div>
              ) : (
                "다음"
              )}
            </button>
          </div>
        </form>
      ) : null}

      {/* 팝업창이 표시될 때 */}
      {showPopup && <Popup />}
    </div>
  );
}

// 로딩 스피너 컴포넌트
function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      ></path>
    </svg>
  );
}
