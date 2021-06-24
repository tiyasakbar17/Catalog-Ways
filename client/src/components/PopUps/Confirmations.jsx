import React from "react";

function Confirmations({ title, message, actions }) {
	return (
		<div className="modal" id="modalLabel" tabIndex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
			<div className="modal-dialog modal-dialog-scrollable" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">
							{title}
						</h5>
						<button type="button" className="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div className="modal-body">{message}</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-secondary" data-dismiss="modal">
							No
						</button>
						<button type="button" className="btn btn-primary" data-dismiss="modal" onClick={actions}>
							Yes
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Confirmations;
