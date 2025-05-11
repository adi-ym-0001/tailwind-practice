import { Checkbox } from "@/components/ui/checkbox";
import {
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { usePjs } from "../hooks/usePjs";
import { cn } from "@/lib/utils";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from "@/components/ui/pagination";

// ユーザリストを表示するコンポーネント
export const ProjectList = ({
	selectedRows,
	setSelectedRows,
	query
}: {
	selectedRows: Record<string, boolean>;
	setSelectedRows: React.Dispatch<
		React.SetStateAction<Record<string, boolean>>
	>;
	query:string
}) => {
	const [selectAll, setSelectAll] = React.useState(false); // 全選択の状態を管理

	const queryClient = useQueryClient(); // クエリのキャッシュを管理するためのフック

	const { status, data, error } = usePjs(query); // ユーザデータを取得

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
				<div className="relative overflow-auto h-[72vh]">
					<Table>
						<TableHeader className="sticky top-0 bg-gray-200">
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
							{data.data.map((row) => (
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
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious href="#" />
							</PaginationItem>
							<PaginationItem>
								<PaginationLink href="#">1</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
							<PaginationItem>
								<PaginationNext href="#" />
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}
		</>
	);
};

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    // `forwardRef` を使用して、親コンポーネントから `ref` を渡せるようにする
    <table
      ref={ref} // `ref` を `table` 要素に渡すことで、外部から DOM にアクセス可能
      className={cn('w-full caption-bottom text-sm', className)} // `cn` で `className` を適切に結合
      {...props} // その他の HTML 属性を `table` 要素に適用
    />
  )
);

// `displayName` を設定すると、React DevTools などでコンポーネント名がわかりやすくなる
Table.displayName = 'Table';
