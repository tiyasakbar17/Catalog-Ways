
const innitialState = {
	data: [],
	totalPage: null,
	pageNow: null,
};

const Item = (state = innitialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "EDIT_ITEM":
			const itemIndex = state.data.findIndex((item) => item.id === payload.id);
			const newData2 = [...state.data.slice(0, itemIndex), payload, ...state.data.slice(itemIndex + 1)];
			return {
				...state,
				data: newData2,
			};
		case "GET_ITEM":
			return {
				...state,
				...payload,
			};
		default:
			return state;
	}
};

export default Item;
