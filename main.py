
import sys
from PyQt5.QtWidgets import QApplication
from ui import MinimercadoApp
from db import inicializar_banco

if __name__ == "__main__":
    inicializar_banco()
    app = QApplication(sys.argv)
    window = MinimercadoApp()
    window.show()
    sys.exit(app.exec_())
