import { useQuery } from "@tanstack/react-query";
import type { Project } from "../types/project";

// すべてのユーザを取得するカスタムフック
export const usePjs = () => {
	return useQuery({
		queryKey: ["pjs"], // クエリキー (キャッシュの識別)
		// Promise:完了するまで待つ
		// async → 関数が Promise を返すようにする
		// Promise<User[]> → 取得したデータが 非同期で返されることを明示
		queryFn: async (): Promise<Array<Project>> => {
			try {
				// await → API呼び出しなどの 非同期処理の完了を待つ
				const response = await fetch("http://localhost:3000/projects");
				// if (!response) {
				//   throw new Error(`HTTP status: ${response.status}`);
				// }
				return await response.json(); // APIから投稿データを取得し、JSON に変換
			} catch (error) {
				console.error("Fetch error:", error);
				throw error;
			}
		},
	});
}