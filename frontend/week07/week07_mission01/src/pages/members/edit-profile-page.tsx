import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useProfileStore } from "../../stores/profile-store";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export function EditProfilePage() {
  const profile = useProfileStore();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(profile.nickname);
  const [email, setEmail] = useState(profile.email);
  const [imageUrl, setImageUrl] = useState(profile.imageUrl);
  const [imageError, setImageError] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);

  const isNicknameValid =
    nickname.trim().length >= 2 && nickname.trim().length <= 12;

  const isEmailValid = EMAIL_REGEX.test(email.trim());

  const canSubmit =
    isNicknameValid && isEmailValid && !isImageLoading;

  function handleChangeImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("JPG, PNG, WEBP 이미지를 선택해 주세요.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("5MB 이하의 이미지를 선택해 주세요.");
      event.target.value = "";
      return;
    }

    setImageError("");
    setIsImageLoading(true);

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
      } else {
        setImageError("이미지를 읽지 못했어요. 다시 선택해 주세요.");
      }

      setIsImageLoading(false);
    };

    reader.onerror = () => {
      setImageError("이미지를 읽지 못했어요. 다시 선택해 주세요.");
      setIsImageLoading(false);
    };

    reader.onabort = () => {
      setIsImageLoading(false);
    };

    reader.readAsDataURL(file);

    // 같은 이미지도 다시 선택할 수 있도록 초기화
    event.target.value = "";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) return;

    profile.updateProfile({
      nickname: nickname.trim(),
      email: email.trim(),
      imageUrl,
    });

    void navigate({ to: "/mypage" });
  }

  const inputClassName =
    "h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600";

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-165px)] max-w-[1126px] flex-col px-5 py-8">
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">내 정보 수정</h1>

            <p className="mt-2 text-xs text-gray-500">
              내 정보를 수정할 수 있어요.
            </p>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="shrink-0 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            수정 완료
          </button>
        </div>

        <div className="grid gap-10 sm:grid-cols-2">
          <div className="flex flex-col items-center">
            <img
              src={imageUrl || "/icons/person.svg"}
              alt="프로필 이미지 미리보기"
              className={`h-24 w-24 rounded-full bg-gray-200 object-cover ${
                imageUrl ? "" : "p-5"
              }`}
            />

            <label
              htmlFor="profile-image"
              className="mt-4 text-sm font-semibold"
            >
              프로필 이미지 변경
            </label>

            <input
              id="profile-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={isImageLoading}
              onChange={handleChangeImage}
              aria-describedby="profile-image-help profile-image-status"
              className="mt-3 w-full max-w-[280px] text-xs text-gray-500 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold file:text-gray-700 disabled:cursor-not-allowed"
            />

            <p
              id="profile-image-help"
              className="mt-3 text-xs text-gray-500"
            >
              JPG, PNG, WEBP · 최대 5MB
            </p>

            <div
              id="profile-image-status"
              className="mt-2 text-xs"
              aria-live="polite"
            >
              {isImageLoading && (
                <p className="text-gray-500">이미지를 읽고 있어요.</p>
              )}

              {imageError && (
                <p className="text-red-600">{imageError}</p>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="edit-nickname"
                className="mb-2 block text-sm font-semibold"
              >
                닉네임
              </label>

              <input
                id="edit-nickname"
                name="nickname"
                type="text"
                autoComplete="nickname"
                className={inputClassName}
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                aria-invalid={!isNicknameValid}
                aria-describedby={
                  !isNicknameValid ? "edit-nickname-error" : undefined
                }
              />

              {!isNicknameValid && (
                <p
                  id="edit-nickname-error"
                  className="mt-2 text-xs text-red-600"
                >
                  닉네임은 2~12자로 입력해 주세요.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="edit-email"
                className="mb-2 block text-sm font-semibold"
              >
                이메일
              </label>

              <input
                id="edit-email"
                name="email"
                type="email"
                autoComplete="email"
                className={inputClassName}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={!isEmailValid}
                aria-describedby={
                  !isEmailValid ? "edit-email-error" : undefined
                }
              />

              {!isEmailValid && (
                <p
                  id="edit-email-error"
                  className="mt-2 text-xs text-red-600"
                >
                  올바른 이메일 형식을 입력해 주세요.
                </p>
              )}
            </div>

            <div className="text-right">
              <Link
                to="/mypage"
                className="text-xs text-gray-500 underline"
              >
                수정 취소
              </Link>
            </div>
          </div>
        </div>
      </form>

      <section className="mt-auto pt-16">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-red-200 bg-red-50 p-4">
          <div>
            <h2 className="text-sm font-semibold text-red-700">
              회원 탈퇴
            </h2>

            <p className="mt-1 text-xs text-red-600">
              탈퇴하면 계정 정보와 저장한 정보가 삭제돼요.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              alert("이번 주차는 화면 구현만 진행해요. 실제로 탈퇴하지 않아요.")
            }
            className="rounded-md border border-red-300 bg-white px-3 py-2 text-xs font-semibold text-red-700"
          >
            회원 탈퇴
          </button>
        </div>
      </section>
    </main>
  );
}
