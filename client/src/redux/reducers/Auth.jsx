const innitialState = {
	isLogin: false,
	userData: null,
	user: null,
	loading: true,
	cart: []
};

const Auth = (state = innitialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "LOAD_DATA": {
			const {cart, ...restData} = payload
			return {
				...state,
				userData: restData,
				cart,
				isLogin: true,
				loading: false,
			};
		}
		case "LOGOUT":
			localStorage.removeItem("token");
			return {
				...innitialState,
				loading: false
			};
		case "AUTH_ERROR":
			return {
				...innitialState,
				loading: false
			};
		default:
			return state;
	}
};

export default Auth;
