
exports.message = ({name}) =>  
`
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Catalog-Ways</title>
		<style>
			body {
				padding-left: 7%;
				padding-right: 7%;
                padding-top: 3%;
				max-width: 500px;
				background-color: rgb(24, 24, 24);
				color: rgb(133, 133, 133);
				font-family: Arial, Helvetica, sans-serif;
				font-size: 13px;
                display: flex;
                flex-direction: column;
                justify-content: center;
			}
			.dotted-line {
				margin-top: 10px;
				margin-bottom: 10px;
				width: 100%;
				border: 1px dotted black;
			}
			.footer {
				font-size: 11px;
			}
		</style>
	</head>
	<body>
		<div class="main-item">
			<span style="color: black; font-size: 15px">Hi ${name || "Customer"}</span>
			<br />
			<span>Thank you for registering.</span>
			<br />
			<span>This is an automated email for you.</span>
			<br />
			<br />
			<div class="dotted-line"></div>
			<div class="footer">
				<span style="color: black; font-size: 15px">Contact</span>
				<br /><br />
				<span>Phone Number : 0812-8491-4453</span>
				<br /><br />
				<span>Email : tiyas.akbar@gmail.com</span>
				<br /><br />
				<span>Address : Cicentang Asri, Rawa Buntu, Serpong, South Tangerang, Banten 15310</span>
				<br /><br />
				<div style="width: 100%; text-align: center">
					<span>Copyright Catalog-Ways</span>
				</div>
			</div>
		</div>
	</body>
</html>
`