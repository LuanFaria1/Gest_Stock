FROM python:3.8-slim
WORKDIR /src
COPY requirements.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY . /src

EXPOSE 5000

ENV FLASK_RUN_HOST=0.0.0.0

CMD ["flask", "run"]

FROM python:3.8-slim

WORKDIR /src

COPY requirements.txt requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY . /src

EXPOSE 5000

ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=development  # Mude para "production" em produção
CMD ["flask", "run"]
