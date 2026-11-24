import { useEffect, useState, type FormEvent } from "react";
import { ApiError } from "../../api/api-client";
import { getMyInfo, updateMyInfo, type MemberInfo } from "../../api/members";
import { AuthShell, buttonClass, fieldClass, labelClass } from "../../components/auth/auth-shell";

export function MyPage() {
  const [member, setMember] = useState<MemberInfo | null>(null); const [nickname, setNickname] = useState("");
  const [status, setStatus] = useState("정보를 불러오는 중입니다."); const [saving, setSaving] = useState(false);
  useEffect(() => { getMyInfo().then(({ result }) => { setMember(result); setNickname(result.nickname); setStatus(""); }).catch((error) => setStatus(error instanceof ApiError ? error.message : "정보를 불러오지 못했습니다.")); }, []);
  const submit = async (event: FormEvent) => { event.preventDefault(); if (nickname.trim().length < 2 || nickname.trim().length > 12) return; setSaving(true); try { const { result } = await updateMyInfo(nickname.trim()); setMember(result); setNickname(result.nickname); localStorage.setItem("nickname", result.nickname); setStatus("닉네임을 수정했습니다."); } catch (error) { setStatus(error instanceof ApiError ? error.message : "수정하지 못했습니다."); } finally { setSaving(false); } };
  return <AuthShell eyebrow="MY PROFILE" title="내 정보" description="계정 정보와 UMCine에서 사용할 닉네임을 관리하세요.">{member && <div className="mb-7 grid gap-3 rounded-2xl bg-[#f7f8fa] p-5 text-sm"><p><span className="mr-3 font-bold text-[#383d45]">이메일</span>{member.email}</p><p><span className="mr-3 font-bold text-[#383d45]">가입일</span>{new Date(member.createdAt).toLocaleDateString("ko-KR")}</p></div>}<form className="space-y-5" onSubmit={submit}><label className={labelClass}>닉네임<input className={fieldClass} value={nickname} onChange={(e) => setNickname(e.target.value)} disabled={!member} /><span className="mt-2 block text-xs font-normal text-[#858b94]">2자 이상 12자 이하</span></label>{status && <p role="status" className="rounded-xl bg-[#f1f5ff] p-3 text-sm text-[#214fba]">{status}</p>}<button className={buttonClass} disabled={!member || saving || nickname.trim().length < 2 || nickname.trim().length > 12}>{saving ? "저장 중..." : "변경사항 저장"}</button></form></AuthShell>;
}
