import { faTree, type IconDefinition } from "@fortawesome/free-solid-svg-icons";
import type { FragmentProps } from "react";

type FaSvgIconProps = {
	icon: IconDefinition;
	/** 幅・高さ両方に適用するサイズ（例: 24, "1em", "32px"） */
	size?: number;
	/** アクセシビリティ用のタイトル。省略すると aria-hidden になります。 */
	title?: string;
} & React.SVGProps<SVGSVGElement>;

export const FaSvgIcon: React.FC<FaSvgIconProps> = ({
	icon,
	size = 24,
	title,
	...rest
}) => {
	const [w, h, , , svgPathData] = icon.icon;

	// Path が複数ある可能性があるので配列化
	const paths = Array.isArray(svgPathData) ? svgPathData : [svgPathData];

	return (
		<svg
			viewBox={`0 -32 ${w} ${h + 32}`}
			width={size}
			height={size}
			fill="currentColor"
			role={"presentation"}
			{...rest}
		>
			{paths.map((d, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: 仕方ないため
				<path key={i} d={d} />
			))}
		</svg>
	);
};

const WithTitle = ({ title, advent }: { title: string; advent?: string }) => {
	return (
		<RedFrame advent={advent}>
			{title && (
				<p
					style={{
						fontSize: "60px",
						margin: "0px",
						maxWidth: "100%",
					}}
				>
					{title}
				</p>
			)}
			{advent && (
				<FaSvgIcon
					icon={faTree}
					style={{
						opacity: 0.3,
						transform: "rotate(20deg)",
						position: "absolute",
						bottom: -100,
						right: -100,
					}}
					size={400}
				/>
			)}
		</RedFrame>
	);
};

export const RedFrame: React.FC<FragmentProps & { advent?: string }> = ({
	children,
	advent,
}) => {
	return (
		<div
			style={{
				// ※フレーム用コンテナ
				display: "flex",
				flexDirection: "column",
				backgroundColor: advent ? "#C41E3A" : "white",
				paddingRight: 40, // 右の縁の太さ
				paddingLeft: 40, // 左の縁の太さ
				borderRadius: 0, // 外側は角丸にしない
				width: "100%",
				height: "100%",
				maxHeight: "100%",
				color: "white",
				position: "relative",
				alignItems: "center",
				minWidth: "0px",
			}}
		>
			<div
				style={{
					display: "flex",
					height: "70px",
					alignItems: "center",
				}}
			>
				{advent && (
					<p
						style={{
							fontSize: "45px",
							flexShrink: 0,
							minWidth: "0px",
							margin: "0px",
							textAlign: "center",
						}}
					>
						Advent Calendar {advent}
					</p>
				)}
			</div>
			<div
				style={{
					// ※中身 + 内側の角丸
					backgroundColor: "white", // 中身の背景（透過したければ 'transparent'）
					color: "black",
					borderRadius: 24, // 内側だけ角丸
					padding: 24, // 中身の余白
					boxSizing: "border-box",
					width: "100%",
					overflow: "hidden",
					minHeight: "0px",
					position: "relative",
					flexGrow: 1,
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{children}
			</div>
			<p
				style={{
					display: "flex",
					position: "relative",
					fontSize: 46,
					color: advent ? "white" : "black",
					margin: "0px",
					padding: "20px",
					flexShrink: 0,
					minWidth: "0px",
				}}
			>
				<img
					style={{
						borderRadius: 60,
						marginRight: 20,
					}}
					src="https://github.com/BonyChops.png"
					alt="BonyChops"
					width={64}
					height={64}
				/>
				Blog
			</p>
		</div>
	);
};

export default WithTitle;
