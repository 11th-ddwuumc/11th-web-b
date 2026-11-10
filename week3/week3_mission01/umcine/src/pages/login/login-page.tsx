import { useState } from "react";
import type { FormEvent } from "react";
import "../../App.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState("");

  const isEmailValid = EMAIL_REGEX.test(email.trim());
  const canSubmit = isEmailValid && password.length > 0;

  const showEmailError = email.length > 0 && !isEmailValid;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canSubmit) return;

    // 로그인 API는 추후 연결
    setNotice("입력값을 확인했어요. 로그인 API는 아직 연결 전이에요.");
  };

  return (
    <main className="login-page">
      <section className="login-container" aria-labelledby="login-title">
        <h1 id="login-title" className="login-title">
          로그인
        </h1>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {/* 이메일 */}
          <div className="login-field">
            <label htmlFor="login-email">이메일</label>

            <div
              className={`login-input-box ${showEmailError ? "is-error" : ""}`}
            >
              <svg
                className="login-input-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 6 9 7 9-7" />
              </svg>

              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setNotice("");
                }}
                aria-invalid={showEmailError}
                aria-describedby={
                  showEmailError ? "login-email-error" : undefined
                }
                required
              />
            </div>

            {showEmailError && (
              <p id="login-email-error" className="login-error">
                올바른 이메일 형식을 입력해 주세요.
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="login-field">
            <label htmlFor="login-password">비밀번호</label>

            <div className="login-input-box">
              <svg
                className="login-input-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="5" y="10" width="14" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                <path d="M12 14v3" />
              </svg>

              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="비밀번호"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setNotice("");
                }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-submit-button"
            disabled={!canSubmit}
          >
            로그인
          </button>

          {notice && (
            <p className="login-notice" role="status">
              {notice}
            </p>
          )}
        </form>

        <p className="login-footer">
          처음이신가요? <a href="/signup">회원가입</a>
        </p>
      </section>
    </main>
  );
}
