import Axios from "axios";
import { loadData } from "./Auth";
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

export const makeOrder = () => async (dispatch) => {
	try {
		dispatch(showLoading());
		const results = await Axios.post(`/api/v1/order/add`, configJson);
		dispatch(showPopUp(results.data.message));
		dispatch(loadData());
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

export const getOrder =
	({ page, type }) =>
	async (dispatch) => {
		try {
			dispatch(showLoading());
			const results = await Axios.get(`/api/v1/order/${type}?page=${page ? page : 1}`, configJson);
			dispatch({
				type: "GET_ORDER",
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

export const editOrder = (data) => async (dispatch) => {
	try {
		dispatch(showLoading());
		const results = await Axios.patch(`/api/v1/order/edit`, data, configForm);
		dispatch({
			type: "EDIT_ORDER",
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
