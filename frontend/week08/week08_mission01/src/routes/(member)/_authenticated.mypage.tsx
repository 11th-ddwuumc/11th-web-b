import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "../../pages/members/my-page";

export const Route = createFileRoute("/(member)/_authenticated/mypage")({
  component: MyPage,
});