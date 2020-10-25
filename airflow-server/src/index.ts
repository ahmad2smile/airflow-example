import express, { Request, Response } from "express";

import { BrokerService } from "./services/brokerService";
import { ListenerService } from "./services/listenerService";

const app = express();

app.post("/publish", async (req: Request, res: Response) => {
	const { queueName, data } = req.params;

	const brokerService = await BrokerService.getInstance();

	await brokerService.send(queueName as string, data);

	res.json({ response: { data: "success" } });
});

app.post("/health", async (req: Request, res: Response) => {
	res.json({ response: { data: "live" } });
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
	const listenerService = new ListenerService();

	// NOTE: Start listening to messages to trigger DAGs on AMQP
	listenerService.init();

	console.log(`Server is listening on port ${PORT}`);
});
