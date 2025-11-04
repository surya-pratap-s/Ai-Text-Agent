from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging

# Load environment variables from .env file into os.environ
# This makes os.getenv() work everywhere in the app.
load_dotenv()

def create_app():
    
    app = Flask(__name__)

    # --- Configuration ---
    app.config["GEMINIAI_API_KEY"] = os.getenv("GEMINIAI_API_KEY", "")
    app.config["GEMINI_MODEL"] = os.getenv("GEMINI_MODEL", "gemini-2.5-pro")
    
    # Load the allowed origins for CORS, splitting by comma
    allowed_origins = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",")

    # --- Logging ---
    logging.basicConfig(level=logging.INFO)
    app.logger.setLevel(logging.INFO)

    # --- CORS (Cross-Origin Resource Sharing) ---
    CORS(
        app,
        # Only apply CORS rules to endpoints under /api/
        resources={r"/api/*": {"origins": allowed_origins}},
        supports_credentials=True,
        methods=["GET", "POST", "OPTIONS"] # Allow these methods
    )

    # --- Blueprints ---
    # Register the API routes defined in routes.py
    # All routes in that file will be prefixed with /api
    from .routes import api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    # --- Root Endpoint ---
    @app.route("/")
    def root():
        return jsonify({"message": "Hello, Guest! Welcome to AI Agent API."}), 200

    # --- Startup Check ---
    if not app.config["GEMINIAI_API_KEY"]:
        app.logger.warning("GEMINIAI_API_KEY is not set. AI endpoints will fail without it.")

    return app