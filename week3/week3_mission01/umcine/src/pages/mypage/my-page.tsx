import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import "../../App.css";

type Profile = {
  nickname: string;
  email: string;
  image: string;
};

const STORAGE_KEY = "umcine-demo-profile";

const DEFAULT_PROFILE: Profile = {
  nickname: "쎄미",
  email: "test@example.com",
  image: "",
};

function loadProfile(): Profile {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return { ...DEFAULT_PROFILE };

    const parsed: unknown = JSON.parse(saved);

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      "nickname" in parsed &&
      "email" in parsed &&
      "image" in parsed &&
      typeof parsed.nickname === "string" &&
      typeof parsed.email === "string" &&
      typeof parsed.image === "string"
    ) {
      return {
        nickname: parsed.nickname,
        email: parsed.email,
        image: parsed.image,
      };
    }
  } catch {
    // 저장된 정보가 없거나 읽을 수 없으면 기본값 사용
  }

  return { ...DEFAULT_PROFILE };
}

function ProfileAvatar({ image }: { image: string }) {
  return (
    <div className="mypage-avatar">
      {image ? (
        <img src={image} alt="프로필" />
      ) : (
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M4 21v-2c0-4 3.6-6 8-6s8 2 8 6v2H4Z" />
        </svg>
      )}
    </div>
  );
}

export function MyPage() {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [draft, setDraft] = useState<Profile>(() => ({ ...profile }));
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [isReadingImage, setIsReadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일을 읽는 동안 화면 전환 후 결과가 반영되는 것을 방지
  const imageRequestRef = useRef(0);

  const nicknameLength = draft.nickname.trim().length;
  const isNicknameValid = nicknameLength >= 2 && nicknameLength <= 12;

  const handleStartEdit = () => {
    setDraft({ ...profile });
    setMessage("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    imageRequestRef.current += 1;
    setIsReadingImage(false);
    setDraft({ ...profile });
    setMessage("");
    setIsEditing(false);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setMessage("JPG, PNG, WEBP 이미지만 선택해 주세요.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("프로필 이미지는 5MB 이하로 선택해 주세요.");
      return;
    }

    const requestId = ++imageRequestRef.current;
    const reader = new FileReader();

    setIsReadingImage(true);
    setMessage("");

    reader.onload = () => {
      if (requestId !== imageRequestRef.current) return;

      if (typeof reader.result === "string") {
        const image = reader.result;
        setDraft((prev) => ({ ...prev, image }));
      } else {
        setMessage("이미지를 읽지 못했어요.");
      }

      setIsReadingImage(false);
    };

    reader.onerror = () => {
      if (requestId !== imageRequestRef.current) return;

      setIsReadingImage(false);
      setMessage("이미지를 읽지 못했어요. 다시 선택해 주세요.");
    };

    reader.readAsDataURL(file);
  };

  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isNicknameValid || isReadingImage) return;

    const updatedProfile: Profile = {
      ...draft,
      nickname: draft.nickname.trim(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));

      setProfile(updatedProfile);
      setIsEditing(false);
      setMessage("변경사항을 저장했어요.");
    } catch {
      setMessage(
        "저장하지 못했어요. 이미지 크기를 줄이거나 브라우저 저장 공간을 확인해 주세요.",
      );
    }
  };

  return (
    <main className="mypage">
      <div className="mypage-inner">
        {isEditing ? (
          <form className="mypage-edit" onSubmit={handleSave} noValidate>
            <div className="mypage-heading">
              <div>
                <h1>내 정보 수정</h1>
                <p className="mypage-description">
                  닉네임과 프로필 이미지만 변경할 수 있어요.
                </p>
              </div>

              <div className="mypage-actions">
                <button
                  type="button"
                  className="mypage-secondary-button"
                  onClick={handleCancel}
                >
                  취소
                </button>

                <button
                  type="submit"
                  className="mypage-primary-button"
                  disabled={!isNicknameValid || isReadingImage}
                >
                  {isReadingImage ? "이미지 처리 중" : "변경사항 저장"}
                </button>
              </div>
            </div>

            <div className="mypage-edit-grid">
              {/* 프로필 이미지 수정 */}
              <div className="mypage-photo-section">
                <button
                  type="button"
                  className="mypage-photo-button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="프로필 이미지 변경"
                >
                  <ProfileAvatar image={draft.image} />
                  <span className="mypage-pencil" aria-hidden="true">
                    ✎
                  </span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  hidden
                />

                <strong>프로필 이미지</strong>
                <span className="mypage-photo-help">
                  JPG · PNG · WEBP · 최대 5MB
                </span>
              </div>

              {/* 사용자 정보 수정 */}
              <div className="mypage-edit-fields">
                <div className="mypage-field">
                  <label htmlFor="mypage-nickname">닉네임</label>

                  <div className="mypage-input-box">
                    <input
                      id="mypage-nickname"
                      type="text"
                      autoComplete="nickname"
                      value={draft.nickname}
                      onChange={(e) => {
                        setDraft((prev) => ({
                          ...prev,
                          nickname: e.target.value,
                        }));
                        setMessage("");
                      }}
                      aria-invalid={!isNicknameValid}
                      aria-describedby="mypage-nickname-help"
                      required
                    />

                    <button
                      type="button"
                      className="mypage-duplicate-button"
                      disabled={!isNicknameValid}
                      onClick={() =>
                        setMessage(
                          "현재는 화면 테스트 단계예요. 실제 중복 확인은 백엔드 연결 후 사용할 수 있어요.",
                        )
                      }
                    >
                      중복 확인
                    </button>
                  </div>

                  <p
                    id="mypage-nickname-help"
                    className={
                      isNicknameValid
                        ? "mypage-field-help"
                        : "mypage-field-error"
                    }
                  >
                    닉네임은 2~12자로 입력해 주세요.
                  </p>
                </div>

                <div className="mypage-field">
                  <label htmlFor="mypage-email">이메일</label>

                  <div className="mypage-input-box">
                    <input
                      id="mypage-email"
                      type="email"
                      value={draft.email}
                      readOnly
                      aria-describedby="mypage-email-help"
                    />
                  </div>

                  <p id="mypage-email-help" className="mypage-field-help">
                    이메일은 변경할 수 없어요.
                  </p>
                </div>
              </div>
            </div>

            {message && (
              <p className="mypage-message" role="status">
                {message}
              </p>
            )}

            {/* 실제 회원 탈퇴 API는 연결하지 않음 */}
            <div className="mypage-withdraw">
              <div>
                <strong>회원 탈퇴</strong>
                <p>
                  탈퇴하면 저장한 정보, 후기와 즐겨찾기가 모두 삭제되어 복구할
                  수 없습니다.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMessage(
                    "회원 탈퇴 API는 아직 연결하지 않았어요. 실제 정보는 삭제되지 않아요.",
                  )
                }
              >
                회원 탈퇴
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="mypage-heading">
              <h1>내 정보</h1>

              <button
                type="button"
                className="mypage-primary-button"
                onClick={handleStartEdit}
              >
                정보 수정
              </button>
            </div>

            <section
              className="mypage-basic"
              aria-labelledby="mypage-basic-title"
            >
              <h2 id="mypage-basic-title">기본 정보</h2>

              <div className="mypage-profile-row">
                <ProfileAvatar image={profile.image} />

                <dl className="mypage-profile-details">
                  <div>
                    <dt>닉네임</dt>
                    <dd>{profile.nickname}</dd>
                  </div>

                  <div>
                    <dt>이메일</dt>
                    <dd>{profile.email}</dd>
                  </div>
                </dl>
              </div>
            </section>

            {message && (
              <p className="mypage-message" role="status">
                {message}
              </p>
            )}

            <section
              className="mypage-favorites"
              aria-labelledby="mypage-favorites-title"
            >
              <h2 id="mypage-favorites-title">내 즐겨찾기</h2>

              <div className="mypage-empty">
                아직 연결된 즐겨찾기 영화가 없어요.
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
