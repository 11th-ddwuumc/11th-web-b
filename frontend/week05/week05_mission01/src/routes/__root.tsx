import { Outlet, createRootRoute } from "@tanstack/react-router";
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="mx-auto flex min-h-screen w-[1440px] flex-col bg-page">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
