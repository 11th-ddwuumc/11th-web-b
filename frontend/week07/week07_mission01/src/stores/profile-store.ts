import { create } from "zustand";

interface Profile {
  nickname: string;
  email: string;
  imageUrl: string;
}

interface ProfileStore extends Profile {
  updateProfile: (profile: Profile) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  nickname: "영화러버",
  email: "movie@example.com",
  imageUrl: "",

  updateProfile: (profile) => {
    set(profile);
  },
}));
