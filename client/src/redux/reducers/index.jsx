import { combineReducers } from "redux";
import Auth from "./Auth";
import PopUp from "./PopUp";
import Category from "./Category";
import Item from "./Item";
import Order from "./Orders";

const Reducers = combineReducers({ Auth, PopUp, Category, Item, Order });

export default Reducers;
