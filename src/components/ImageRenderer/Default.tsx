export const Default = () => {
	return (
		<div
			style={{
				width: "1200px",
				height: "630px",
				fontSize: 72,
				background: "white",
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
		</div>
	);
};

export default Default;
