import { useQuery } from "@tanstack/react-query";
import type { Project } from "../types/project";

// 特定のユーザを取得するカスタムフック
export const usePj = (pjCd: string) => {
	return useQuery({
		queryKey: ["pj", pjCd], // クエリキー（個別のユーザ用）
		queryFn: async (): Promise<Project> => {
			try {
				const response = await fetch(`http://localhost:3000/projects/${pjCd}`);
				// if (!response) {
				//   throw new Error(`HTTP status: ${response.status}`);
				// }
				return await response.json();
			} catch (error) {
				console.error("Fetch error:", error);
				throw error;
			}
		},
		enabled: !!pjCd, // postId が存在するときのみ実行
	});
}