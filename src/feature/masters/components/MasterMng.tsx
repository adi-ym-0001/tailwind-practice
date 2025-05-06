import { createRoute } from "@tanstack/react-router";
import { RootRoute } from "../../../router/RootRoute";

const MasterMng = () => {
	return <>マスタ管理画面</>;
};

export const MasterMngRoute = createRoute({
	getParentRoute: () => RootRoute,
	path: "/masters",
	component: MasterMng,
});
