import { createFileRoute } from "@tanstack/react-router";
import { EditProfilePage } from "../../pages/members/edit-profile-page";

export const Route = createFileRoute("/(member)/_authenticated/mypage/edit")({
  component: EditProfilePage,
});