"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Define the form schema
const formSchema = z.object({
  regNumber: z.number().lte(200, {
    message: "등록번호는 200 이하이어야 합니다.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface MainFormProps {
  updateFireworks: (value: boolean) => void;
}

export function MainForm({ updateFireworks }: MainFormProps) {
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      regNumber: 0,
    },
  });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    console.log(values);
    updateFireworks(true);
    setTimeout(() => updateFireworks(false), 10000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Registration Number Input */}
        <FormField
          control={form.control}
          name="regNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter your registration number</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormDescription>
                This is your registration number.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirmation Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button type="submit">확인</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>등록확인</DialogTitle>
              <DialogDescription>
                선물 수령을 위해 간략한 정보를 기입해주세요
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              {/* Name Input */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  이름
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              {/* Message Input */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="message" className="text-right">
                  응원메세지
                </Label>
                <Input id="message" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={() => window.location.href = '/gift'}>확인</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
