// src/ImageRenderers.tsx
/** biome-ignore-all lint/correctness/useJsxKeyInIterable: <explanation> */
import type {
	BlogPageData,
	DocsPageData,
	ImageRenderer,
	PageData,
} from "@acid-info/docusaurus-og";
import { readFileSync } from "fs";
import { join } from "path";
import React from "react";

export const blog: ImageRenderer<BlogPageData> = (data, context) => {
	if (data.pageType !== "post") {
		return [
			<div
				style={{
					fontSize: 72,
					background: "white",
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					color: "black",
				}}
			>
				<img
					style={{
						borderRadius: 60,
						marginRight: 30,
					}}
					src="https://github.com/BonyChops.png"
					alt="BonyChops"
					width={96}
					height={96}
				/>
				<p>Blog</p>
			</div>,
			{
				width: 1200,
				height: 630,
				fonts: [
					{
						name: "Noto Sans JP",
						data: readFileSync(
							join(__dirname, "../../../static/fonts/MPLUS1p-Bold.ttf"),
						),
						weight: 400,
						style: "normal",
					},
				],
			},
		];
	}
	const title = data?.data?.metadata?.title ?? "Untitled";

	return [
		<div
			style={{
				fontSize: 72,
				background: "white",
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div
				style={{
					display: "flex",
					color: "black",
				}}
			>
				<p>{title}</p>
			</div>
			<p
				style={{
					display: "flex",
					position: "absolute",
					bottom: 10,
					fontSize: 46,
					color: "black",
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
		</div>,
		{
			width: 1200,
			height: 630,
			fonts: [
				{
					name: "Noto Sans JP",
					data: readFileSync(
						join(__dirname, "../../../static/fonts/MPLUS1p-Bold.ttf"),
					),
					weight: 400,
					style: "normal",
				},
			],
		},
	];
};
