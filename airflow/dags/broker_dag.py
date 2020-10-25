import airflow
from airflow.operators.python_operator import BranchPythonOperator, PythonOperator
from airflow.operators.dagrun_operator import TriggerDagRunOperator
from airflow.models import DAG
from airflow.exceptions import AirflowSkipException
from datetime import datetime, timedelta

import requests

args = {
    'owner': 'Airflow Example',
    'start_date': airflow.utils.dates.days_ago(1),
}

def publish_results(queue_name):
        response = requests.post(
            url='http://airflow-server:3005/publish', data={'queueName': queue_name, 'data': {'message': 'some data'}}, headers={"Content-Type": "application/json"})
        print('=================Published Results=================')
        print(response.status_code)

def expensive_task(queue_name, **kwargs):
    if queue_name:
        print('=================Got Results=================')
        print(queue_name)
        publish_results(queue_name)
    else:
        print('=================Things blew=================')




with DAG(dag_id='amqp_dag', default_args=args, catchup=False) as dag:
    listener_task = PythonOperator(
        task_id='listener_task',
        python_callable=expensive_task,
        provide_context=True,
        op_kwargs={'queue_name': 'empty'},
    )

    listener_task
