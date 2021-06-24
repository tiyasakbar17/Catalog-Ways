const innitialState = {
	data: [],
	totalPage: null,
	pageNow: null,
	allData: [],
};

const Category = (state = innitialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case "EDIT_CATEGORY":
			const itemIndex = state.data.findIndex((item) => item.id === payload.id);
			const newData2 = [...state.data.slice(0, itemIndex), payload, ...state.data.slice(itemIndex + 1)];
			return {
				...state,
				data: newData2,
			};
		case "GET_ALL_CATEGORY":
			return {
				...state,
				allData: payload,
			};
		case "GET_CATEGORY":
			return {
				...state,
				...payload,
			};
		default:
			return state;
	}
};

export default Category;
