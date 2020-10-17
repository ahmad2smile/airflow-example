import express from "express";

const app = express();

app.use("/trigger", (req, res) => {
	console.log("==================================");
	console.log(JSON.stringify({ t: "triggered" }, undefined, 4));
	console.log("==================================");

	res.json({ t: "triggered" });
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
