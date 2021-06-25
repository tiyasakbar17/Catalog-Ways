import Axios from "axios";
import { closeLoading, showLoading, showPopUp } from "./PopUp";

const configJson = {
	headers: {
		"Content-type": "application/json",
	},
};

const configForm = {
	headers: {
		"Content-Type": "multipart/form-data",
	},
};

export const getItem =
	({ page, restore, keyword, category }) =>
	async (dispatch) => {
		try {
			dispatch(showLoading());
			const results = await Axios.get(`/api/v1/item/all?page=${page ? page : 1}&keyword=${keyword ? keyword : ""}&restore=${restore ? restore : ""}&category=${category ? category : ""}`, configJson);
			dispatch({
				type: "GET_ITEM",
				payload: results.data.data,
			});
			dispatch(closeLoading());
			return true;
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
			return false;
		}
	};

export const deleteItem = (id, keyword) => async (dispatch, getState) => {
	try {
		const { Item } = getState();
		dispatch(showLoading());
		const results = await Axios.delete(`/api/v1/item/delete?id=${id}`, configJson);
		dispatch(getItem({ page: Item.pageNow, keyword, restore: "" }));
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

export const restoreItem = (id, keyword) => async (dispatch, getState) => {
	try {
		const { Item } = getState();
		dispatch(showLoading());
		const results = await Axios.patch(`/api/v1/item/restore?id=${id}`, configJson);
		dispatch(getItem({ page: Item.pageNow, keyword, restore: true }));
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

export const addItem = (data) => async (dispatch) => {
	try {
		dispatch(showLoading());
		const results = await Axios.post(`/api/v1/item/add`, data, configForm);
		dispatch(getItem({ page: 1, restore: "", keyword: "" }));
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

export const editItem = (data) => async (dispatch) => {
	try {
		dispatch(showLoading());
		const results = await Axios.patch(`/api/v1/item/edit`, data, configForm);
		dispatch({
			type: "EDIT_ITEM",
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
