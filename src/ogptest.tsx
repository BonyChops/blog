import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WithTitle from "./components/ImageRenderer/WithTitle";
import React from "react";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<div
			style={{
				width: "1200px",
				height: "630px",
			}}
		>
			<WithTitle
				advent="2025"
				title="おまえら禁じられたインデックスアクセスを平気で使ってんじゃねえか！わかってんのか？『ランタイムエラー』が生まれたのは人間がコンパイラオプションに甘えたせいだろうがよ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！"
			/>
		</div>
	</StrictMode>,
);
