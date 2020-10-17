FROM apache/airflow:1.10.12-python3.6

COPY ./airflow/docker/entrypoint.sh /entrypoint.sh

USER root

RUN mkdir /usr/local/airflow
RUN chown airflow /usr/local/airflow
RUN chmod +x /entrypoint.sh

USER airflow

ENTRYPOINT /entrypoint.sh
