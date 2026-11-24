import Link from "next/link";
import type { ReactNode } from "react";

export default function PracticeLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <header className="flex flex-wrap gap-4 border-b pb-4">
        <Link href="/practice">Next.js 실습</Link>
        <Link href="/practice/new">정적 페이지</Link>
        <Link href="/practice/todos/1">할 일 1</Link>
        <Link href="/practice/todos/2">할 일 2</Link>
        <Link href="/practice/media">이미지와 폰트</Link>
      </header>
      <main className="space-y-4 py-8">{children}</main>
      <footer className="border-t pt-4">9주차 프론트엔드 실습</footer>
    </div>
  );
}
