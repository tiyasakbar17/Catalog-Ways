import React from "react";

function TableActions({ changeHandler, restoreHandler, cancelHandler, show }) {
	return (
		<div className="actions">
			<form className="form-inline my-2 my-lg-0 custom-search">
				<input className="form-control mr-sm-2" type="text" name="keyword" onChange={changeHandler} placeholder="Search" />
			</form>
			{show === true ? (
				<>
					<div className="form-switch">
						<label className="switch">
							<input type="checkbox" name="restore" onChange={restoreHandler} />
							<span className="slider round"></span>
						</label>
						<span className="h5 ml-2">Restore Data</span>
					</div>
					<div className="register-new">
						<button className="btn bg-primer" data-toggle="modal" data-target="#addDataLabel" onClick={cancelHandler}>
							Add Data
						</button>
					</div>
				</>
			) : null}
		</div>
	);
}

export default TableActions;
