// レスポンスデータの型定義
interface UtilizationRate {
	inhouse: number;
	outsourced: number;
	external: number;
}

interface WorkHours {
	inhouse: number;
	outsourced: number;
	external: number;
}

export interface Project {
	pjCd: string;
	buCd: string;
	buName: string;
	year: number;
	planSecCd: string;
	planSecName: string;
	constTypeCd: string;
	constTypeName: string;
	regionCd: string;
	regionName: string;
	pjName: string;
	customerCd: string;
	customerName: string;
	abbreviation: string;
	order: string;
	startDate: string; // 文字列として扱う場合
	totalMM: number;
	totalConst: number;
	utilizationRate: UtilizationRate;
	workHours: WorkHours;
	calculationBasis: string;
	changeReason: string;
	remarks: string;
}
