import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { checkEmailDuplicate, checkNicknameDuplicate, signUp } from "../../api/members";
import { ApiError } from "../../api/api-client";
import { AuthShell, buttonClass, fieldClass, labelClass } from "../../components/auth/auth-shell";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
type DuplicateState = "idle" | "checking" | "available" | "unavailable";

export function SignupPage() {
  const [form, setForm] = useState({ email: "", nickname: "", password: "", passwordConfirm: "" });
  const [duplicate, setDuplicate] = useState<{ email: DuplicateState; nickname: DuplicateState }>({ email: "idle", nickname: "idle" });
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const valid = {
    email: EMAIL_REGEX.test(form.email.trim()),
    nickname: form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12,
    password: PASSWORD_REGEX.test(form.password),
    passwordConfirm: form.password.length > 0 && form.password === form.passwordConfirm,
  };
  const canSubmit = Object.values(valid).every(Boolean) && duplicate.email === "available" && duplicate.nickname === "available" && !submitting;

  const update = (key: keyof typeof form, value: string) => {
    setForm((previous) => ({ ...previous, [key]: value }));
    if (key === "email" || key === "nickname") setDuplicate((previous) => ({ ...previous, [key]: "idle" }));
    setStatus("");
  };

  const checkDuplicate = async (key: "email" | "nickname") => {
    if (!valid[key] || duplicate[key] === "checking") return;
    setDuplicate((previous) => ({ ...previous, [key]: "checking" }));
    try {
      const result = key === "email" ? await checkEmailDuplicate(form.email.trim()) : await checkNicknameDuplicate(form.nickname.trim());
      setDuplicate((previous) => ({ ...previous, [key]: result.available ? "available" : "unavailable" }));
    } catch { setDuplicate((previous) => ({ ...previous, [key]: "idle" })); setStatus("중복 확인 중 문제가 발생했습니다."); }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!canSubmit) return; setSubmitting(true); setStatus("");
    try {
      await signUp({ email: form.email.trim(), nickname: form.nickname.trim(), password: form.password });
      setStatus("회원가입이 완료되었습니다. 이제 로그인해 주세요.");
      setForm({ email: "", nickname: "", password: "", passwordConfirm: "" });
      setDuplicate({ email: "idle", nickname: "idle" });
    } catch (error) { setStatus(error instanceof ApiError ? error.message : "회원가입에 실패했습니다."); }
    finally { setSubmitting(false); }
  };

  return (
    <AuthShell eyebrow="JOIN UMCINE" title="회원가입" description="좋아하는 영화를 발견하고 나만의 평점을 기록해 보세요.">
      <form className="space-y-5" onSubmit={submit} noValidate>
        <Field label="이메일" type="email" value={form.email} onChange={(value) => update("email", value)} error={form.email && !valid.email ? "올바른 이메일 형식을 입력해 주세요." : ""} action={() => checkDuplicate("email")} actionText={duplicate.email === "checking" ? "확인 중" : "중복 확인"} message={duplicate.email === "available" ? "사용 가능한 이메일입니다." : duplicate.email === "unavailable" ? "이미 사용 중인 이메일입니다." : ""} />
        <Field label="닉네임" value={form.nickname} onChange={(value) => update("nickname", value)} error={form.nickname && !valid.nickname ? "닉네임은 2~12자로 입력해 주세요." : ""} action={() => checkDuplicate("nickname")} actionText={duplicate.nickname === "checking" ? "확인 중" : "중복 확인"} message={duplicate.nickname === "available" ? "사용 가능한 닉네임입니다." : duplicate.nickname === "unavailable" ? "이미 사용 중인 닉네임입니다." : ""} />
        <Field label="비밀번호" type="password" value={form.password} onChange={(value) => update("password", value)} error={form.password && !valid.password ? "대/소문자, 숫자, 특수문자를 포함해 8자 이상 입력해 주세요." : ""} />
        <Field label="비밀번호 확인" type="password" value={form.passwordConfirm} onChange={(value) => update("passwordConfirm", value)} error={form.passwordConfirm && !valid.passwordConfirm ? "비밀번호가 일치하지 않습니다." : ""} />
        {status && <p role="status" className="rounded-xl bg-[#f1f5ff] p-3 text-sm text-[#214fba]">{status}</p>}
        <button className={buttonClass} disabled={!canSubmit}>{submitting ? "가입 중..." : "가입하기"}</button>
        <p className="text-center text-sm text-[#777d86]">이미 계정이 있나요? <Link className="font-bold text-[#2864e8]" to="/login">로그인</Link></p>
      </form>
    </AuthShell>
  );
}

function Field({ label, type = "text", value, onChange, error, action, actionText, message }: { label: string; type?: string; value: string; onChange: (value: string) => void; error?: string; action?: () => void; actionText?: string; message?: string; }) {
  return <label className={labelClass}>{label}<div className="flex gap-2"><input className={fieldClass} type={type} value={value} onChange={(event) => onChange(event.target.value)} />{action && <button className="mt-2 shrink-0 rounded-xl border border-[#2864e8] px-3 text-xs font-bold text-[#2864e8]" type="button" onClick={action}>{actionText}</button>}</div>{error && <span className="mt-2 block text-xs font-medium text-[#dc3d4b]">{error}</span>}{message && <span className={`mt-2 block text-xs font-medium ${message.startsWith("사용 가능") ? "text-[#14845d]" : "text-[#dc3d4b]"}`}>{message}</span>}</label>;
}
