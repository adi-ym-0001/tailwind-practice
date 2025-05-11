import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import * as React from "react";
import { ProjectList } from "./ProjectList";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectForm } from "./ProjectForm";
import "../styles/index.css";
import { createRoute } from "@tanstack/react-router";
import { RootRoute } from "../../../router/RootRoute";
import { Input } from "@/components/ui/input";

const ProjectMng = () => {
	const [selectedRows, setSelectedRows] = React.useState<
		Record<string, boolean>
	>({}); // 各行のチェック有無
	const [showSearchBox, setShowSearchBox] = React.useState(false); // 検索エリア開閉管理

	const [query, setQuery] = React.useState("");// 検索値

	// 選択されている行の数をカウント
	const selectedCount = Object.values(selectedRows).filter(Boolean).length;

	return (
		<>
			<Card className="p-4 h-[97%] w-[97%]">
				<Tabs defaultValue="project">
					<CardHeader>
						<div className="flex justify-between items-center">
							{/* タイトル */}
							<div className="flex items-center gap-3 mb-">
								<CardTitle>案件管理</CardTitle>
								<div
									className="flex items-center rounded-xl border border-gray-300 text-gray-500 py-1 px-2 cursor-pointer hover:bg-gray-200"
									onClick={() => setShowSearchBox(!showSearchBox)}
								>
									<Search className="h-4 w-4" />
									{showSearchBox ? (
										<p className="text-xs">フィルタを隠す</p>
										) : (
										<p className="text-xs">フィルタを表示</p>
									)}
								</div>
							</div>
							{/* 新規登録、編集、削除ボタン */}
							<div className="flex gap-2">
								{/* チェックが0未満の時、新規登録ボタンを表示 */}
								{selectedCount <= 0 && (
									<Dialog>
										<DialogTrigger asChild>
											<Button className="border-blue-800 border-2 bg-white h-10 text-blue-800 cursor-pointer hover:bg-blue-100">
												<Plus className="h-4 w-4" />
												新規登録
											</Button>
										</DialogTrigger>
										{/* 新規登録フォーム */}
										<ProjectForm selectedRows={{}} formType="new" />
									</Dialog>
								)}
								{/* チェックが１つの時、編集ボタンを表示 */}
								{selectedCount === 1 && (
									<Dialog>
										<DialogTrigger asChild>
											<Button className="bg-gray-300 h-10 text-gray-800 cursor-pointer hover:bg-gray-400">
												<Pencil className="h-4 w-4" />
												編集
											</Button>
										</DialogTrigger>
										{/* 編集フォーム */}
										<ProjectForm selectedRows={selectedRows} formType="edit" />
									</Dialog>
								)}
								{/* チェックが１つ以上の時、削除ボタンを表示 */}
								{selectedCount >= 1 && (
									<Dialog>
										<DialogTrigger asChild>
											<Button className="border-red-500 border-2 bg-white h-10 text-red-500 cursor-pointer hover:bg-red-100">
												<Trash2 className="h-4 w-4" />
												削除
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>案件の削除</DialogTitle>
												<DialogDescription>
													選択した案件を削除します。 この操作は元に戻せません。
												</DialogDescription>
											</DialogHeader>
											<DialogFooter>
												<DialogClose asChild>
													<Button variant="outline">キャンセル</Button>
												</DialogClose>
												<Button variant="destructive">削除</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								)}
							</div>
						</div>
						{showSearchBox && (
							<div className="bg-gray-100 h-20">
								<Input 
									type="text"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
        					placeholder="キーワードを入力"
									className="w-56 bg-white"
								/>
							</div>)}
						<TabsList className="bg-blue-100 h-7">
							<TabsTrigger value="project" className="text-gray-500 text-xs">
								案件一覧
							</TabsTrigger>
							<TabsTrigger value="history" className="text-gray-500 text-xs">
								変更履歴
							</TabsTrigger>
						</TabsList>
					</CardHeader>
					<CardContent>
						{/* 全画面表示した時にカードの縦幅が狭い、、、 */}
						<TabsContent
							value="project"
							// className="overflow-auto h-[72vh]"
						>
							{/* 案件リストを表示 */}
							<ProjectList
								selectedRows={selectedRows}
								setSelectedRows={setSelectedRows}
								query={query}
							/>
						</TabsContent>
						<TabsContent value="history">ここに変更履歴一覧表示</TabsContent>
					</CardContent>
				</Tabs>
			</Card>
		</>
	);
};

export const ProjectMngRoute = createRoute({
	getParentRoute: () => RootRoute,
	path: "/",
	component: ProjectMng,
});
