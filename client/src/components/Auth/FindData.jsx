import React from "react";

function FindData({ onClick, getKaryawanByKtp, oneData }) {
	const innitialValue = {
		ktp: "",
	};

	const [state, setState] = React.useState(innitialValue);

	const changeHandler = (e) => {
		setState((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
	};

	const submitHandler = (e) => {
		e.preventDefault();
		getKaryawanByKtp(state.ktp);
		onClick();
	};

	return (
		<div className="landingPop">
			<div className="modalBackground" onClick={onClick}></div>
			<div className="modalContainer">
				<div className="modalCloser pointer" onClick={onClick}>
					<i className="fas fa-times"></i>
				</div>
				<div className="modalTitle">
					<span>
						<strong>Check Data</strong>
					</span>
				</div>
				<div className="formContainer">
					<form onSubmit={submitHandler}>
						<div className="mb-1">
							<input type="text" className="form-control" name="ktp" value={state.ktp} placeholder="KTP" onChange={changeHandler} required />
						</div>
						<div className="mb-1">
							<button type="submit" className="btn bg-second">
								Check
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default FindData;
