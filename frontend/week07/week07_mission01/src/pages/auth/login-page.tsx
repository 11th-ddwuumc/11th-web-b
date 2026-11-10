import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "@tanstack/react-router";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isEmailValid = EMAIL_REGEX.test(email.trim());

  const showEmailError = email.length > 0 && !isEmailValid;

  const canSubmit = isEmailValid && password.length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) return;

    alert("로그인 API 연동 전");
  }

  const inputClassName =
    "h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600";

  return (
    <main className="flex min-h-[calc(100dvh-65px)] items-center justify-center px-5 py-16">
      <section className="w-full max-w-[360px]">
        <h1 className="mb-7 text-2xl font-bold">로그인</h1>

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <label
              htmlFor="login-email"
              className="mb-2 block text-sm font-semibold"
            >
              이메일
            </label>

            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="이메일을 입력해 주세요"
              className={inputClassName}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={showEmailError}
              aria-describedby={
                showEmailError ? "login-email-error" : undefined
              }
            />

            {showEmailError && (
              <p
                id="login-email-error"
                className="mt-2 text-xs text-red-600"
              >
                올바른 이메일 형식을 입력해 주세요.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-2 block text-sm font-semibold"
            >
              비밀번호
            </label>

            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호를 입력해 주세요"
              className={inputClassName}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="h-11 w-full rounded-md bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            로그인
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-500">
          아직 회원이 아니신가요?{" "}
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:underline"
          >
            회원가입
          </Link>
        </p>
      </section>
    </main>
  );
}
