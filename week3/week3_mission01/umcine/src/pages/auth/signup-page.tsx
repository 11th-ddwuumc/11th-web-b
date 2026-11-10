import { useState } from "react";
import "../../App.css";

import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";

import { signup } from "../../api/members/signup";
// import { useNavigate } from "@tanstack/react-router";

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [notice, setNotice] = useState("");
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });

  // 입력값의 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());
  const isNicknameValid =
    form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
  const isPasswordValid = PASSWORD_REGEX.test(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  // 모든 입력값이 유효하면 제출 버튼 활성화
  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: DEFAULT_DUPLICATE_CHECK,
      }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());
      const isAvailable = response.available;
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable },
      }));
      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  // const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      alert(response.message);
      // 로그인 페이지 연결 후 주석 해제
      // navigate({ to: "/login" });
    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔
  return (
    <main className="signup-page">
      <section className="signup-container" aria-labelledby="signup-title">
        <h1 id="signup-title" className="signup-title">
          회원가입
        </h1>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          {/* 이메일 */}
          <div className="signup-field">
            <label htmlFor="email">이메일</label>

            <div
              className={`signup-input-box ${showEmailError ? "is-error" : ""}`}
            >
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
                aria-invalid={showEmailError}
                aria-describedby={showEmailError ? "email-error" : undefined}
                required
              />

              <button
                type="button"
                className="signup-check-button"
                disabled={!isEmailValid || duplicateCheck.email.isChecking}
                onClick={() => handleCheckDuplicate("email")}
              >
                {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>

            {showEmailError && (
              <p id="email-error" className="signup-error">
                이메일 형식을 확인해 주세요.
              </p>
            )}
          </div>

          {/* 닉네임 */}
          <div className="signup-field">
            <label htmlFor="nickname">닉네임</label>

            <div
              className={`signup-input-box ${
                showNicknameError ? "is-error" : ""
              }`}
            >
              <input
                id="nickname"
                name="nickname"
                type="text"
                placeholder="2~12자"
                autoComplete="nickname"
                value={form.nickname}
                onChange={(e) => handleChangeField("nickname", e.target.value)}
                aria-invalid={showNicknameError}
                aria-describedby={
                  showNicknameError ? "nickname-error" : undefined
                }
                required
              />

              <button
                type="button"
                className="signup-check-button"
                disabled={
                  !isNicknameValid || duplicateCheck.nickname.isChecking
                }
                onClick={() => handleCheckDuplicate("nickname")}
              >
                {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
              </button>
            </div>

            {showNicknameError && (
              <p id="nickname-error" className="signup-error">
                닉네임은 2~12자로 입력해 주세요.
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="signup-field">
            <label htmlFor="password">비밀번호</label>

            <div
              className={`signup-input-box ${
                showPasswordError ? "is-error" : ""
              }`}
            >
              <input
                id="password"
                name="password"
                type="password"
                placeholder="8자 이상"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => handleChangeField("password", e.target.value)}
                aria-invalid={showPasswordError}
                aria-describedby="password-help"
                required
              />
            </div>

            <p
              id="password-help"
              className={showPasswordError ? "signup-error" : "signup-help"}
            >
              영문 대소문자, 숫자, 특수문자(!@#$%^&amp;*)를 모두 포함해 8자 이상
              입력해 주세요.
            </p>
          </div>

          {/* 비밀번호 확인 */}
          <div className="signup-field">
            <label htmlFor="passwordConfirm">비밀번호 확인</label>

            <div
              className={`signup-input-box ${
                showPasswordConfirmError ? "is-error" : ""
              }`}
            >
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                placeholder="다시 입력"
                autoComplete="new-password"
                value={form.passwordConfirm}
                onChange={(e) =>
                  handleChangeField("passwordConfirm", e.target.value)
                }
                aria-invalid={showPasswordConfirmError}
                aria-describedby={
                  showPasswordConfirmError
                    ? "password-confirm-error"
                    : undefined
                }
                required
              />
            </div>

            {showPasswordConfirmError && (
              <p id="password-confirm-error" className="signup-error">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="signup-submit-button"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>

          {notice && (
            <p className="signup-help" role="status">
              {notice}
            </p>
          )}
        </form>

        <p className="signup-footer">
          이미 계정이 있나요? <a href="/login">로그인</a>
        </p>
      </section>
    </main>
  );
}
