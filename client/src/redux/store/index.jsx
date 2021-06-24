import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import Reducers from "../reducers";

const initialState = {};

const middleware = [thunk];

const Store = createStore(
  Reducers,
  initialState,
  applyMiddleware(...middleware)
);

export default Store;
