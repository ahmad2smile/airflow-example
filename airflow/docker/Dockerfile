FROM apache/airflow:1.10.12-python3.6

COPY ./docker/entrypoint.sh /entrypoint.sh

USER root

RUN mkdir /usr/local/airflow
RUN chown airflow /usr/local/airflow
RUN chmod +x /entrypoint.sh

# Install packages
RUN pip install pika

USER airflow

ENTRYPOINT /entrypoint.sh
