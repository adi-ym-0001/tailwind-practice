import { createRoute } from "@tanstack/react-router";
import { RootRoute } from "../../../router/RootRoute";

const DashboardMng = () => {
	return <>ダッシュボード画面</>;
};

export const DashboardMngRoute = createRoute({
	getParentRoute: () => RootRoute,
	path: "/dashboard",
	component: DashboardMng,
});
