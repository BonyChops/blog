// src/ImageRenderers.tsx
/** biome-ignore-all lint/correctness/useJsxKeyInIterable: <explanation> */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type {
	BlogPageData,
	DocsPageData,
	ImageRenderer,
	PageData,
} from "@acid-info/docusaurus-og";
import React from "react";
import Default from "./Default";
import WithTitle from "./WithTitle";

export const blog: ImageRenderer<BlogPageData> = (data) => {
	if (data.pageType !== "post") {
		return [
			<Default />,
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

	const { title, frontMatter } = data.data.metadata;
	const { advent: _advent } = frontMatter;

	const advent =
		typeof _advent === "string"
			? _advent
			: typeof _advent === "number"
				? _advent.toString()
				: undefined;

	return [
		<WithTitle title={title} advent={advent} />,
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
