import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Layout } from "../components/Layout";

export const RootRoute = createRootRoute({
	component: () => (
		<Layout>
			<Outlet />
		</Layout>
	),
});
