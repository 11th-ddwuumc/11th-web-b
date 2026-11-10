import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { login } from "../../api/auth";
import { ApiError } from "../../api/api-client";
import { AuthShell, buttonClass, fieldClass, labelClass } from "../../components/auth/auth-shell";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setLoading(true); setError("");
    try { const response = await login(email, password); localStorage.setItem("accessToken", response.result.accessToken); localStorage.setItem("nickname", response.result.nickname); await navigate({ to: "/my" }); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : "로그인에 실패했습니다."); }
    finally { setLoading(false); }
  };
  return <AuthShell eyebrow="WELCOME BACK" title="로그인" description="UMCine에서 영화 취향을 계속 이어가세요."><form className="space-y-5" onSubmit={submit}><label className={labelClass}>이메일<input className={fieldClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label><label className={labelClass}>비밀번호<input className={fieldClass} type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>{error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}<button className={buttonClass} disabled={!email || !password || loading}>{loading ? "로그인 중..." : "로그인"}</button><p className="text-center text-sm text-[#777d86]">처음이신가요? <Link className="font-bold text-[#2864e8]" to="/signup">회원가입</Link></p></form></AuthShell>;
}
