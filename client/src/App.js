import React, { useEffect } from "react";
import "./App.css";
import { Provider } from "react-redux";
import Store from "./redux/store";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import UserRouter from "./components/routerLogin/UserRouter";
import SetAuthToken from "./redux/actions/setAuthToken";
import { loadData } from "./redux/actions/Auth";
import Home from "./pages/Home";
import Page404 from "./pages/Page404";
import useWindowDimensions from "./components/ScreenSize";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/Login";
import Categories from "./pages/Categories";
import Cart from "./pages/Cart";
import ItemPage from "./pages/Items";
import Orders from "./pages/Orders";
import Transactions from "./pages/Transactions";
// import AdminPage from "./pages/AdminPage";
// import UserPage from "./pages/UserPage";
// import KaryawanPage from "./pages/KaryawanPage";

function App() {
	const { width, height } = useWindowDimensions();
	if (localStorage.getItem("token")) {
		SetAuthToken(localStorage.getItem("token"));
	}
	useEffect(() => {
		if (localStorage.getItem("token")) {
			Store.dispatch(loadData());
		}
	}, []);
	return (
		<Provider store={Store}>
			<BrowserRouter>
				<div className="custom-body" style={{ minWidth: width, minHeight: height }}>
					<Navbar />
					<Switch>
						<Route exact path="/" component={Home} />
						<Route exact path="/auth" component={LoginPage} />
						<UserRouter exact path="/admin/categories" role={["admin"]} component={Categories} />
						<UserRouter exact path="/admin/items" role={["admin"]} component={ItemPage} />
						<UserRouter exact path="/cart" role={["customer"]} component={Cart} />
						<UserRouter exact path="/order" role={["customer"]} component={Orders} />
						<UserRouter exact path="/admin/transaction" role={["admin"]} component={Transactions} />
						<Route component={Page404} />
					</Switch>
				</div>
			</BrowserRouter>
		</Provider>
	);
}

export default App;
