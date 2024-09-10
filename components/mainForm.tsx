"use client";

// import { useRouter } from 'next/router';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define schema for validation
const formSchema = z.object({
  members_name: z.string().min(1, "이름을 입력해주세요."),
  members_phone_number: z.string().min(10, "유효한 전화번호를 입력해주세요."),
  members_company: z.string().optional(),
  members_message: z.string().optional(),
  members_privacy_consent: z.string().min(1, "개인정보 동의는 필수입니다."),
  members_book_received: z.string().min(1, "책 수령 여부를 선택해주세요."),
  members_winner_status: z.string().min(1, "기프티콘 당첨 여부를 선택해주세요."),
  members_book_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MainFormProps {
  updateFireworks: (value: boolean) => void;
}

export function MainForm({ updateFireworks }: MainFormProps) {
  // const router = useRouter(); // router 초기화
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      members_name: "",
      members_phone_number: "",
      members_company: "",
      members_message: "",
      members_privacy_consent: "X", // Default value
      members_book_received: "X", // Default value
      members_winner_status: "X", // Default value
      members_book_id: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        // router.push('/gift/page');
        updateFireworks(true);
        form.reset();
        setTimeout(() => updateFireworks(false), 10000);
      } else {
        const result = await response.json();
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("회원 정보 저장에 실패했습니다.");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="members_name" className="text-right">
            이름
          </Label>
          <Input
            id="members_name"
            {...form.register("members_name")}
            className="col-span-3"
            placeholder="이름을 입력해주세요"
            required
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="members_phone_number" className="text-right">
            핸드폰 번호
          </Label>
          <Input
            id="members_phone_number"
            {...form.register("members_phone_number")}
            className="col-span-3"
            placeholder="010-1234-5678"
            type="tel"
            required
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="members_company" className="text-right">
            회사명
          </Label>
          <Input
            id="members_company"
            {...form.register("members_company")}
            className="col-span-3"
            placeholder="회사명을 입력해주세요"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="members_message" className="text-right">
            응원메세지
          </Label>
          <Input
            id="members_message"
            {...form.register("members_message")}
            className="col-span-3"
            placeholder="300자 이내로 작성해주세요!"
          />
        </div>

       
        
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary">
          제출
        </button>
      </div>
    </form>
  );
}
