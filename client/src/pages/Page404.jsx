import React from "react";
import useWindowDimensions from "../components/ScreenSize";

function Page404() {
	const { width, height } = useWindowDimensions();
	return (
		<div className="mt-4 custom-navbar d-flex justify-content-center align-items-center" style={{ width, height }}>
			<h1>404 Page Not Found</h1>
		</div>
	);
}

export default Page404;
