import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormValues {
  members_name: string;
  members_phone_number: string;
  members_company?: string;
  members_message?: string;
}

// MainForm Props 타입 정의
interface MainFormProps {
  updateFireworks: (value: boolean) => void;  // 불꽃놀이 상태를 업데이트하는 함수
}

export function MainForm({ updateFireworks }: MainFormProps) {  // updateFireworks props 추가
  const form = useForm<FormValues>();
  const [showPopup, setShowPopup] = useState(false); // 팝업창 표시 상태
  const [userId, setUserId] = useState<string | null>(null); // DB에 저장된 사용자의 ID를 추적
  const [isSubmitted, setIsSubmitted] = useState(false); // 제출 후 인풋 숨기기

  // 폼 제출 처리
  const onSubmit = async (values: FormValues) => {
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
        setUserId(result.id); // 새로 생성된 사용자의 ID 저장
        setIsSubmitted(true); // 폼을 숨기고 팝업을 표시
        updateFireworks(true); // 폼 제출 후 불꽃놀이 시작
        setShowPopup(true);
      } else {
        const result = await response.json();
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("회원 정보 저장에 실패했습니다.");
    }
  };

  // 동의 여부 처리
  const handleConsent = async (consent: boolean) => {
    window.location.href = '/gift'; // window.location을 사용하여 페이지 이동
    const consentValue = consent ? 'O' : 'X'; // 'O' for 동의, 'X' for 비동의

    try {
      const response = await fetch(`/api/members/${userId}/consent`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ privacy_consent: consentValue }),
      });

      if (response.ok) {
        alert("개인정보 제공 동의 여부가 저장되었습니다.");
        setShowPopup(false); // 팝업창 닫기
      } else {
        const result = await response.json();
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error updating consent:", error);
      alert("개인정보 제공 동의 여부 저장에 실패했습니다.");
    }
  };

  // 팝업창 컴포넌트
  const Popup = () => (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-description border border-white p-4" style={{ width: '500px' }}>
          <p>※ 개인정보 처리에 관한 동의 여부</p><br />
          <p>
            귀하는 (주)이레테크 데이터랩스에서 수집한 귀하의 개인정보 활용 업무 처리에 동의합니다.
            이벤트 경품 발송, 마케팅 자료 활용 목적 외에 다른 목적으로 사용하지 않습니다.
            귀하는 위 개인정보의 수집 및 이용에 대한 동의를 거부할 수 있으며, 동의를 거부할 경우 이벤트 참여에 대한 혜택은 제공되지 않습니다.
          </p>
        </div>

        <div className="popup-buttons flex justify-center gap-4 mt-4">
          <button
            onClick={() => handleConsent(true)}
            className="bg-white text-black px-4 py-2 rounded-lg hover:bg-green-600"
          >
            예
          </button>
          <button
            onClick={() => handleConsent(false)}
            className="bg-white text-black px-4 py-2 rounded-lg hover:bg-red-600"
          >
            아니오
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
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="members_name" className="text-right">이름</label>
              <input
                id="members_name"
                {...form.register("members_name")}
                className="col-span-3 border border-gray-300 p-2 rounded text-black" // 텍스트 색상 검정
                placeholder="이름을 입력해주세요"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="members_phone_number" className="text-right">핸드폰 번호</label>
              <input
                id="members_phone_number"
                {...form.register("members_phone_number")}
                className="col-span-3 border border-gray-300 p-2 rounded text-black" // 텍스트 색상 검정
                placeholder="010-1234-5678"
                type="tel"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="members_company" className="text-right">회사명</label>
              <input
                id="members_company"
                {...form.register("members_company")}
                className="col-span-3 border border-gray-300 p-2 rounded text-black" // 텍스트 색상 검정
                placeholder="회사명을 입력해주세요"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="members_message" className="text-right">응원메세지</label>
              <input
                id="members_message"
                {...form.register("members_message")}
                className="col-span-3 border border-gray-300 p-2 rounded text-black" // 텍스트 색상 검정
                placeholder="300자 이내로 작성해주세요!"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary">제출</button>
          </div>
        </form>
      ) : null}

      {/* 팝업창이 표시될 때 */}
      {showPopup && <Popup />}
    </div>
  );
}
