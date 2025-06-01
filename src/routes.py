# src/routes.py
from flask import jsonify, make_response, request
from src.Application.Controllers.seller_controller import SellerController
from src.Application.Controllers.auth_controller import AuthController
from src.Application.Controllers.product_controller import ProductController
from src.Application.Controllers.sale_controller import SaleController
from flask_jwt_extended import jwt_required # Import jwt_required
import logging

logger = logging.getLogger(__name__)

def init_routes(app):
    
    # --- Health Check --- 
    @app.route("/api/health", methods=["GET"])
    def health():
        logger.info("Health check endpoint accessed.")
        return make_response(jsonify({
            "mensagem": "API - OK; Docker - Up",
        }), 200)
    
    # --- Seller Registration & Activation --- 
    @app.route("/api/sellers", methods=["POST"])
    def register_seller():
        logger.info("Received request to register seller.")
        # Error handling is already inside the original function
        return SellerController.register_seller(request.get_json())

    @app.route("/api/sellers/activate", methods=["POST"])
    def activate_seller():
        logger.info("Received request to activate seller.")
        # Error handling is already inside the original function
        return SellerController.activate_seller(request.get_json())

    # --- Authentication --- 
    @app.route("/api/auth/login", methods=["POST"])
    def login():
        logger.info("Received request for seller login.")
        # Controller handles JSON parsing and error responses
        return AuthController.login()

    # --- Product Management (Protected Routes) --- 
    @app.route("/api/products", methods=["POST"])
    @jwt_required() # Protect this route
    def create_product():
        logger.info("Received request to create product.")
        return ProductController.create_product()

    @app.route("/api/products", methods=["GET"])
    @jwt_required() # Protect this route
    def get_products():
        logger.info("Received request to get products.")
        return ProductController.get_products()

    @app.route("/api/products/<int:product_id>", methods=["GET"])
    @jwt_required() # Protect this route
    def get_product(product_id):
        logger.info(f"Received request to get product ID: {product_id}")
        return ProductController.get_product(product_id)

    @app.route("/api/products/<int:product_id>", methods=["PUT"])
    @jwt_required() # Protect this route
    def update_product(product_id):
        logger.info(f"Received request to update product ID: {product_id}")
        return ProductController.update_product(product_id)

    # Route for inactivation - Using PATCH might be more semantically correct, 
    # but aligning with controller logic which expects a PUT/POST-like action.
    # Let's create a specific sub-route for clarity.
    @app.route("/api/products/<int:product_id>/inactivate", methods=["PATCH"])
    @jwt_required() # Protect this route
    def inactivate_product(product_id):
        logger.info(f"Received request to inactivate product ID: {product_id}")
        # The controller method handles the logic, just call it.
        return ProductController.inactivate_product(product_id)

    # --- Sales Management (Protected Route) ---
    @app.route("/api/sales", methods=["POST"])
    @jwt_required() # Protect this route
    def record_sale():
        logger.info("Received request to record sale.")
        return SaleController.record_sale()

    # --- Global Error Handler (Optional but Recommended) ---
    @app.errorhandler(Exception)
    def handle_exception(e):
        # Log the error and stacktrace
        logger.error(f"An unhandled exception occurred: {str(e)}", exc_info=True)
        # Return a generic server error message
        # Avoid leaking implementation details in production
        response = {"erro": "Ocorreu um erro interno no servidor."}
        # Use 500 for internal server errors
        # Specific error codes (400, 401, 404) should be handled in controllers
        return make_response(jsonify(response), 500)

    logger.info("Routes initialized successfully.")

