import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../redux/actions/Auth";
import Loading from "./PopUps/Loading";
import PopUps from "./PopUps/PopUps";

const Navbar = ({ Auth: { isLogin, userData }, PopUpState: { isPoped, loadingComp }, logout }) => {
	return (
		<>
			{isPoped ? <PopUps /> : null}
			{loadingComp ? <Loading /> : null}
			<div className="bg-primer">
				<div className="custom-navbar">
					<nav className="navbar navbar-expand-lg navbar-dark bg-primer">
						<Link to="/">
							<span className="navbar-brand pointer text-white">Catalog-Ways</span>
						</Link>
						<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" style={{ color: "white" }}>
							<span className="navbar-toggler-icon" style={{ color: "white" }}></span>
						</button>
						<div className="collapse navbar-collapse" id="navbarSupportedContent">
							<ul className="navbar-nav mr-auto">
								{isLogin ? (
									<>
										{userData.role === "admin" && (
											<>
												<Link to="/admin/categories">
													<li className="nav-item">
														<span className="nav-link pointer text-white">Categories</span>
													</li>
												</Link>
												<Link to="/admin/items">
													<li className="nav-item">
														<span className="nav-link pointer text-white">Items</span>
													</li>
												</Link>
												<Link to="/admin/transaction">
													<li className="nav-item">
														<span className="nav-link pointer text-white">Transactions</span>
													</li>
												</Link>
											</>
										)}
										<>
											<Link to="/cart">
												<li className="nav-item">
													<span className="nav-link pointer text-white">Cart</span>
												</li>
											</Link>
											<Link to="/order">
												<li className="nav-item">
													<span className="nav-link pointer text-white">Orders</span>
												</li>
											</Link>
										</>
									</>
								) : null}
							</ul>

							<form className="form-inline my-2 my-lg-0">
								<span>
									Hello {isLogin ? userData.name : "Guest"},{" "}
									{isLogin ? (
										<span className="pointer" onClick={logout}>
											logout
										</span>
									) : (
										<Link to="/auth">
											<span className="pointer">login</span>
										</Link>
									)}
								</span>
							</form>
						</div>
					</nav>
				</div>
			</div>
		</>
	);
};
const mapStateToProps = (state) => ({
	Auth: state.Auth,
	PopUpState: state.PopUp,
});

const mapDispatchToProps = { logout };

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
