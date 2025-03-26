FROM python:3.8-slim
WORKDIR /src
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .

RUN apt-get update && apt-get install -y gcc \
    && pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=development  # Mude para "production" em produção

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
