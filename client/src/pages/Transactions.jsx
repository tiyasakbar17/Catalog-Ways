import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddData from "../components/PopUps/AddData";
import { editOrder, getOrder } from "../redux/actions/Order";

const convert = (gaji) => {
	const stringGaji = gaji.toString(),
		sisaPanjang = stringGaji.length > 3 ? stringGaji.length % 3 : 0,
		//** insert personal data */
		newGaji = (sisaPanjang ? stringGaji.substr(0, sisaPanjang) + "." : "") + stringGaji.substr(sisaPanjang).replace(/(.{3})(?=.)/g, "$1" + ".");
	return newGaji;
};

function Transactions() {
	const initialState = {
		confirmation: {
			id: null,
		},
		formData: {
			status: "",
			edit: false,
		},
		type: "add",
	};
	const [state, setstate] = useState(initialState);
	const dispatch = useDispatch();
	const { data, pageNow, totalPage } = useSelector((state) => state.Order);

	const localGetOrder = ({ page }) => {
		dispatch(getOrder({ page, type: "all" }));
	};

	useEffect(() => {
		localGetOrder({ page: 1, type: "all" });
	}, [state.restore, state.keyword]);

	useEffect(() => {
		dispatch(getOrder({ page: 1, type: "all" }));
	}, []);

	const changeHandler = (event) => {
			setstate((prev) => ({ ...prev, [event.target.name]: event.target.value }));
		},
		changeFormHandler = (event) => {
			setstate((prev) => ({ ...prev, formData: { ...prev.formData, [event.target.name]: event.target.value } }));
		},
		editHandler = (item, type) => {
			const { id, status } = item;
			setstate((prev) => ({
				...prev,
				confirmation: { ...prev.confirmation, id },
				type,
				formData: {
					status,
					edit: status !== "Paid",
				},
			}));
		},
		cancelHandler = () => {
			setstate((prev) => ({ ...prev, confirmation: initialState.confirmation, type: "add", formData: initialState.formData }));
		},
		editItemHandle = () => {
			const formData = new FormData();
			formData.append("id", state.confirmation.id);
			formData.append("status", state.formData.status);
			dispatch(editOrder(formData));
			setstate(initialState);
		},
		openImage = (url) => {
			const newWindow = window.open(url, "_blank", "noopener,noreferrer");
			if (newWindow) newWindow.opener = null;
		};

	return (
		<div className="mt-4 custom-navbar">
			<AddData title="Order" type={state.type} actions={editItemHandle} cancelAction={cancelHandler}>
				<>
					<form>
						<label className="mt-1">Category</label>
						<select disabled={state.formData.edit} name="status" onChange={changeFormHandler} value={state.formData.status} className="form-control" required>
							<option>Select</option>
							<option value="Done">Done</option>
							<option value="Failed">Failed</option>
						</select>
					</form>
				</>
			</AddData>
			<h1>All Transaction</h1>
			<table className="table table-striped mt-1 custom-table2">
				<thead className="bg-second">
					<tr>
						<th scope="col">#</th>
						<th scope="col">Customer</th>
						<th scope="col">Items</th>
						<th scope="col">Total</th>
						<th scope="col">Status</th>
						<th scope="col">Image</th>
						<th scope="col">Action</th>
					</tr>
				</thead>
				<tbody>
					{data.map((item, index) => {
						return (
							<tr key={item.id}>
								<th scope="row">{(pageNow - 1) * 10 + (index + 1)}</th>
								<td>{item.user.name}</td>
								<td className="text-capitalize">
									{item.item.map((item2) => {
										return (
											<span key={item2.id} className="d-block">
												{item2.item.itemName}
											</span>
										);
									})}
								</td>
								<td>Rp. {convert(item.totalPayment)}</td>
								<td>{item.status}</td>
								<td>
									<div className="pointer" data-toggle="modal" onClick={() => openImage(item.transferEvidence)}>
										<i className="fas fa-eye"></i>
									</div>
								</td>
								<td>
									{item.transferEvidence !== "" ? (
										<div className="pointer ml-2" data-toggle="modal" data-target="#addDataLabel" onClick={() => editHandler(item, "edit")}>
											<i className="fas fa-pencil-alt"></i>
										</div>
									) : (
										<div className="pointer" onClick={() => window.alert("Has not Paid yet")}>
											<i class="fa fa-stop" aria-hidden="true"></i>
										</div>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			<nav aria-label="Page navigation example">
				<ul className="pagination">
					<li className="page-item">
						<span className={`page-link ${totalPage !== 0 && pageNow !== 1 ? "pointer" : "bg-secondary text-white"}`} onClick={pageNow !== totalPage && totalPage !== 0 ? () => localGetOrder({ page: 1 }) : null} aria-label="Previous">
							<span aria-hidden="true">&laquo;</span>
							<span className="sr-only">Previous</span>
						</span>
					</li>
					<li className="page-item">
						<span className={`page-link ${pageNow > 1 ? "pointer" : "bg-secondary text-white"}`} onClick={pageNow > 1 ? (pageNow === totalPage ? () => localGetOrder({ page: pageNow - 1 }) : () => localGetOrder({ page: pageNow - 2 })) : null}>
							{pageNow > 1 ? (pageNow === totalPage ? pageNow - 1 : pageNow - 2) : 1}
						</span>
					</li>
					{totalPage === 1 || totalPage === 0 ? null : totalPage === 2 ? (
						<li className="page-item">
							<span className={`page-link ${pageNow === totalPage ? "bg-secondary text-white" : "pointer"}`} onClick={pageNow === totalPage ? null : () => localGetOrder({ page: pageNow + 1 })}>
								{pageNow === totalPage ? pageNow : pageNow + 1}
							</span>
						</li>
					) : (
						<>
							<li className="page-item">
								<span className={`page-link ${pageNow === totalPage ? "pointer" : "bg-secondary text-white"}`} onClick={pageNow === totalPage ? () => localGetOrder({ page: pageNow - 1 }) : null}>
									{pageNow === totalPage ? pageNow - 1 : pageNow}
								</span>
							</li>
							<li className="page-item">
								<span className={`page-link ${pageNow === totalPage ? "bg-secondary text-white" : "pointer"}`} onClick={pageNow === totalPage ? null : () => localGetOrder({ page: pageNow + 1 })}>
									{pageNow === totalPage ? pageNow : pageNow + 1}
								</span>
							</li>
						</>
					)}

					<li className="page-item">
						<span className={`page-link ${pageNow !== totalPage && totalPage !== 0 ? "pointer" : "bg-secondary text-white"}`} onClick={pageNow !== totalPage && totalPage !== 0 ? () => localGetOrder({ page: totalPage }) : null} aria-label="Next">
							<span aria-hidden="true">&raquo;</span>
							<span className="sr-only">Next</span>
						</span>
					</li>
				</ul>
			</nav>
		</div>
	);
}

export default Transactions;
