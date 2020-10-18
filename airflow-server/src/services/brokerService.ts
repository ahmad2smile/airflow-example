import amqp, { Channel, Connection, ConsumeMessage } from "amqplib";

export class BrokerService {
	private constructor() {}

	private static _instance: BrokerService;

	private _connection: Connection;
	private _channel: Channel;

	async init() {
		try {
			this._connection = await amqp.connect(
				"amqp://admin:password@rabbitmq:5672"
			);
			this._channel = await this._connection.createChannel();
		} catch (error) {
			console.log("==================================");
			console.log(error);
			console.log((error.message || "").inclues("ECONNREFUSED"));
			console.log("==================================");
		}
	}

	static async getInstance() {
		if (this._instance) {
			return this._instance;
		}

		this._instance = new this();

		await this._instance.init();

		return this._instance;
	}

	async send(queue: string, msg: string) {
		if (!this._connection) {
			await this.init();
		}

		await this._channel.assertQueue(queue, { durable: true });

		this._channel.sendToQueue(queue, Buffer.from(msg));
	}

	async getMessage(queue: string): Promise<ConsumeMessage> {
		if (!this._connection) {
			await this.init();
		}

		await this._channel.assertQueue(queue, { durable: true });

		return new Promise((resolve) => {
			this._channel.consume(queue, resolve, { noAck: true });

			// NOTE: Should reject on timeout if needed
		});
	}
}
