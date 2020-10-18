import axios from "axios";

const airflowInstance = axios.create({
	baseURL: "http://airflow:8080/api/experimental"
});

export const triggerDag = (dagId: string, data: any): Promise<any> => {
	return airflowInstance.post(`/dags/${dagId}/dag_runs`, data, {
		headers: {
			"Content-Type": "application/json"
		}
	});
};
