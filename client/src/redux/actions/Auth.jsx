import Axios from "axios";
import { closeLoading, showLoading, showPopUp } from "./PopUp";
import SetAuthToken from "./setAuthToken";

const configJson = {
	headers: {
		"Content-type": "application/json",
	},
};


export const loadData = () => async (dispatch) => {
	dispatch(showLoading());
	if (localStorage.getItem("token")) {
		SetAuthToken(localStorage.getItem("token"));
	}

	try {
		const result = await Axios.get(`/api/v1/load`, configJson);
		dispatch({
			type: "LOAD_DATA",
			payload: result.data.data,
		});
		dispatch(closeLoading());
	} catch (error) {
		dispatch(closeLoading());
		localStorage.removeItem('token')
		dispatch({
			type: "AUTH_ERROR",
		});
	}
};

export const userLogin = (data) => async (dispatch) => {
	try {
		dispatch(showLoading());
		const results = await Axios.post(`/api/v1/login`, data, configJson);
		const {token, ...restData} = results.data.data
		SetAuthToken(token);
		localStorage.setItem("token", token);
		dispatch({
			type: "LOAD_DATA",
			payload: restData,
		});
		dispatch(closeLoading());
	} catch (error) {
		dispatch(closeLoading());
		dispatch(showPopUp(error.response.data.message));
	}
};

export const userRegister = (data) => async dispatch => {
	try {
		dispatch(showLoading());
		const results = await Axios.post(`/api/v1/register`, data, configJson);
		const {token, ...restData} = results.data.data
		SetAuthToken(token);
		localStorage.setItem("token", token);
		dispatch({
			type: "LOAD_DATA",
			payload: restData,
		});
		dispatch(closeLoading());
	} catch (error) {
		dispatch(closeLoading());
		dispatch(showPopUp(error.response.data.message));
	}
}

export const logout = () => (dispatch) => {
	dispatch({
		type: "LOGOUT",
	});
};


//**--------------------------cart--------------------------- */

export const addCart = (data) => async (dispatch) => {
	try {
		dispatch(showLoading());
		const results = await Axios.post(`/api/v1/cart/add`, data, configJson);
		dispatch(loadData());
		dispatch(showPopUp(results.data.message));
		dispatch(closeLoading());
	} catch (error) {
		dispatch(closeLoading());
		dispatch(showPopUp(error.response.data.message));
	}
}

export const deleteCart = (id) => async (dispatch, getState) => {
	try {
		dispatch(showLoading());
		const results = await Axios.delete(`/api/v1/cart/delete?id=${id}`, configJson);
		dispatch(loadData());
		dispatch(showPopUp(results.data.message));
		dispatch(closeLoading());
	} catch (error) {
		console.log(error);
		dispatch(closeLoading());
		dispatch(showPopUp(error.response.data.message));
	}
};
//**--------------------------cart--------------------------- */