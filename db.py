
import sqlite3

conn = sqlite3.connect("minimercado.db", check_same_thread=False)
cursor = conn.cursor()

def inicializar_banco():
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        preco REAL NOT NULL,
        estoque INTEGER NOT NULL,
        ativo BOOLEAN NOT NULL
    )
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sellers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        ativo BOOLEAN NOT NULL
    )
    """)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS vendas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_produto INTEGER NOT NULL,
        quantidade INTEGER NOT NULL,
        preco_unitario REAL NOT NULL,
        id_seller INTEGER NOT NULL,
        data TEXT NOT NULL,
        FOREIGN KEY(id_produto) REFERENCES produtos(id),
        FOREIGN KEY(id_seller) REFERENCES sellers(id)
    )
    """)
    conn.commit()
