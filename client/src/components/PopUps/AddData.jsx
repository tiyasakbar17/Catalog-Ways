import React from "react";

function AddData({ title, children, actions, type, cancelAction, viewOnly }) {
	return (
		<div className="modal" id="addDataLabel" tabIndex="-1" role="dialog" aria-labelledby="addDataLabel" aria-hidden="true">
			<div className="modal-dialog modal-dialog-scrollable" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">
							{type === "edit" ? "Edit" : type === "view" ? "View" : "Register new"} {title}
						</h5>
						<button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={cancelAction}>
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div className="modal-body">{children}</div>
					{viewOnly === true ? null : (
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={cancelAction}>
								Cancel
							</button>
							<button type="submit" className="btn bg-primer" data-dismiss="modal" onClick={actions}>
								Save
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default AddData;
