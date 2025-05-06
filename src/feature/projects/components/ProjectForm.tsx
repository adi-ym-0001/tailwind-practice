import { Button } from "@/components/ui/button";
import {
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { type AnyFieldApi, useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import * as v from "valibot";
import type { Project } from "../types/project";
import { usePj } from "../hooks/usePj";

// バリデーションのスキーマを定義
const Schema = v.object({
	// 案件コード
	pjCd: v.pipe(v.string(), v.nonEmpty()),
	// BUコード
	buCd: v.pipe(v.string(), v.nonEmpty()),
	// BU名
	buName: v.pipe(v.string(), v.nonEmpty()),
	// 年度
	year: v.pipe(v.number(), v.minValue(2025)),
	// 計画区分コード
	planSecCd: v.pipe(v.string(), v.nonEmpty()),
	// 計画区分名
	planSecName: v.pipe(v.string(), v.nonEmpty()),
	// 工事種別コード
	constTypeCd: v.pipe(v.string(), v.nonEmpty()),
	// 工事種別名
	constTypeName: v.pipe(v.string(), v.nonEmpty()),
	// 地域コード
	regionCd: v.pipe(v.string(), v.nonEmpty()),
	// 地域名
	regionName: v.pipe(v.string(), v.nonEmpty(), v.regex(/^[^0-9]*$/)),
	// 案件名
	pjName: v.pipe(v.string(), v.nonEmpty()),
	// 顧客コード
	customerCd: v.pipe(v.string(), v.nonEmpty()),
	// 顧客名
	customerName: v.pipe(v.string(), v.nonEmpty()),
	// 通称・略称
	abbreviation: v.pipe(v.string(), v.nonEmpty()),
	// オーダー
	order: v.pipe(v.string(), v.nonEmpty()),
	// 開始時期
	startDate: v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/)),
	// 総MM[カ月]
	totalMM: v.pipe(v.number(), v.minValue(1), v.notValue(1)),
	// 全体工数
	totalConst: v.pipe(v.number(), v.minValue(0)),
	utilizationRate: v.object({
		// 内作活用比率
		inhouse: v.pipe(v.number(), v.minValue(0)),
		// 外注活用比率
		outsourced: v.pipe(v.number(), v.minValue(0)),
		// 外作活用比率
		external: v.pipe(v.number(), v.minValue(0)),
	}),
	workHours: v.object({
		// 内作工数
		inhouse: v.pipe(v.number(), v.minValue(0)),
		// 外注工数
		outsourced: v.pipe(v.number(), v.minValue(0)),
		// 外作工数
		external: v.pipe(v.number(), v.minValue(0)),
	}),
	// 算出根拠
	calculationBasis: v.pipe(v.string()),
	// 変更理由
	changeReason: v.pipe(v.string()),
	// 備考
	remarks: v.pipe(v.string()),
});

// 案件の詳細を表示するコンポーネント
export const ProjectForm = ({
	selectedRows,
	formType,
}: {
	selectedRows: Record<string, boolean>;
	formType: string;
}) => {
	// 選択された行の案件コード取得
	const selectedPjCd = Object.keys(selectedRows).filter(
		(key) => selectedRows[key],
	)[0];

	// 新規登録の初期値
	const initDefaultValues = {
		pjCd: "",
		buCd: "",
		buName: "",
		year: 2000,
		planSecCd: "",
		planSecName: "",
		constTypeCd: "",
		constTypeName: "",
		regionCd: "",
		regionName: "",
		pjName: "",
		customerCd: "",
		customerName: "",
		abbreviation: "",
		order: "",
		startDate: "",
		totalMM: 0,
		totalConst: 0,
		utilizationRate: {
			inhouse: 0,
			outsourced: 0,
			external: 0,
		},
		workHours: {
			inhouse: 0,
			outsourced: 0,
			external: 0,
		},
		calculationBasis: "",
		changeReason: "",
		remarks: "",
	};

	const [defaultValues, setDefaultValues] =
		useState<Project>(initDefaultValues);
	const [statusVar, setStatusVar] = useState<string>("idle");
	const [errorVar, setErrorVar] = useState<Error | null>(null);

	// １レコードの案件データを取得
	const { status, data, error } = usePj(
		formType === "edit" ? selectedPjCd : "",
	);

	// 新規登録か編集か判定
	useEffect(() => {
		if (formType === "new") {
			// 新規登録の初期値設定
			setDefaultValues(initDefaultValues);
			setStatusVar("success");
		} else if (formType === "edit") {
			// １レコードの案件データを取得
			// const { status, data, error, isFetching } = usePj(selectedPjDc);
			setStatusVar(status);
			setErrorVar(error);
			if (data) {
				// フォームに既存の値を設定
				setDefaultValues({
					pjCd: data?.pjCd,
					buCd: data?.buCd,
					buName: data?.buName,
					year: data?.year,
					planSecCd: data?.planSecCd,
					planSecName: data?.planSecName,
					constTypeCd: data?.constTypeCd,
					constTypeName: data?.constTypeName,
					regionCd: data?.regionCd,
					regionName: data?.regionName,
					pjName: data?.pjName,
					customerCd: data?.customerCd,
					customerName: data?.customerName,
					abbreviation: data?.abbreviation,
					order: data?.order,
					startDate: data?.startDate,
					totalMM: data?.totalMM,
					totalConst: data?.totalConst,
					utilizationRate: {
						inhouse: data?.utilizationRate.inhouse,
						outsourced: data?.utilizationRate.outsourced,
						external: data?.utilizationRate.external,
					},
					workHours: {
						inhouse: data?.workHours.inhouse,
						outsourced: data?.workHours.outsourced,
						external: data?.workHours.external,
					},
					calculationBasis: data?.calculationBasis,
					changeReason: data?.changeReason,
					remarks: data?.remarks,
				});
			}
		}
	}, [formType, status, data, error]);

	// Tanstack Formのインスタンス生成
	const form = useForm({
		defaultValues: defaultValues,
		validators: {
			// バリデーションを非同期で実行
			onChangeAsync: Schema,
			// バリデーションを実行する頻度を制御
			onChangeAsyncDebounceMs: 500,
		},
		onSubmit: ({ value }) => {
			// データ送信された時の処理
			alert(JSON.stringify(value, null, 2));
		},
	});

	// 追加したい処理
	// バックグラウンド更新の表示
	return (
		// 案件新規登録/編集フォーム
		<DialogContent className="min-h-[75%] sm:w-3xl min-w-xl">
			<Tabs defaultValue="basic">
				<DialogHeader className="border-b pb-1 border-gray-200">
					<DialogTitle className="pb-2">
						{formType === "edit" ? "案件の編集" : "新規登録"}
					</DialogTitle>
					<TabsList className="bg-blue-100 h-8">
						<TabsTrigger value="basic" className="text-gray-500">
							基本情報
						</TabsTrigger>
						<TabsTrigger value="function" className="text-gray-500">
							ファンクション別工数内訳
						</TabsTrigger>
						<TabsTrigger value="outsourced" className="text-gray-500">
							外注工数内訳
						</TabsTrigger>
						<TabsTrigger value="external" className="text-gray-500">
							外作工数内訳
						</TabsTrigger>
					</TabsList>
				</DialogHeader>
				{statusVar === "pending" ? (
					"Loading..." // 読み込み中
				) : statusVar === "error" ? (
					<span>Error: {errorVar?.message}</span> // エラー発生時
				) : (
					<form
						onSubmit={(e) => {
							e.preventDefault(); // デフォルトのフォーム送信動作を防止
							e.stopPropagation(); // イベント伝播を停止
							form.handleSubmit(); // フォーム送信処理を実行
						}}
					>
						<TabsContent value="basic" className="flex flex-col max-h-[90%]">
							<div className="overflow-auto flex-grow max-h-[60vh] px-6 pb-[10%]">
								<div>
									{/* form.FieldはTanstack Formの機能 */}
									<form.Field name="buName">
										{(field) => (
											<>
												<Label htmlFor="buName" className="py-3">
													BU
												</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													required
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									<form.Field name="year">
										{(field) => (
											<>
												<Label htmlFor="year" className="py-3">
													年度
												</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => {
														const value = e.target.value;
														// 数値として有効な場合のみ更新
														if (!Number.isNaN(Number(value)) && value !== "") {
															field.handleChange(Number(value));
														} else {
															field.handleChange(0); // 無効な入力の場合は空文字を設定
														}
													}}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									{/* form.FieldはTanstack Formの機能 */}
									<form.Field name="planSecName">
										{(field) => (
											<>
												<Label htmlFor="planSecName" className="py-3">
													計画区分
												</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									<form.Field name="constTypeName">
										{(field) => (
											<>
												<Label htmlFor="constTypeName" className="py-3">
													工事種別
												</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									<form.Field name="regionName">
										{(field) => (
											<>
												<Label htmlFor="regionName" className="py-3">
													地域
												</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									<form.Field name="pjName">
										{(field) => (
											<>
												<Label htmlFor="pjName" className="py-3">
													案件名
												</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									<form.Field name="customerName">
										{(field) => (
											<>
												<Label htmlFor="customerName" className="py-3">
													顧客名
												</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									<form.Field name="abbreviation">
										{(field) => (
											<>
												<Label htmlFor="abbreviation" className="py-3">
													略称
												</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									<form.Field name="order">
										{(field) => (
											<>
												<Label htmlFor="order" className="py-3">
													オーダー
												</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									<form.Field name="startDate">
										{(field) => (
											<>
												<Label htmlFor="startDate" className="py-3">
													開始時期
												</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									<form.Field name="totalMM">
										{(field) => (
											<>
												<Label htmlFor="totalMM" className="py-3">
													総MM
												</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => {
														const value = e.target.value;
														// 数値として有効な場合のみ更新
														if (!Number.isNaN(Number(value)) && value !== "") {
															field.handleChange(Number(value));
														} else {
															field.handleChange(0); // 無効な入力の場合は空文字を設定
														}
													}}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									<form.Field name="totalConst">
										{(field) => (
											<>
												<Label htmlFor="totalConst" className="py-3">
													全体工数
												</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => {
														const value = e.target.value;
														// 数値として有効な場合のみ更新
														if (!Number.isNaN(Number(value)) && value !== "") {
															field.handleChange(Number(value));
														} else {
															field.handleChange(0); // 無効な入力の場合は空文字を設定
														}
													}}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									<form.Field name="utilizationRate.inhouse">
										{(field) => (
											<>
												<Label
													htmlFor="utilizationRate.inhouse"
													className="py-3"
												>
													内作活用比率
												</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => {
														const value = e.target.value;
														// 数値として有効な場合のみ更新
														if (!Number.isNaN(Number(value)) && value !== "") {
															field.handleChange(Number(value));
														} else {
															field.handleChange(0); // 無効な入力の場合は空文字を設定
														}
													}}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									<form.Field name="workHours.inhouse">
										{(field) => (
											<>
												<Label htmlFor="workHours.inhouse" className="py-3">
													内作工数
												</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => {
														const value = e.target.value;
														// 数値として有効な場合のみ更新
														if (!Number.isNaN(Number(value)) && value !== "") {
															field.handleChange(Number(value));
														} else {
															field.handleChange(0); // 無効な入力の場合は空文字を設定
														}
													}}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									<form.Field name="utilizationRate.outsourced">
										{(field) => (
											<>
												<Label
													htmlFor="utilizationRate.outsourced"
													className="py-3"
												>
													外注活用比率
												</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => {
														const value = e.target.value;
														// 数値として有効な場合のみ更新
														if (!Number.isNaN(Number(value)) && value !== "") {
															field.handleChange(Number(value));
														} else {
															field.handleChange(0); // 無効な入力の場合は空文字を設定
														}
													}}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									<form.Field name="workHours.outsourced">
										{(field) => (
											<>
												<Label htmlFor="workHours.outsourced" className="py-3">
													外注工数
												</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => {
														const value = e.target.value;
														// 数値として有効な場合のみ更新
														if (!Number.isNaN(Number(value)) && value !== "") {
															field.handleChange(Number(value));
														} else {
															field.handleChange(0); // 無効な入力の場合は空文字を設定
														}
													}}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									<form.Field name="utilizationRate.external">
										{(field) => (
											<>
												<Label
													htmlFor="utilizationRate.external"
													className="py-3"
												>
													外作活用比率
												</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => {
														const value = e.target.value;
														// 数値として有効な場合のみ更新
														if (!Number.isNaN(Number(value)) && value !== "") {
															field.handleChange(Number(value));
														} else {
															field.handleChange(0); // 無効な入力の場合は空文字を設定
														}
													}}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									<form.Field name="workHours.external">
										{(field) => (
											<>
												<Label htmlFor="workHours.external" className="py-3">
													外作工数
												</Label>
												<Input
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => {
														const value = e.target.value;
														// 数値として有効な場合のみ更新
														if (!Number.isNaN(Number(value)) && value !== "") {
															field.handleChange(Number(value));
														} else {
															field.handleChange(0); // 無効な入力の場合は空文字を設定
														}
													}}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									<form.Field name="calculationBasis">
										{(field) => (
											<>
												<Label htmlFor="calculationBasis" className="py-3">
													算出根拠
												</Label>
												<Textarea
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									<form.Field name="changeReason">
										{(field) => (
											<>
												<Label htmlFor="changeReason" className="py-3">
													変更理由
												</Label>
												<Textarea
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
								<div>
									<form.Field name="remarks">
										{(field) => (
											<>
												<Label htmlFor="remarks" className="py-3">
													備考
												</Label>
												<Textarea
													id={field.name}
													name={field.name}
													value={field.state.value}
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
												/>
												{/* エラーメッセージ */}
												<FieldInfo field={field} />
											</>
										)}
									</form.Field>
								</div>
							</div>
						</TabsContent>
						<TabsContent value="function">
							ファンクション別工数内訳のフォーム
						</TabsContent>
						<TabsContent value="outsourced">外注工数内訳のフォーム</TabsContent>
						<TabsContent value="external">外作工数内訳のフォーム</TabsContent>
						<DialogFooter className="border-t border-gray-200 absolute bottom-0 left-0 w-full p-4 bg-white">
							<DialogClose asChild>
								<Button variant="outline" className="cursor-pointer">
									キャンセル
								</Button>
							</DialogClose>
							{/* <form.Subscribe />は、フォームの状態をsubscribeするコンポーネント */}
							{/* データが流れてきた時になんかの処理を実行する */}
							{/* <form.Subscribe />は、フォームの状態をsubscribeするコンポーネントです。 */}
							{/* サブミット可能かどうかはcanSubmitで, サブミット中かどうかはisSubmittingをsubscribeし、ボタンの状態を制御しています。 */}
							{/* subscribeしている値が変更されるたびに、<form.Subscribe />内の要素のみが再レンダリングされます */}
							<form.Subscribe
							// selector={(state) => [state.canSubmit, state.isSubmitting]}
							>
								{/* {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              )} */}
								<Button
									type="submit"
									className="cursor-pointer bg-blue-700 hover:bg-blue-600"
								>
									更新
								</Button>
							</form.Subscribe>
						</DialogFooter>
					</form>
				)}
			</Tabs>
		</DialogContent>
	);
};

const FieldInfo = ({ field }: { field: AnyFieldApi }) => {
	return (
		<>
			{/* isTouched:ユーザーがフィールドにタップ、タッチした後 */}
			{/* isPristine:ユーザーが値を変更するまで */}
			{/* isDirty:ユーザーが値を変更した後 */}
			{field.state.meta.isDirty && field.state.meta.errors.length ? (
				<p className="text-red-500 text-sm mt-1">
					{field.state.meta.errors.map((err) => err.message).join(",")}
				</p>
			) : null}
			{field.state.meta.isValidating ? "Validating..." : null}
		</>
	);
}
