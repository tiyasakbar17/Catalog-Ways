const Auth = require("../controllers/Auth");
const Category = require("../controllers/Category");
const Item = require("../controllers/Item");
const Cart = require("../controllers/Cart");
const Order = require("../controllers/Order");

const { jwtAuth } = require("../middlewares/JwtRoleAuth");
const { uploadFile } = require("../middlewares/uploadFile");

const router = require("express").Router();

//** Auth **//
router.get("/load", jwtAuth(["customer"]), Auth.loadData);
router.post("/login", Auth.login);
router.post("/register", Auth.registerCustomer);

//** Category */
router.get("/category/all", jwtAuth(["admin"]), Category.getAllCategory);
router.post("/category/add", jwtAuth(["admin"]), Category.addCategory);
router.patch("/category/edit", jwtAuth(["admin"]), Category.editCategory);
router.patch("/category/restore", jwtAuth(["admin"]), Category.restoreCategory);
router.delete("/category/delete", jwtAuth(["admin"]), Category.deleteCategory);

//** Item */
router.get("/item/all", Item.getItems);
router.post("/item/add", jwtAuth(["admin"]), uploadFile("image"), Item.addItem);
router.patch("/item/edit", jwtAuth(["admin"]), uploadFile("image"), Item.updateItem);
router.patch("/item/restore", jwtAuth(["admin"]), Item.restoreItem);
router.delete("/item/delete", jwtAuth(["admin"]), Item.deleteItem);

//** Cart */
router.post("/cart/add", jwtAuth(["customer"]), Cart.addCart);
router.delete("/cart/delete", jwtAuth(["customer"]), Cart.deleteCart);

//** Order */
router.get("/order/all", jwtAuth(["admin"]), Order.getOrderAdmin);
router.get("/order/user", jwtAuth(["customer"]), Order.getOrders);
router.post("/order/add", jwtAuth(["customer"]), Order.newOrder);
router.patch("/order/edit", jwtAuth(["customer"]), uploadFile("image"), Order.updateOrder);

module.exports = router;
