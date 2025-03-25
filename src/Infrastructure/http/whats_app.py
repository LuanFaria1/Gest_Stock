import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER")

def send_whatsapp_message(to_number, message):
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

        message = client.messages.create(
            from_=f'whatsapp:{TWILIO_WHATSAPP_NUMBER}',
            body=message,
            to=f'whatsapp:{to_number}'
        )

        print(f"Mensagem enviada com sucesso! SID: {message.sid}")
    except Exception as e:
        print(f"Erro ao enviar mensagem: {e}")

#testando o envio aqui pessoal (Depois remover)
if __name__ == "__main__":
    destinatario = "whatsapp:+5511xxxx-xxxx"
    mensagem = "Olá! Esta é uma mensagem de teste via WhatsApp usando Twilio."
    send_whatsapp_message(destinatario, mensagem)
