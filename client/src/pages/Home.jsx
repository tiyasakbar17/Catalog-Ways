import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Login from "../components/Auth/Login";
import { addCart } from "../redux/actions/Auth";
import { getItem } from "../redux/actions/Item";
import TableActions from '../components/TableActions'

const convert = (gaji) => {
	const stringGaji = gaji.toString(),
		sisaPanjang = stringGaji.length > 3 ? stringGaji.length % 3 : 0,
		//** insert personal data */
		newGaji = (sisaPanjang ? stringGaji.substr(0, sisaPanjang) + "." : "") + stringGaji.substr(sisaPanjang).replace(/(.{3})(?=.)/g, "$1" + ".");
	return newGaji;
};

function Home() {
	const initialState = {
		login: false,
		keyword: "",
	};
	const [state, setState] = useState(initialState);

	const dispatch = useDispatch();
	const { isLogin } = useSelector((state) => state.Auth);
	const { data, totalPage, pageNow } = useSelector((state) => state.Item);

	const addToCart = (id) => {
		dispatch(addCart({ itemId: id }));
	};

	const localGetItem = ({ page }) => {
		dispatch(getItem({ page, keyword: state.keyword }));
	};

	useEffect(() => {
		dispatch(getItem({ page: 1, keyword: state.keyword }));
	}, [state.keyword]);

	return (
		<div className="container mt-3">
			{state.login ? <Login onClick={() => setState((prev) => ({ ...prev, login: false }))} /> : null}
			<h2>Producs</h2>
			<TableActions changeHandler={(event) => setState(prev => ({...prev, keyword: event.target.value}))} />
			<div className="item-container mt-4">
				{data.map((item) => (
					<div key={item.id} className="each-item p-4 m-1 shadow">
						<img src={item.image} alt={item.itemName} className="image-item" />
						<div className="detail-item">
							<span className="text-muted pointer mb-1 d-block">{item.category.categoryName}</span>
							<span style={{ fontWeight: 700 }} className="d-block">
								{item.itemName}
							</span>
							<span style={{ fontWeight: 700, color: "#D10024" }} className="d-block mb-1">
								Rp. {convert(item.price)}
							</span>
							<i className="fa fa-cart-plus" aria-hidden="true" style={{ cursor: "pointer" }} onClick={isLogin ? () => addToCart(item.id) : () => setState((prev) => ({ ...prev, login: true }))}></i>
						</div>
					</div>
				))}
			</div>
			<div className="d-flex flex-fill justify-content-center mt-5 mb-5">
				<nav aria-label="Page navigation example">
					<ul className="pagination">
						<li className="page-item">
							<span className={`page-link ${totalPage !== 0 && pageNow !== 1 ? "pointer" : "bg-secondary text-white"}`} onClick={pageNow !== totalPage && totalPage !== 0 ? () => localGetItem({ page: 1 }) : null} aria-label="Previous">
								<span aria-hidden="true">&laquo;</span>
								<span className="sr-only">Previous</span>
							</span>
						</li>
						<li className="page-item">
							<span className={`page-link ${pageNow > 1 ? "pointer" : "bg-secondary text-white"}`} onClick={pageNow > 1 ? (pageNow === totalPage ? () => localGetItem({ page: pageNow - 1 }) : () => localGetItem({ page: pageNow - 2 })) : null}>
								{pageNow > 1 ? (pageNow === totalPage ? pageNow - 1 : pageNow - 2) : 1}
							</span>
						</li>
						{totalPage === 1 || totalPage === 0 ? null : totalPage === 2 ? (
							<li className="page-item">
								<span className={`page-link ${pageNow === totalPage ? "bg-secondary text-white" : "pointer"}`} onClick={pageNow === totalPage ? null : () => localGetItem({ page: pageNow + 1 })}>
									{pageNow === totalPage ? pageNow : pageNow + 1}
								</span>
							</li>
						) : (
							<>
								<li className="page-item">
									<span className={`page-link ${pageNow === totalPage ? "pointer" : "bg-secondary text-white"}`} onClick={pageNow === totalPage ? () => localGetItem({ page: pageNow - 1 }) : null}>
										{pageNow === totalPage ? pageNow - 1 : pageNow}
									</span>
								</li>
								<li className="page-item">
									<span className={`page-link ${pageNow === totalPage ? "bg-secondary text-white" : "pointer"}`} onClick={pageNow === totalPage ? null : () => localGetItem({ page: pageNow + 1 })}>
										{pageNow === totalPage ? pageNow : pageNow + 1}
									</span>
								</li>
							</>
						)}

						<li className="page-item">
							<span className={`page-link ${pageNow !== totalPage && totalPage !== 0 ? "pointer" : "bg-secondary text-white"}`} onClick={pageNow !== totalPage && totalPage !== 0 ? () => localGetItem({ page: totalPage }) : null} aria-label="Next">
								<span aria-hidden="true">&raquo;</span>
								<span className="sr-only">Next</span>
							</span>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
}

export default Home;
