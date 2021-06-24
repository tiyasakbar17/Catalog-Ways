import Axios from "axios";
import { closeLoading, showLoading, showPopUp } from "./PopUp";

const configJson = {
	headers: {
		"Content-type": "application/json",
	},
};

export const getUser =
	({ page, restore, keyword }) =>
	async (dispatch) => {
		try {
			dispatch(showLoading());
			const results = await Axios.get(`/api/v1/user/all?page=${page}&keyword=${keyword}&restore=${restore}`, configJson);
			dispatch({
				type: "GET_USER",
				payload: results.data.data,
			});
			dispatch(closeLoading());
		} catch (error) {
			dispatch(closeLoading());
			dispatch(showPopUp(error.response.data.message));
		}
	};

export const deleteUser = (id, keyword) => async (dispatch, getState) => {
	try {
		const { UserHr } = getState();
		dispatch(showLoading());
		const results = await Axios.delete(`/api/v1/user/delete?id=${id}`, configJson);
		dispatch(getUser({ page: UserHr.pageNow, keyword, restore: "" }));
		dispatch(showPopUp(results.data.message));
		dispatch(closeLoading());
	} catch (error) {
		console.log(error);
		dispatch(closeLoading());
		dispatch(showPopUp(error.response.data.message));
	}
};

export const restoreUser = (id, keyword) => async (dispatch, getState) => {
	try {
		const { UserHr } = getState();
		dispatch(showLoading());
		const results = await Axios.patch(`/api/v1/user/restore?id=${id}`, configJson);
		dispatch(getUser({ page: UserHr.pageNow, keyword, restore: true }));
		dispatch(showPopUp(results.data.message));
		dispatch(closeLoading());
	} catch (error) {
		dispatch(closeLoading());
		dispatch(showPopUp(error.response.data.message));
	}
};

export const addUser = (data) => async (dispatch) => {
	try {
		dispatch(showLoading());
		const results = await Axios.post(`/api/v1/user/add`, data, configJson);
		dispatch(getUser({ page: 1, restore: "", keyword: "" }));
		dispatch(showPopUp(results.data.message));
	} catch (error) {
		dispatch(closeLoading());
		dispatch(showPopUp(error.response.data.message));
	}
};
