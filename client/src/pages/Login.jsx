import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Loading from "../components/PopUps/Loading";
import PopUps from "../components/PopUps/PopUps";
import useWindowDimensions from "../components/ScreenSize";

function LoginPage({ Auth: { isLogin, userData }, PopUpState: { isPoped, loadingComp } }) {
	const { width, height } = useWindowDimensions();

	const innitialValue = {
		login: false,
		register: false,
	};

	const [state, setState] = useState(innitialValue);

	const showModal = (type) => {
		setState((prevState) => ({ ...prevState, [type]: !prevState[type] }));
	};
	
	// const startFind = async (ktp) => {
	// 	const response = await getKaryawanByKtp(ktp);
	// 	if (response === true) {
	// 		document.getElementById("showClick").click();
	// 	}
	// };

	return (
		<>
			{isLogin ?  <Redirect to="/" /> : null}
			{isPoped && <PopUps />}
			{loadingComp && <Loading />}
			{state.login && <Login onClick={() => showModal("login")} />}
			{state.register && <Register onClick={() => showModal("register")} />}
			<div className="home-container" style={{ width, height }}>
				<div className="wrapper" style={{ width: 0.9 * width, height: 0.9 * height }}>
					<div className="main-picture">
						<img src="https://picsum.photos/800/550" alt="gambar awal" className="main-image" />
					</div>
					<div className="login-side">
						<div className="text-center">
							<h3>Selamat Datang</h3>
						</div>
						<div className="shadow p-3 mb-5 bg-white rounded">
							<div className="card text-white bg-primer mb-3 main-item pointer">
								<div className="card-header text-center" onClick={() => showModal("login")}>
									Login
								</div>
							</div>
							<div className="card text-white bg-second mb-3 main-item pointer">
								<div className="card-header text-center" onClick={() => showModal("register")}>
									Register
								</div>
							</div>
							<button hidden data-toggle="modal" data-target="#addDataLabel" id="showClick"></button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

const mapStateToProps = (state) => ({
	Auth: state.Auth,
	PopUpState: state.PopUp,
});

const mapDispatchToProps = {  };

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
