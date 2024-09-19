import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "@styles/mainForm.css";
import Swal from 'sweetalert2';

interface FormValues {
  members_name: string;
  members_phone_number: string;
}

export function CheckForm() {
  const form = useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false); // 로딩 상태 관리

  // 컴포넌트가 마운트되었을 때 세션에서 userId와 winnerStatus 값을 가져옵니다.
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    const storedWinnerStatus = sessionStorage.getItem("winnerStatus");
    const storedBookId = sessionStorage.getItem("bookId");

    // 콘솔에 출력
    console.log("User ID:", storedUserId);
    console.log("Winner Status:", storedWinnerStatus);
    console.log("Book ID:", storedBookId);
  }, []);

  // 폼 제출 처리
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true); // 제출 시작 시 로딩 활성화
    try {
      const response = await fetch("/api/checkMembers", { // API 경로를 맞추기
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const result = await response.json();

        if (!result.success) {
          Swal.fire({
            icon: 'warning',
            title: '알림',
            text: '해당 이름과 전화번호로 등록된\n당첨자가 없습니다.',
            confirmButtonText: '확인',
            buttonsStyling: false,
            customClass: {
              popup: 'my-popup-class',
              title: 'my-title-class',
              htmlContainer: 'my-text-class',
              confirmButton: 'submitButton',
            },
            didOpen: (modal) => {
              // 모달 스타일 적용
              const popup = modal.querySelector('.my-popup-class');
              if (popup instanceof HTMLElement) {
                popup.style.borderRadius = '15px';
                popup.style.padding = '30px';
                popup.style.width = '400px';
              }
        
              // 제목 스타일 적용
              const title = modal.querySelector('.my-title-class');
              if (title instanceof HTMLElement) {
                title.style.fontSize = '24px';
                title.style.fontWeight = 'bold';
                title.style.color = '#000000';
                title.style.textAlign = 'center';
              }
        
              // 텍스트 스타일 적용
              const text = modal.querySelector('.my-text-class');
              if (text instanceof HTMLElement) {
                text.style.color = '#000000';
                text.style.fontSize = '18px';
                text.style.fontWeight = 'normal';
                text.style.textAlign = 'center';
                text.style.whiteSpace = 'pre-line'; // 줄바꿈 적용
              }
        
              // 확인 버튼 스타일 적용
              const confirmButton = modal.querySelector('.submitButton');
              if (confirmButton instanceof HTMLElement) {
                confirmButton.style.backgroundColor = '#2AA3FB';
                confirmButton.style.width = '275px';
                confirmButton.style.height = '45px';
                confirmButton.style.borderRadius = '10px';
                confirmButton.style.color = '#FFFFFF';
                confirmButton.style.border = 'none';
                confirmButton.style.fontSize = '16px';
                confirmButton.style.cursor = 'pointer';
                confirmButton.style.display = 'block';
                confirmButton.style.margin = '20px auto 0 auto';
              }
        
              // 아이콘 스타일 적용
              const icon = modal.querySelector('.swal2-icon.swal2-warning');
              if (icon instanceof HTMLElement) {
                icon.style.color = '#FFA000';
                icon.style.marginBottom = '20px';
              }
            },
          });
          setIsSubmitting(false);
          return;
        }
        
        // 조회한 결과로 세션 스토리지에 저장
        sessionStorage.setItem("userId", result.member?.userId || "");
        sessionStorage.setItem("winnerStatus", result.member?.winnerStatus || "");
        sessionStorage.setItem("bookId", result.member?.bookId || "");

        // 결과값을 콘솔에 출력
        console.log("User ID:", result.member?.userId);
        console.log("Winner Status:", result.member?.winnerStatus);
        console.log("Book ID:", result.member?.bookId);

        // 페이지 이동 부분은 주석 처리
        window.location.href = "/gift";
      } else {
        const result = await response.json();
        alert(`Error: ${result.message || '서버에서 오류가 발생했습니다.'}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("서버와의 통신에 실패했습니다.");
    } finally {
      setIsSubmitting(false); // 제출이 끝나면 로딩 비활성화
    }
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="input-submit">
          <p className="members">이름</p>
          <div>
            <label htmlFor="members_name" className="text-right"></label>
            <input
              id="members_name"
              {...form.register("members_name", { required: "이름을 입력해주세요" })}
              className="input"
              placeholder="이름을 입력해주세요"
              maxLength={10}
              required
            />
          </div>

          <p className="members">전화번호</p>
          <div>
            <label
              htmlFor="members_phone_number"
              className="text-right"
            ></label>
            <input
              id="members_phone_number"
              {...form.register("members_phone_number", { 
                required: "전화번호를 입력해주세요", 
                pattern: {
                  value: /^\d{11}$/,
                  message: "전화번호는 11자리 숫자여야 합니다."
                } 
              })}
              className="input"
              placeholder="01012345678"
              type="tel"
              maxLength={11} // 최대 11자리 입력 가능
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
                <span className="ml-2">확인 중...</span>
              </div>
            ) : (
              "확인"
            )}
          </button>
        </div>
      </form>
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
