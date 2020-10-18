import express, { Request, Response } from "express";
import { v4 as uuid } from "uuid";

import { BrokerService } from "./services/brokerService";

const app = express();

const AIRFLOW_QUEUE = "airflow_queue";

app.use("/trigger", async (req: Request, res: Response) => {
	const brokerService = await BrokerService.getInstance();

	const queueName = uuid();

	await brokerService.send(
		AIRFLOW_QUEUE,
		JSON.stringify({
			message: {
				dagId: "amqp_dag",
				data: { conf: { queue_name: queueName } }
			}
		})
	);

	const queueMessage = await brokerService.getMessage(queueName);

	res.json({ response: { data: queueMessage.content } });
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
