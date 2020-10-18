import { BrokerService } from "./brokerService";
import { triggerDag } from "./dataService";

interface IRequest {
	dagId: string;
	data: string;
}

export class ListenerService {
	private readonly _queueName: string = "airflow_queue";

	private _brokerService: BrokerService;

	async init() {
		this._brokerService = await BrokerService.getInstance();

		while (true) {
			const queueMessage = await this._brokerService.getMessage(
				this._queueName
			);

			const { dagId, data } = JSON.parse(
				queueMessage.content.toString()
			) as IRequest;

			triggerDag(dagId, data);
		}
	}
}