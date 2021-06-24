module.exports = {
	successResponse: (res, results, message, status) => {
		res.status(status || 200).json({
			status: "success",
			message,
			data: results,
		});
	},
	failedResponse: (res, message, details, status) => {
		res.status(status || 404).json({
			status: "failed",
			message,
			details,
		});
	},
};
