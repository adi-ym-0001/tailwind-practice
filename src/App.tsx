import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { DashboardMngRoute } from "./feature/dashboard/components/DashboardMng";
import { MasterMngRoute } from "./feature/masters/components/MasterMng";
import { ProjectMngRoute } from "./feature/projects/components/ProjectMng";
import { TemplateMngRoute } from "./feature/templates/components/TemplateMng";
import { RootRoute } from "./router/RootRoute";

// データをキャッシュして、すぐに再利用できるようにする
// gcTime を 24時間 に設定 → 古くなったデータは自動的に削除
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			gcTime: 1000 * 60 * 60 * 24, // キャッシュのガーベージコレクション時間 (24時間)
		},
	},
});

// キャッシュをローカルストレージに保存するための設定
// ページをリロードしてもデータを保持できる
const persister = createSyncStoragePersister({
	storage: window.localStorage, // ローカルストレージを使用
});

function App() {
	const router = createRouter({
		routeTree: RootRoute.addChildren([
			ProjectMngRoute,
			DashboardMngRoute,
			TemplateMngRoute,
			MasterMngRoute,
		]),
	});

	return (
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{ persister }} // クエリの永続化を設定
		>
			<RouterProvider router={router} />
		</PersistQueryClientProvider>
	);
}

export default App;
