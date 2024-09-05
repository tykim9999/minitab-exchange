import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/main.jpg"
          alt="Next.js logo"
          width={430}
          height={932}
          priority
        />
      </main>
    </div>
  );
}
