require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./api/router");
const path = require("path");

//PORT
const port = process.env.PORT || 5000;

const app = express();

// for passing cors
app.use(cors());
// for parsing application/json
app.use(express.json());
// for parsing application/xwww-
app.use(express.urlencoded({ extended: true }));

//ROUTER To Api
app.use("/api/v1", router);
if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}
app.listen(port, () => {
	console.log(`Server are running on port ${port}`);
});
