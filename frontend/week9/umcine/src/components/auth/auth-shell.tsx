import type { ReactNode } from "react";

export function AuthShell({ eyebrow, title, description, children }: {
  eyebrow: string; title: string; description: string; children: ReactNode;
}) {
  return (
    <main className="min-h-[calc(100vh-90px)] bg-[#f7f8fa] px-5 py-14">
      <section className="mx-auto w-full max-w-[520px] rounded-3xl border border-[#e4e7ec] bg-white p-7 shadow-[0_24px_70px_rgba(21,32,52,0.08)] sm:p-10">
        <p className="mb-3 text-sm font-bold tracking-[0.16em] text-[#2864e8]">{eyebrow}</p>
        <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-[#17191c]">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#737982]">{description}</p>
        <div className="mt-8">{children}</div>
      </section>
    </main>
  );
}

export const fieldClass = "mt-2 h-12 w-full rounded-xl border border-[#dfe3e8] px-4 text-sm outline-none transition focus:border-[#2864e8] focus:ring-4 focus:ring-[#2864e8]/10";
export const labelClass = "block text-sm font-bold text-[#34383f]";
export const buttonClass = "h-12 w-full rounded-xl bg-[#2864e8] text-sm font-bold text-white transition enabled:hover:bg-[#1f55ca] disabled:cursor-not-allowed disabled:bg-[#cbd2dc]";
