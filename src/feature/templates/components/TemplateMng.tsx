import { createRoute } from "@tanstack/react-router";
import { RootRoute } from "../../../router/RootRoute";

const TemplateMng = () => {
	return <>テンプレート管理画面</>;
};

export const TemplateMngRoute = createRoute({
	getParentRoute: () => RootRoute,
	path: "/templates",
	component: TemplateMng,
});
