import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import AddData from "../components/PopUps/AddData";
import Confirmations from "../components/PopUps/Confirmations";
import TableActions from "../components/TableActions";
import { addCategory, deleteCategory, editCategory, getCategory, restoreCategory } from "../redux/actions/Category";

function Categories() {
	const initialState = {
		restore: false,
		keyword: "",
		confirmation: {
			message: "",
			id: null,
		},
		categoryName: "",
		status: null,
		type: "add",
	};
	const [state, setstate] = useState(initialState);
	const dispatch = useDispatch();
	const history = useHistory();
	const Category = useSelector((state) => state.Category);

	const localGetCategory = ({ page }) => {
		dispatch(getCategory({ page, keyword: state.keyword, restore: state.restore ? true : "" }));
	};

	useEffect(() => {
		localGetCategory({ page: 1 });
	}, [state.restore, state.keyword]);

	const changeHandler = (event) => {
			setstate((prev) => ({ ...prev, [event.target.name]: event.target.value }));
		},
		restoreHandler = (event) => {
			setstate((prev) => ({ ...prev, [event.target.name]: !prev[event.target.name] }));
		},
		confirmationHandler = (name, id) => {
			setstate((prev) => ({ ...prev, confirmation: { message: name, id } }));
		},
		deleteHandler = () => {
			dispatch(deleteCategory(state.confirmation.id, state.keyword));
			setstate((prev) => ({ ...prev, confirmation: initialState.confirmation }));
		},
		editHandler = (id, nama, status) => {
			setstate((prev) => ({ ...prev, confirmation: { ...prev.confirmation, id }, type: "edit", categoryName: nama, status }));
		},
		cancelHandler = () => {
			setstate((prev) => ({ ...prev, confirmation: initialState.confirmation, type: "add", categoryName: "" }));
		},
		restoreConfirmation = () => {
			dispatch(restoreCategory(state.confirmation.id, state.keyword));
			setstate((prev) => ({ ...prev, confirmation: initialState.confirmation }));
		},
		addCategoryHandle = (e) => {
			e.preventDefault();
			dispatch(addCategory({ categoryName: state.categoryName }));
			setstate(initialState);
		},
		editCategoryHandle = (e) => {
			e.preventDefault();
			dispatch(editCategory({ id: state.confirmation.id, categoryName: state.categoryName, status: state.status }));
			setstate(initialState);
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
			<AddData title="cabang" type={state.type} actions={state.type === "add" ? addCategoryHandle : editCategoryHandle} cancelAction={cancelHandler}>
				<div className="form-group">
					<label className="h6" htmlFor="categoryName">
						Category's Name
					</label>
					<input type="text" name="categoryName" onChange={changeHandler} value={state.categoryName} className="form-control" id="categoryName" placeholder="Name" required/>
				</div>
			</AddData>
			<h1>{state.restore ? "Deleted Category" : "All Category"}</h1>
			<TableActions {...options} />
			<table className="table table-striped mt-1  custom-table">
				<thead className="bg-second">
					<tr>
						<th scope="col">#</th>
						<th scope="col">Category Name</th>
						<th scope="col">Action</th>
					</tr>
				</thead>
				<tbody>
					{Category.data.map((item, index) => {
						return (
							<tr key={item.id}>
								<th scope="row">{(Category.pageNow - 1) * 10 + (index + 1)}</th>
								<td className="text-capitalize">{item.categoryName}</td>
								<td className="d-flex flex-row">
									{state.restore ? (
										<div className="pointer" data-toggle="modal" data-target="#modalLabel" onClick={() => confirmationHandler(item.categoryName, item.id)}>
											<i className="fas fa-recycle"></i>
										</div>
									) : (
										<>
											<div className="pointer ml-2" data-toggle="modal" data-target="#addDataLabel" onClick={() => editHandler(item.id, item.categoryName, item.status)}>
												<i className="fas fa-pencil-alt"></i>
											</div>
											<div className="pointer ml-2" data-toggle="modal" data-target="#modalLabel" onClick={() => confirmationHandler(item.categoryName, item.id)}>
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
						<span className={`page-link ${Category.totalPage !== 0 && Category.pageNow !== 1 ? "pointer" : "bg-secondary text-white"}`} onClick={Category.pageNow !== Category.totalPage && Category.totalPage !== 0 ? () => localGetCategory({ page: 1 }) : null} aria-label="Previous">
							<span aria-hidden="true">&laquo;</span>
							<span className="sr-only">Previous</span>
						</span>
					</li>
					<li className="page-item">
						<span className={`page-link ${Category.pageNow > 1 ? "pointer" : "bg-secondary text-white"}`} onClick={Category.pageNow > 1 ? (Category.pageNow === Category.totalPage ? () => localGetCategory({ page: Category.pageNow - 1 }) : () => localGetCategory({ page: Category.pageNow - 2 })) : null}>
							{Category.pageNow > 1 ? (Category.pageNow === Category.totalPage ? Category.pageNow - 1 : Category.pageNow - 2) : 1}
						</span>
					</li>
					{Category.totalPage === 1 || Category.totalPage === 0 ? null : Category.totalPage === 2 ? (
						<li className="page-item">
							<span className={`page-link ${Category.pageNow === Category.totalPage ? "bg-secondary text-white" : "pointer"}`} onClick={Category.pageNow === Category.totalPage ? null : () => localGetCategory({ page: Category.pageNow + 1 })}>
								{Category.pageNow === Category.totalPage ? Category.pageNow : Category.pageNow + 1}
							</span>
						</li>
					) : (
						<>
							<li className="page-item">
								<span className={`page-link ${Category.pageNow === Category.totalPage ? "pointer" : "bg-secondary text-white"}`} onClick={Category.pageNow === Category.totalPage ? () => localGetCategory({ page: Category.pageNow - 1 }) : null}>
									{Category.pageNow === Category.totalPage ? Category.pageNow - 1 : Category.pageNow}
								</span>
							</li>
							<li className="page-item">
								<span className={`page-link ${Category.pageNow === Category.totalPage ? "bg-secondary text-white" : "pointer"}`} onClick={Category.pageNow === Category.totalPage ? null : () => localGetCategory({ page: Category.pageNow + 1 })}>
									{Category.pageNow === Category.totalPage ? Category.pageNow : Category.pageNow + 1}
								</span>
							</li>
						</>
					)}

					<li className="page-item">
						<span className={`page-link ${Category.pageNow !== Category.totalPage && Category.totalPage !== 0 ? "pointer" : "bg-secondary text-white"}`} onClick={Category.pageNow !== Category.totalPage && Category.totalPage !== 0 ? () => localGetCategory({ page: Category.totalPage }) : null} aria-label="Next">
							<span aria-hidden="true">&raquo;</span>
							<span className="sr-only">Next</span>
						</span>
					</li>
				</ul>
			</nav>
		</div>
	);
}

export default Categories;
