
const innitialState = {
	data: [],
	totalPage: null,
	pageNow: null,
};

const Order = (state = innitialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "EDIT_ORDER":
			const itemIndex = state.data.findIndex((item) => item.id === payload.id);
			const newData2 = [...state.data.slice(0, itemIndex), payload, ...state.data.slice(itemIndex + 1)];
			return {
				...state,
				data: newData2,
			};
		case "GET_ORDER":
			return {
				...state,
				...payload,
			};
		default:
			return state;
	}
};

export default Order;
