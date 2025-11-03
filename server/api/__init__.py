from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging

# Load environment variables from .env file into os.environ
load_dotenv()

def create_app():
    app = Flask(__name__)

    # Basic configuration values stored centrally on app.config
    app.config["GEMINIAI_API_KEY"] = os.getenv("GEMINIAI_API_KEY", "")
    app.config["GEMINI_MODEL"] = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    
    allowed_origins = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",")

    # Configure logging (simple)
    logging.basicConfig(level=logging.INFO)
    app.logger.setLevel(logging.INFO)

    # Configure CORS for /api/* only, using environments
    CORS(
        app,
        resources={r"/api/*": {"origins": allowed_origins}},
        supports_credentials=True,
        methods=["GET", "POST", "OPTIONS"]
    )

    # Register API blueprint
    from .routes import api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    # Root - simple health / welcome endpoint
    @app.route("/")
    def root():
        return jsonify({"message": "Hello, Guest! Welcome to AI Agent API."}), 200

    # Basic check to ensure API key is present (app start warning)
    if not app.config["GEMINIAI_API_KEY"]:
        app.logger.warning("GEMINIAI_API_KEY is not set. AI endpoints will fail without it.")

    return app