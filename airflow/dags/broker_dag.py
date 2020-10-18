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
    'schedule_interval': '*/1 * * * *',
}


def expensive_task(params, **_):
    queue_name = params['queue_name']
    if queue_name:
        print('=================Got Results=================')
        print(queue_name)
    else:
        print('=================Things blew=================')


def publish_results(params, **_):
    queue_name = params['queue_name']
    if queue_name:
        response = requests.post(
            url='http://airflow-server:3005/publish', data={'queueName': queue_name, 'data': {'message': 'some data'}}, headers={"Content-Type": "application/json"})
        print('=================Published Results=================')
        print(response.status_code)
    else:
        print('=================Things blew=================')


dag = DAG(dag_id='amqp_dag', default_args=args, catchup=False)

listener_task = PythonOperator(
    task_id='listener_task',
    python_callable=expensive_task,
    provide_context=True,
    templates_dict={'queue_name': "{{dag_run.conf['queue_name']}}"},
    dag=dag
)

publish_results_task = PythonOperator(
    task_id="publish_results_task",
    python_callable=publish_results,
    provide_context=True,
    templates_dict={'queue_name': "{{dag_run.conf['queue_name']}}"},
    dag=dag
)

listener_task >> publish_results_task
