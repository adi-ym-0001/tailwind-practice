import { Link, useLocation } from "@tanstack/react-router";
import {
	ChartArea,
	ChevronDown,
	ClipboardList,
	Database,
	Handshake,
	Menu,
	UserRound,
} from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";

export const Layout = ({ children }: { children: React.ReactNode }) => {
	const location = useLocation();
	return (
		<>
			<header>
				<div className="bg-blue-900 flex justify-between items-center h-15 px-10 fixed w-full text-white">
					<Link
						to="/"
						className="text-xl"
						style={{ fontFamily: '"Mochiy Pop One", sans-serif' }}
					>
						操業管理
					</Link>
					<div className="flex items-center gap-4">
						<div className="hidden lg:flex gap-4">
							<Link
								to="/"
								className={`flex items-center gap-2 px-2 h-12 text-sm transition-all duration-100 ${
                location.pathname === "/" ? "border-b-2 border-yellow-500 font-normal" : "font-light"
								} hover:font-normal`}
							>
								<Handshake className="h-4 w-4" />
								案件管理
							</Link>
							<Link
								to="/dashboard"
								className={`flex items-center gap-2 px-2 h-12 text-sm transition-all duration-100 ${
									location.pathname === "/dashboard" ? "border-b-2 border-yellow-500 font-normal" : "font-light"
								} hover:font-normal`}
							>
								<ChartArea className="h-4 w-4" />
								ダッシュボード
							</Link>
							<Link
								to="/templates"
								className={`flex items-center gap-2 px-2 h-12 text-sm transition-all duration-100 ${
									location.pathname === "/templates" ? "border-b-2 border-yellow-500 font-normal" : "font-light"
								} hover:font-normal`}
							>
								<ClipboardList className="h-4 w-4" />
								テンプレート管理
							</Link>

							<DropdownMenu>
								<DropdownMenuTrigger className={`flex items-center gap-2 px-2 h-12 text-sm transition-all duration-100 font-light hover:font-normal`}>
									<Database className="h-4 w-4" />
									マスタ管理
									<ChevronDown className="h-4 w-4" />
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem>
										<a href="#" className="text-xs">ファンクションマスタ</a>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<a href="#" className="text-xs">外注マスタ</a>
									</DropdownMenuItem>
									<DropdownMenuItem>
										<a href="#" className="text-xs">外作マスタ</a>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<Button className="text-white border-2 bg-blue-900 h-10 shadow-md cursor-pointer hover:bg-blue-800">
							<UserRound className="h-4 w-4" />
							工数内訳算出
						</Button>

						{/* レスポンシブのサイドメニュー */}
						<Sheet>
							<SheetTrigger asChild>
								<button
									type="button"
									className="block lg:hidden cursor-pointer ml-2"
								>
									<Menu className="h-4 w-4" />
								</button>
							</SheetTrigger>
							<SheetContent className="text-blue-800 p-6">
								<Link
									to="/"
									className={`flex items-center gap-2 h-12 text-sm transition-all duration-100 ${
										location.pathname === "/" ? "font-medium text-blue-600" : "font-normal"
									} hover:font-medium`}
								>
									<Handshake className="h-4 w-4" />
									案件管理
								</Link>
								<Link
									to="/dashboard"
									className={`flex items-center gap-2 h-12 text-sm transition-all duration-100 ${
										location.pathname === "/dashboard" ? "font-medium text-blue-600" : "font-normal"
									} hover:font-medium`}
								>
									<ChartArea className="h-4 w-4" />
									ダッシュボード
								</Link>
								<Link
									to="/templates"
									className={`flex items-center gap-2 h-12 text-sm transition-all duration-100 ${
										location.pathname === "/templates" ? "font-medium text-blue-600" : "font-normal"
									} hover:font-medium`}
								>
									<ClipboardList className="h-4 w-4" />
									テンプレート管理
								</Link>
								<Link
									to="/masters"
									className={`flex items-center gap-2 h-12 text-sm transition-all duration-100 ${
										location.pathname === "/masters" ? "font-medium text-blue-600" : "font-normal"
									} hover:font-medium`}
								>
									<Database className="h-4 w-4" />
									マスタ管理
								</Link>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</header>
			<main>
				<div className="bg-blue-50 flex justify-center items-center pt-15 h-screen">
					{children}
				</div>
			</main>
		</>
	);
};
