import { useState } from "react";
import type { FormEvent } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";

// 이메일 형식
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 영문 대문자·소문자·숫자·특수문자를 포함해 8자 이상
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

type FormKey = keyof typeof DEFAULT_FORM;

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  const [duplicateCheck, setDuplicateCheck] = useState({
    email: { ...DEFAULT_DUPLICATE_CHECK },
    nickname: { ...DEFAULT_DUPLICATE_CHECK },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력값 유효성 검사
  const isEmailValid = EMAIL_REGEX.test(form.email.trim());

  const isNicknameValid =
    form.nickname.trim().length >= 2 &&
    form.nickname.trim().length <= 12;

  const isPasswordValid = PASSWORD_REGEX.test(form.password);

  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 &&
    form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;

  const showNicknameError =
    form.nickname.length > 0 && !isNicknameValid;

  const showPasswordError =
    form.password.length > 0 && !isPasswordValid;

  const showPasswordConfirmError =
    form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  const isFormValid =
    isEmailValid &&
    isNicknameValid &&
    isPasswordValid &&
    isPasswordConfirmValid;

  // 입력 조건과 이메일·닉네임 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  function handleChangeField(key: FormKey, value: string) {
    if (isSubmitting) return;

    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;

      // 확인한 값을 수정하면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...DEFAULT_DUPLICATE_CHECK },
      }));
    }

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleCheckDuplicate(key: DuplicateCheckKey) {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;

    if (
      !isValid ||
      duplicateCheck[key].isChecking ||
      isSubmitting
    ) {
      return;
    }

    const label = key === "email" ? "이메일" : "닉네임";

    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: {
        isChecking: true,
        isAvailable: false,
      },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());

      const isAvailable = response.available;

      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          isAvailable,
        },
      }));

      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          isAvailable: false,
        },
      }));

      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          isChecking: false,
        },
      }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });

      alert(response.message);

    } catch {
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName =
    "h-11 w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-100";

  const duplicateButtonClassName =
    "h-11 shrink-0 rounded-md border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <main className="flex min-h-[calc(100dvh-65px)] items-center justify-center px-5 py-16">
      <section className="w-full max-w-[360px]">
        <h1 className="mb-7 text-2xl font-bold">회원가입</h1>

        <form
          className="space-y-5"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* 이메일 */}
          <div>
            <label
              htmlFor="signup-email"
              className="mb-2 block text-sm font-semibold"
            >
              이메일
            </label>

            <div className="flex gap-2">
              <input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="이메일을 입력해 주세요"
                className={inputClassName}
                value={form.email}
                disabled={
                  duplicateCheck.email.isChecking || isSubmitting
                }
                onChange={(event) =>
                  handleChangeField("email", event.target.value)
                }
                aria-invalid={showEmailError}
                aria-describedby={
                  showEmailError ? "signup-email-error" : undefined
                }
              />

              <button
                type="button"
                className={duplicateButtonClassName}
                disabled={
                  !isEmailValid ||
                  duplicateCheck.email.isChecking ||
                  isSubmitting
                }
                onClick={() => handleCheckDuplicate("email")}
              >
                {duplicateCheck.email.isChecking
                  ? "확인 중"
                  : "중복 확인"}
              </button>
            </div>

            {showEmailError && (
              <p
                id="signup-email-error"
                className="mt-2 text-xs text-red-600"
              >
                올바른 이메일 형식을 입력해 주세요.
              </p>
            )}
          </div>

          {/* 닉네임 */}
          <div>
            <label
              htmlFor="signup-nickname"
              className="mb-2 block text-sm font-semibold"
            >
              닉네임
            </label>

            <div className="flex gap-2">
              <input
                id="signup-nickname"
                name="nickname"
                type="text"
                autoComplete="nickname"
                placeholder="닉네임을 입력해 주세요"
                className={inputClassName}
                value={form.nickname}
                disabled={
                  duplicateCheck.nickname.isChecking || isSubmitting
                }
                onChange={(event) =>
                  handleChangeField("nickname", event.target.value)
                }
                aria-invalid={showNicknameError}
                aria-describedby={
                  showNicknameError
                    ? "signup-nickname-error"
                    : undefined
                }
              />

              <button
                type="button"
                className={duplicateButtonClassName}
                disabled={
                  !isNicknameValid ||
                  duplicateCheck.nickname.isChecking ||
                  isSubmitting
                }
                onClick={() => handleCheckDuplicate("nickname")}
              >
                {duplicateCheck.nickname.isChecking
                  ? "확인 중"
                  : "중복 확인"}
              </button>
            </div>

            {showNicknameError && (
              <p
                id="signup-nickname-error"
                className="mt-2 text-xs text-red-600"
              >
                닉네임은 2~12자로 입력해 주세요.
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label
              htmlFor="signup-password"
              className="mb-2 block text-sm font-semibold"
            >
              비밀번호
            </label>

            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="비밀번호를 입력해 주세요"
              className={inputClassName}
              value={form.password}
              disabled={isSubmitting}
              onChange={(event) =>
                handleChangeField("password", event.target.value)
              }
              aria-invalid={showPasswordError}
              aria-describedby={
                showPasswordError
                  ? "signup-password-error"
                  : undefined
              }
            />

            {showPasswordError && (
              <p
                id="signup-password-error"
                className="mt-2 text-xs leading-relaxed text-red-600"
              >
                영문 대소문자, 숫자, 특수문자(!@#$%^&amp;*)를
                모두 포함해 8자 이상 입력해 주세요.
              </p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label
              htmlFor="signup-password-confirm"
              className="mb-2 block text-sm font-semibold"
            >
              비밀번호 확인
            </label>

            <input
              id="signup-password-confirm"
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              placeholder="비밀번호를 다시 입력해 주세요"
              className={inputClassName}
              value={form.passwordConfirm}
              disabled={isSubmitting}
              onChange={(event) =>
                handleChangeField(
                  "passwordConfirm",
                  event.target.value,
                )
              }
              aria-invalid={showPasswordConfirmError}
              aria-describedby={
                showPasswordConfirmError
                  ? "signup-password-confirm-error"
                  : undefined
              }
            />

            {showPasswordConfirmError && (
              <p
                id="signup-password-confirm-error"
                className="mt-2 text-xs text-red-600"
              >
                비밀번호가 일치하지 않아요.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="h-11 w-full rounded-md bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </form>
      </section>
    </main>
  );
}
