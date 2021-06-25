import Axios from "axios";
import { closeLoading, showLoading, showPopUp } from "./PopUp";

const configJson = {
	headers: {
		"Content-type": "application/json",
	},
};

export const getCategory =
	({ page, keyword, restore }) =>
	async (dispatch) => {
		try {
			dispatch(showLoading());
			const results = await Axios.get(`/api/v1/category/all?page=${page ? page : ""}&keyword=${keyword ? keyword : ""}&restore=${restore ? restore : ""}`, configJson);

			const { data } = results.data.data;
			if (data === undefined) {
				dispatch({
					type: "GET_ALL_CATEGORY",
					payload: results.data.data,
				});
			} else {
				dispatch({
					type: "GET_CATEGORY",
					payload: results.data.data,
				});
			}
			dispatch(closeLoading());
		} catch (error) {
			dispatch(closeLoading());
			if (error.response.data.message == "Invalid Token") {
				localStorage.removeItem("token");
				dispatch({
					type: "AUTH_ERROR",
				});
				dispatch(showPopUp("Login Expired"));
			} else {
				dispatch(showPopUp(error.response.data.message));
			}
		}
	};

export const deleteCategory = (id, keyword) => async (dispatch, getState) => {
	try {
		const { Category } = getState();
		dispatch(showLoading());
		const results = await Axios.delete(`/api/v1/category/delete?id=${id}`, configJson);
		dispatch(getCategory({ page: Category.pageNow, keyword, restore: "" }));
		dispatch(showPopUp(results.data.message));
		dispatch(closeLoading());
	} catch (error) {
		dispatch(closeLoading());
		if (error.response.data.message == "Invalid Token") {
			localStorage.removeItem("token");
			dispatch({
				type: "AUTH_ERROR",
			});
			dispatch(showPopUp("Login Expired"));
		} else {
			dispatch(showPopUp(error.response.data.message));
		}
	}
};

export const restoreCategory = (id, keyword) => async (dispatch, getState) => {
	try {
		const { Category } = getState();
		dispatch(showLoading());
		const results = await Axios.patch(`/api/v1/category/restore?id=${id}`, configJson);
		dispatch(getCategory({ page: Category.pageNow, keyword, restore: true }));
		dispatch(showPopUp(results.data.message));
		dispatch(closeLoading());
	} catch (error) {
		dispatch(closeLoading());
		if (error.response.data.message == "Invalid Token") {
			localStorage.removeItem("token");
			dispatch({
				type: "AUTH_ERROR",
			});
			dispatch(showPopUp("Login Expired"));
		} else {
			dispatch(showPopUp(error.response.data.message));
		}
	}
};

export const addCategory = (data) => async (dispatch) => {
	try {
		dispatch(showLoading());
		const results = await Axios.post(`/api/v1/category/add`, data, configJson);
		dispatch(getCategory({ page: 1, restore: "", keyword: "" }));
		dispatch(showPopUp(results.data.message));
	} catch (error) {
		dispatch(closeLoading());
		if (error.response.data.message == "Invalid Token") {
			localStorage.removeItem("token");
			dispatch({
				type: "AUTH_ERROR",
			});
			dispatch(showPopUp("Login Expired"));
		} else {
			dispatch(showPopUp(error.response.data.message));
		}
	}
};

export const editCategory = (data) => async (dispatch) => {
	try {
		dispatch(showLoading());
		const results = await Axios.patch(`/api/v1/category/edit`, data, configJson);
		dispatch({
			type: "EDIT_CATEGORY",
			payload: results.data.data,
		});
		dispatch(showPopUp(results.data.message));
	} catch (error) {
		dispatch(closeLoading());
		if (error.response.data.message == "Invalid Token") {
			localStorage.removeItem("token");
			dispatch({
				type: "AUTH_ERROR",
			});
			dispatch(showPopUp("Login Expired"));
		} else {
			dispatch(showPopUp(error.response.data.message));
		}
	}
};
