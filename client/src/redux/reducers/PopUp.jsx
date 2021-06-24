const innitialState = {
    isPoped: false,
    message: "",
    loadingComp: false,
};

const PopUp = (state = innitialState, action) => {
    const { type, payload } = action;
    switch (type) {
        case "POP_UP":
            return {
                ...state,
                isPoped: !state.isPoped,
                message: payload,
                progress: { isShown: false, percentage: 0 },
                loadingComp: false,
            };
        case "OPEN_LOADING":
            return {
                ...state,
                loadingComp: true,
            };
        case "CLOSE_LOADING":
            return {
                ...state,
                loadingComp: false,
            };
        default:
            return state;
    }
};

export default PopUp;
