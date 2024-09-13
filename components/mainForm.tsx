import { useState } from "react";
import { useForm } from "react-hook-form";
import "./mainForm.css";

interface FormValues {
  members_name: string;
  members_phone_number: string;
  members_company?: string;
  members_message?: string;
}

export function MainForm() {
  const form = useForm<FormValues>();
  const [showPopup, setShowPopup] = useState(false); // 팝업창 표시 상태
  const [userId, setUserId] = useState<string | null>(null); // DB에 저장된 사용자의 ID를 추적
  const [winnerStatus, setWinnerStatus] = useState<string | null>(null); // DB에 저장된 사용자의 ID를 추적
  const [isSubmitted, setIsSubmitted] = useState(false); // 제출 후 인풋 숨기기
  const [isSubmitting, setIsSubmitting] = useState(false); // 로딩 상태 관리
  const [loading, setLoading] = useState(false); // 로딩 상태 관리

  // 폼 제출 처리
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true); // 제출 시작 시 로딩 활성화
    try {
      const response = await fetch("/api/members/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const result = await response.json();
        setUserId(result.userId); // 새로 생성된 사용자의 ID 저장
        setWinnerStatus(result.winner_status);
        setIsSubmitted(true); // 폼을 숨기고 팝업을 표시
        setShowPopup(true);
      } else {
        const result = await response.json();
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("회원 정보 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false); // 제출이 끝나면 로딩 비활성화
    }
  };

  // 동의 여부 처리
  const handleConsent = async (consent: boolean) => {
    if (loading) return; // 로딩 중일 때는 아무 작업도 하지 않음
    setLoading(true); // 버튼 클릭 시 로딩 상태로 설정
    const consentValue = consent ? "O" : "X"; // 'O' for 동의, 'X' for 비동의
    console.log("Sending userId:", userId, "and consent value:", consentValue); // 전송 전에 로그 출력

    if (!consent) {
      // "아니요" 선택 시 해당 회원 데이터를 삭제
      try {
        const response = await fetch("/api/deleteMembers/", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }), // userId를 body에 포함
        });

        if (response.ok) {
          // alert("회원 정보가 삭제되었습니다.");
          window.location.reload(); // 첫 화면으로 리다이렉트
        } else {
          // alert("회원 정보 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("Error deleting member data:", error);
        alert("회원 정보 삭제 중 오류가 발생했습니다.");
      }
    } else {
      // "예" 선택 시 개인정보 제공 동의 여부 업데이트
      const consentValue = "O";

      try {
        const response = await fetch("/api/privacyAgree/", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, privacy_consent: consentValue }),
        });

        if (response.ok) {
          const result = await response.json();
          const membersBookId = result.members_book_id; // 서버로부터 members_book_id를 받아옴
          console.log(membersBookId);
          // alert("개인정보 제공 동의 여부가 저장되었습니다.");
          setShowPopup(false); // 팝업창 닫기
          // members_book_id에 따라 페이지 리다이렉트
          if (membersBookId === 1) {
            // window.location.href = "/gift";
            // 책 페이지로 이동하면서 쿼리 파라미터로 값 전달
            window.location.href = `/gift?userId=${userId}&winner_status=${winnerStatus}`;
          } else if (membersBookId === 2) {
            // window.location.href = "/gift2";
            window.location.href = `/gift2?userId=${userId}&winner_status=${winnerStatus}`;
          }
        } else {
          const result = await response.json();
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error("Error updating consent:", error);
        alert("개인정보 제공 동의 여부 저장에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }
  };

  // 팝업창 컴포넌트
  const Popup = () => (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="agree" style={{ maxWidth: "325px", width: "100%" }}>
          <p>※ 개인정보 처리에 관한 동의 여부</p>
          <br />
          <p style={{ maxWidth: "250px", width: "100%" }}>
            귀하는 (주)이레테크 데이터랩스에서 수집한 귀하의 개인정보 활용 업무
            처리에 동의합니다. 이벤트 경품 발송, 마케팅 자료 활용 목적 외에 다른
            목적으로 사용하지 않습니다. 귀하는 위 개인정보의 수집 및 이용에 대한
            동의를 거부할 수 있으며, 동의를 거부할 경우 이벤트 참여에 대한
            혜택은 제공되지 않습니다.
          </p>
        </div>

        <div className="popup-buttons flex justify-center gap-4 mt-4">
          <button
            onClick={() => handleConsent(true)}
            className={`bg-gradient-to-r from-teal-300 to-teal-500 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg hover:from-teal-400 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "처리 중..." : "예"}
          </button>
          <button
            onClick={() => handleConsent(false)}
            className={`bg-gradient-to-r from-rose-300 to-rose-500 text-white font-semibold py-3 px-6 rounded-full shadow-md hover:shadow-lg hover:from-rose-400 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
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
          <div>
            <p>이름</p>
            <div style={{ marginLeft: `40px` }}>
              <label htmlFor="members_name" className="text-right"></label>
              <input
                id="members_name"
                {...form.register("members_name")}
                className="input"
                placeholder="이름을 입력해주세요"
                maxLength={10}
                onInvalid={(e) => {
                  (e.target as HTMLInputElement).setCustomValidity(
                    "이름을 작성해주세요."
                  );
                }}
                onInput={(e) => {
                  (e.target as HTMLInputElement).setCustomValidity(""); // Clear the warning while typing
                }}
                required
              />
            </div>

            <p>전화번호</p>
            <div style={{ marginLeft: `40px` }}>
              <label
                htmlFor="members_phone_number"
                className="text-right"
              ></label>
              <input
                id="members_phone_number"
                {...form.register("members_phone_number")}
                className="input"
                placeholder="01012345678"
                type="tel"
                maxLength={11} // 최대 11자리 입력 가능
                pattern="\d{11}" // 11자리 숫자만 허용
                onInvalid={(e) => {
                  (e.target as HTMLInputElement).setCustomValidity(
                    "전화번호는 11자리 숫자여야 합니다."
                  );
                }}
                onInput={(e) => {
                  (e.target as HTMLInputElement).setCustomValidity(""); // 입력 중에는 경고를 초기화
                }}
                required
              />
            </div>

            <p>회사명</p>
            <div style={{ marginLeft: `40px` }}>
              <label htmlFor="members_company" className="text-right"></label>
              <input
                id="members_company"
                {...form.register("members_company")}
                className="input"
                placeholder="회사명을 입력해주세요"
                maxLength={20} // 최대 20자리 입력 가능
                onInvalid={(e) => {
                  (e.target as HTMLInputElement).setCustomValidity(
                    "회사명을 입력해주세요."
                  );
                }}
                onInput={(e) => {
                  (e.target as HTMLInputElement).setCustomValidity(""); // 입력 중에는 경고를 초기화
                }}
                required
              />
            </div>

            <p>응원메세지</p>
            <div style={{ marginLeft: `40px` }}>
              <label htmlFor="members_message" className="text-right"></label>
              <textarea
                id="members_message"
                {...form.register("members_message")}
                className="text"
                placeholder="300자 이내로 작성해주세요!"
                maxLength={300} // 최대 300자리 입력 가능
                onInvalid={(e) => {
                  (e.target as HTMLTextAreaElement).setCustomValidity(
                    "응원메세지를 입력해주세요."
                  );
                }}
                onInput={(e) => {
                  (e.target as HTMLTextAreaElement).setCustomValidity(""); // 입력 중에는 경고를 초기화
                }}
                rows={5} // 기본 5줄 크기로 설정
                required
              />
            </div>
          </div>
          <div className="">
            <button
              type="submit"
              className="submitButton flex items-center justify-center" // flex와 justify-center를 추가하여 중앙 정렬
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  {" "}
                  {/* 중앙 정렬을 위해 justify-center 추가 */}
                  <Spinner />
                  <span className="ml-2">제출 중...</span>
                </div>
              ) : (
                "제출"
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
