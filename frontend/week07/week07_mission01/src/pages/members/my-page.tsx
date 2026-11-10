import { Link } from "@tanstack/react-router";
import { useProfileStore } from "../../stores/profile-store";

export function MyPage() {
  const nickname = useProfileStore((state) => state.nickname);
  const email = useProfileStore((state) => state.email);
  const imageUrl = useProfileStore((state) => state.imageUrl);

  return (
    <main className="mx-auto min-h-[calc(100dvh-165px)] max-w-[1126px] px-5 py-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">내 정보</h1>

        <Link
          to="/mypage/edit"
          className="rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          정보 수정
        </Link>
      </div>

      <section className="border-t border-gray-200 pt-6">
        <h2 className="mb-6 text-base font-bold">기본 정보</h2>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
          <img
            src={imageUrl || "/icons/person.svg"}
            alt="프로필 이미지"
            className={`h-20 w-20 shrink-0 rounded-full bg-gray-200 object-cover ${
              imageUrl ? "" : "p-4"
            }`}
          />

          <dl className="grid flex-1 gap-6 sm:grid-cols-2">
            <div>
              <dt className="mb-2 text-xs text-gray-500">
                닉네임
              </dt>
              <dd className="break-words text-sm font-semibold">
                {nickname}
              </dd>
            </div>

            <div>
              <dt className="mb-2 text-xs text-gray-500">
                이메일
              </dt>
              <dd className="break-all text-sm font-semibold">
                {email}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
