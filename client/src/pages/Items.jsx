import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import AddData from "../components/PopUps/AddData";
import Confirmations from "../components/PopUps/Confirmations";
import TableActions from "../components/TableActions";
import { getCategory } from "../redux/actions/Category";
import { addItem, deleteItem, editItem, getItem, restoreItem } from "../redux/actions/Item";

const convert = (gaji) => {
	const stringGaji = gaji.toString(),
		sisaPanjang = stringGaji.length > 3 ? stringGaji.length % 3 : 0,
		//** insert personal data */
		newGaji = (sisaPanjang ? stringGaji.substr(0, sisaPanjang) + "." : "") + stringGaji.substr(sisaPanjang).replace(/(.{3})(?=.)/g, "$1" + ".");
	return newGaji;
};

function ItemPage() {
	const initialState = {
		restore: false,
		keyword: "",
		confirmation: {
			message: "",
			id: null,
		},
		formData: {
			itemName: "",
			price: "",
			categoryId: "",
			image: "",
		},
		type: "add",
	};
	const [state, setstate] = useState(initialState);
	const dispatch = useDispatch();
	const Auth = useSelector((state) => state.Auth);
	const { allData } = useSelector((state) => state.Category);
	const { data, pageNow, totalPage } = useSelector((state) => state.Item);

	const localGetItem = ({ page }) => {
		dispatch(getItem({ page, keyword: state.keyword, restore: state.restore ? true : "" }));
	};

	useEffect(() => {
		localGetItem({ page: 1 });
	}, [state.restore, state.keyword]);

	useEffect(() => {
		dispatch(getItem({ page: 1 }));
		dispatch(getCategory({}));
	}, []);

	const changeHandler = (event) => {
			setstate((prev) => ({ ...prev, [event.target.name]: event.target.value }));
		},
		changeFormHandler = (event) => {
			setstate((prev) => ({ ...prev, formData: { ...prev.formData, [event.target.name]: event.target.name === "image" ? (event.target.files[0] ? event.target.files[0] : null) : event.target.value } }));
		},
		restoreHandler = (event) => {
			setstate((prev) => ({ ...prev, [event.target.name]: !prev[event.target.name] }));
		},
		confirmationHandler = (name, id) => {
			setstate((prev) => ({ ...prev, confirmation: { message: name, id } }));
		},
		deleteHandler = () => {
			dispatch(deleteItem(state.confirmation.id, state.keyword));
			setstate((prev) => ({ ...prev, confirmation: initialState.confirmation }));
		},
		editHandler = (item, type) => {
			const { id, itemName, price, categoryId } = item;
			setstate((prev) => ({
				...prev,
				confirmation: { ...prev.confirmation, id },
				type,
				formData: {
					itemName,
					price,
					categoryId,
				},
			}));
		},
		cancelHandler = () => {
			setstate((prev) => ({ ...prev, confirmation: initialState.confirmation, type: "add", formData: initialState.formData }));
		},
		restoreConfirmation = () => {
			dispatch(restoreItem(state.confirmation.id, state.keyword));
			setstate((prev) => ({ ...prev, confirmation: initialState.confirmation }));
		},
		addItemHandle = (e) => {
			e.preventDefault();
			const formData = new FormData();
			formData.append("itemName", state.formData.itemName);
			formData.append("price", parseInt(state.formData.price));
			formData.append("categoryId", state.formData.categoryId);
			formData.append("image", state.formData.image);
			dispatch(addItem(formData));
			setstate(initialState);
		},
		editItemHandle = () => {
			const formData = new FormData();
			formData.append("id", state.confirmation.id);
			formData.append("itemName", state.formData.itemName);
			formData.append("price", parseInt(state.formData.price));
			formData.append("categoryId", state.formData.categoryId);
			state.formData.image && formData.append("image", state.formData.image);
			dispatch(editItem(formData));
			setstate(initialState);
		},
		openImage = (url) => {
			const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
			if (newWindow) newWindow.opener = null
		  },
		options = {
			changeHandler,
			restoreHandler,
			cancelHandler,
			show: true,
		};

	return (
		<div className="mt-4 custom-navbar">
			<Confirmations title={`${state.restore ? "Restore" : "Delete"}`} message={`${state.restore ? `Are you sure to restore ${state.confirmation.message}?` : `Are you sure to delete ${state.confirmation.message}?`}`} actions={state.restore ? restoreConfirmation : deleteHandler} />
			<AddData title="Item" type={state.type} actions={state.type === "add" ? addItemHandle: editItemHandle} cancelAction={cancelHandler}>
				<>
					<form>
						<div className="h5">Item's Data</div>
						<label className="mt-1">Item Name</label>
						<input type="text" name="itemName" onChange={changeFormHandler} value={state.formData.itemName} className="form-control" id="itemName" placeholder="Item Name" required />
						<label className="mt-1">Price</label>
						<input type="text" name="price" onChange={changeFormHandler} value={state.formData.price} className="form-control" id="price" placeholder="Price" required />
						<label className="mt-1">Category</label>
						<select name="categoryId" onChange={changeFormHandler} value={state.formData.categoryId} className="form-control" required>
							<option>Select</option>
							{allData.map((item, index) => {
								return (
									<option key={index} value={item.id}>
										{item.categoryName}
									</option>
								);
							})}
						</select>
						<label className="mt-1">Image</label>
						<input type="file" name="image" onChange={changeFormHandler} className="form-control" id="image" required />
					</form>
				</>
			</AddData>
			<h1>{state.restore ? "Deleted Item" : "All Item"}</h1>
			<TableActions {...options} />
			<table className="table table-striped mt-1 custom-table2">
				<thead className="bg-second">
					<tr>
						<th scope="col">#</th>
						<th scope="col">Item Name</th>
						<th scope="col">Price</th>
						<th scope="col">Category</th>
						<th scope="col">Image</th>
						<th scope="col">Action</th>
					</tr>
				</thead>
				<tbody>
					{data.map((item, index) => {
						return (
							<tr key={item.id}>
								<th scope="row">{(pageNow - 1) * 10 + (index + 1)}</th>
								<td className="text-capitalize">{item.itemName}</td>
								<td>Rp. {convert(item.price)}</td>
								<td className="text-capitalize">{item.category.categoryName}</td>
								<td>
									<div className="pointer" data-toggle="modal" onClick={() => openImage(item.image)}>
										<i className="fas fa-eye"></i>
									</div>
								</td>
								<td className="d-flex flex-row">
									{state.restore ? (
										<div className="pointer" data-toggle="modal" data-target="#modalLabel" onClick={() => confirmationHandler(item.itemName, item.id)}>
											<i className="fas fa-recycle"></i>
										</div>
									) : (
										<>
											<div className="pointer ml-2" data-toggle="modal" data-target="#addDataLabel" onClick={() => editHandler(item, "edit")}>
												<i className="fas fa-pencil-alt"></i>
											</div>
											<div className="pointer ml-2" data-toggle="modal" data-target="#modalLabel" onClick={() => confirmationHandler(item.itemName, item.id)}>
												<i className="fas fa-trash-alt"></i>
											</div>
										</>
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
						<span className={`page-link ${totalPage !== 0 && pageNow !== 1 ? "pointer" : "bg-secondary text-white"}`} onClick={pageNow !== totalPage && totalPage !== 0 ? () => localGetItem({ page: 1 }) : null} aria-label="Previous">
							<span aria-hidden="true">&laquo;</span>
							<span className="sr-only">Previous</span>
						</span>
					</li>
					<li className="page-item">
						<span className={`page-link ${pageNow > 1 ? "pointer" : "bg-secondary text-white"}`} onClick={pageNow > 1 ? (pageNow === totalPage ? () => localGetItem({ page: pageNow - 1 }) : () => localGetItem({ page: pageNow - 2 })) : null}>
							{pageNow > 1 ? (pageNow === totalPage ? pageNow - 1 : pageNow - 2) : 1}
						</span>
					</li>
					{totalPage === 1 || totalPage === 0 ? null : totalPage === 2 ? (
						<li className="page-item">
							<span className={`page-link ${pageNow === totalPage ? "bg-secondary text-white" : "pointer"}`} onClick={pageNow === totalPage ? null : () => localGetItem({ page: pageNow + 1 })}>
								{pageNow === totalPage ? pageNow : pageNow + 1}
							</span>
						</li>
					) : (
						<>
							<li className="page-item">
								<span className={`page-link ${pageNow === totalPage ? "pointer" : "bg-secondary text-white"}`} onClick={pageNow === totalPage ? () => localGetItem({ page: pageNow - 1 }) : null}>
									{pageNow === totalPage ? pageNow - 1 : pageNow}
								</span>
							</li>
							<li className="page-item">
								<span className={`page-link ${pageNow === totalPage ? "bg-secondary text-white" : "pointer"}`} onClick={pageNow === totalPage ? null : () => localGetItem({ page: pageNow + 1 })}>
									{pageNow === totalPage ? pageNow : pageNow + 1}
								</span>
							</li>
						</>
					)}

					<li className="page-item">
						<span className={`page-link ${pageNow !== totalPage && totalPage !== 0 ? "pointer" : "bg-secondary text-white"}`} onClick={pageNow !== totalPage && totalPage !== 0 ? () => localGetItem({ page: totalPage }) : null} aria-label="Next">
							<span aria-hidden="true">&raquo;</span>
							<span className="sr-only">Next</span>
						</span>
					</li>
				</ul>
			</nav>
		</div>
	);
}

export default ItemPage;
