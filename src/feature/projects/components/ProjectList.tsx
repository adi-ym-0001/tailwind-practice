import { Checkbox } from "@/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import { EllipsisVertical } from "lucide-react";
import React from "react";
import { usePjs } from "../hooks/usePjs";

// ユーザリストを表示するコンポーネント
export const ProjectList = ({
	selectedRows,
	setSelectedRows,
}: {
	selectedRows: Record<string, boolean>;
	setSelectedRows: React.Dispatch<
		React.SetStateAction<Record<string, boolean>>
	>;
}) => {
	const [selectAll, setSelectAll] = React.useState(false); // 全選択の状態を管理

	const queryClient = useQueryClient(); // クエリのキャッシュを管理するためのフック
	const { status, data, error } = usePjs(); // ユーザデータを取得

	// dataがnullやundefindでない時、ヘッダーのチェックボックス全選択/解除
	const handleSelectAllChange = (checked: boolean) => {
		if (Array.isArray(data)) {
			setSelectAll(checked);
			setSelectedRows(
				data.reduce(
					(acc, row) => {
						acc[row.pjCd] = checked; // 全ての行をチェック or チェック解除
						return acc;
					},
					{} as Record<string, boolean>,
				),
			);
		}
	};

	// 追加したい処理
	// キャッシュを保持してたらそのレコードのスタイル変更（色、太字）
	// バックグラウンド更新の表示
	return (
		<>
			{status === "pending" ? (
				"Loading..." // 読み込み中の表示
			) : status === "error" ? (
				<span>Error: {error.message}</span> // エラー発生時の表示
			) : (
				<Table>
					<TableHeader className="bg-gray-200">
						<TableRow>
							<TableHead>
								<Checkbox
									checked={selectAll}
									onCheckedChange={(checked) =>
										handleSelectAllChange(!!checked)
									}
									className="bg-white"
								/>
							</TableHead>
							<TableHead>BU</TableHead>
							<TableHead>年度</TableHead>
							<TableHead>計画区分</TableHead>
							<TableHead>工事種別</TableHead>
							<TableHead>地域</TableHead>
							<TableHead>案件名</TableHead>
							<TableHead>顧客名</TableHead>
							<TableHead>略称</TableHead>
							<TableHead>オーダー</TableHead>
							<TableHead>開始時期</TableHead>
							<TableHead>総MM</TableHead>
							<TableHead>全体工数</TableHead>
							<TableHead>内作活用比率</TableHead>
							<TableHead>内作工数</TableHead>
							<TableHead>外注活用比率</TableHead>
							<TableHead>外注工数</TableHead>
							<TableHead>外作活用比率</TableHead>
							<TableHead>外作工数</TableHead>
							<TableHead>算出根拠</TableHead>
							<TableHead>変更理由</TableHead>
							<TableHead>備考</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((row) => (
							<TableRow key={row.pjCd}>
								<TableCell>
									<Checkbox
										checked={!!selectedRows[row.pjCd]}
										// prevは既存の状態（前回の状態）
										onCheckedChange={(checked) =>
											setSelectedRows((prev) => ({
												...prev,
												[row.pjCd]: !!checked,
											}))
										}
									/>
								</TableCell>
								<TableCell>{row.buName}</TableCell>
								<TableCell>{row.year}</TableCell>
								<TableCell>{row.planSecName}</TableCell>
								<TableCell>{row.constTypeName}</TableCell>
								<TableCell>{row.regionName}</TableCell>
								<TableCell>{row.pjName}</TableCell>
								<TableCell>{row.customerName}</TableCell>
								<TableCell>{row.abbreviation}</TableCell>
								<TableCell>{row.order}</TableCell>
								<TableCell>{row.startDate}</TableCell>
								<TableCell>{row.totalMM}カ月</TableCell>
								<TableCell>{row.totalConst.toLocaleString()}</TableCell>
								<TableCell>
									{(row.utilizationRate.inhouse * 100).toFixed(1)}%
								</TableCell>
								<TableCell>{row.workHours.inhouse.toLocaleString()}</TableCell>
								<TableCell>
									{(row.utilizationRate.outsourced * 100).toFixed(1)}%
								</TableCell>
								<TableCell>
									{row.workHours.outsourced.toLocaleString()}
								</TableCell>
								<TableCell>
									{(row.utilizationRate.external * 100).toFixed(1)}%
								</TableCell>
								<TableCell>{row.workHours.external.toLocaleString()}</TableCell>
								<TableCell>{row.calculationBasis}</TableCell>
								<TableCell>{row.changeReason}</TableCell>
								<TableCell>{row.remarks}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</>
	);
};
