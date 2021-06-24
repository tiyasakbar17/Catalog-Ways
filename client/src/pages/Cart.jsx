import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Confirmations from "../components/PopUps/Confirmations";
import { deleteCart } from "../redux/actions/Auth";
import { makeOrder } from "../redux/actions/Order";

function Cart() {
	const initialState = {
		totalPayment: 0,
		confirmation: {
			message: "",
			id: null,
		},
	};
	const [state, setState] = useState(initialState);

	const convert = (gaji) => {
		const stringGaji = gaji.toString(),
			sisaPanjang = stringGaji.length > 3 ? stringGaji.length % 3 : 0,
			//** insert personal data */
			newGaji = (sisaPanjang ? stringGaji.substr(0, sisaPanjang) + "." : "") + stringGaji.substr(sisaPanjang).replace(/(.{3})(?=.)/g, "$1" + ".");
		return newGaji;
	};
	const { cart } = useSelector((state) => state.Auth);
	const dispatch = useDispatch();
	const history = useHistory()

	const deleteHandler = () => {
			dispatch(deleteCart(state.confirmation.id));
			setState((prev) => ({ ...prev, confirmation: initialState.confirmation }));
		},
		confirmationHandler = (name, id) => {
			setState((prev) => ({ ...prev, confirmation: { message: name, id } }));
		},
		checkoutHandler = async () => {
			const results = await dispatch(makeOrder())
			if (results) {
				history.push('/order')
			}
		}

	useEffect(() => {
		cart.forEach((item) => {
			setState((prev) => ({ ...prev, totalPayment: prev.totalPayment + item.item.price }));
		});
	}, []);

	return (
		<div className="container cart-container">
			<Confirmations title={`Delete`} message={`Are you sure to delete ${state.confirmation.message}?`} actions={deleteHandler} />
			<h2>Cart</h2>
			<div className="wrapper">
				<div className="main-cart">
					{cart.map((item, index) => {
						return (
							<div key={index + 1} className="cart-item mr-1 mb-1 shadow-sm">
								<div className="cart-image">
									<img src={item.item.image} alt={item.item.itemName} className="image" />
								</div>
								<div className="detil-item">
									<span className="text-muted mb-1 d-block">{item.item.category.categoryName}</span>
									<span style={{ fontWeight: 700 }} className="d-block ml-3">
										{item.item.itemName}
									</span>
									<span style={{ fontWeight: 700, color: "#D10024" }} className="d-block mb-1 ml-3">
										Rp. {convert(item.item.price)}
									</span>
								</div>
								<div className="delete">
									<i class="fa fa-trash" style={{ cursor: "pointer" }} aria-hidden="true" data-toggle="modal" data-target="#modalLabel" onClick={() => confirmationHandler(item.item.itemName, item.id)}></i>
								</div>
							</div>
						);
					})}
				</div>
				<div className="checkout-side">
					<div className="main-item">
						<div className="checkout-item shadow p-4">
							<div className="total-bayar">Total: Rp. {convert(state.totalPayment)}</div>
							<button className="btn btn-primer shadow-sm" onClick={checkoutHandler}>Checkout</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Cart;
