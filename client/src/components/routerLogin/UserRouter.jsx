import React from "react";
import { connect } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const LoginRoute = ({ component: Component, Auth, role, ...rest }) => {
	if (Auth.loading) {
		if (localStorage.getItem("token")) {
			return <div className=""></div>;
		}
		return <Route {...rest} render={(props) => <Redirect to="/auth" />} />;
	} else {
		return <Route {...rest} render={(props) => (Auth.isLogin && (role.includes(Auth.userData.role) || Auth.userData.role === "admin") ? <Component {...props} /> : <Redirect to="/auth" />)} />;
	}
};

const mapStateToProps = (state) => {
	return {
		Auth: state.Auth,
	};
};

export default connect(mapStateToProps)(LoginRoute);
