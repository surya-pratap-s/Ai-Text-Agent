from flask import Blueprint, jsonify, request, current_app
from google import genai
from google.genai import types

# Create a 'Blueprint'
api_bp = Blueprint("api", __name__)

@api_bp.route("/status", methods=["GET"])
def status():
    return jsonify({"status": "ok"}), 200

# --- Cached Clients ---
_client = None
_model_default = None
_model_agri = None


# --- Agriculture Assistant Prompt ---
# This is the "system instruction" for the Agri bot.
AGRI_PROMPT = """
You are an **AI Agriculture Assistant** specialized in helping farmers, agri-entrepreneurs, and exporters.

Your purpose:
- Help ONLY with topics related to agriculture, farming, crop management, soil, fertilizers, irrigation, weather, pests, market prices, and export.
- If a question is NOT related to agriculture or farming, respond strictly:
  "I'm an Agriculture Assistant and can only answer agriculture-related questions."

Your responses must:
1. Start with a short summary.
2. Then provide step-by-step guidance.
3. Use simple, easy-to-understand language for farmers.
4. Give practical Indian agriculture examples when possible.
5. Avoid complex technical jargon.

Tone:
- Friendly, supportive, and educational.
- Clear, practical, and concise.
"""

# --- Helper for Configuration ---

def _get_gemini_client():
    """
    Returns a singleton Gemini client.
    Initializes it on the first call using the app's API key.
    """
    global _client
    # Only create the client if it hasn't been created yet
    if _client is None:
        api_key = current_app.config.get("GEMINIAI_API_KEY")
        if not api_key:
            # If the key is missing, log it and raise an error
            # This will be caught by the route's try/except block
            current_app.logger.error("GEMINIAI_API_KEY is missing")
            raise RuntimeError("GEMINIAI_API_KEY must be set in Flask config")

        # Create and cache the client
        _client = genai.Client(api_key=api_key)
        current_app.logger.info("Gemini client initialized")
    return _client


def _get_model_name():
    """Helper to get the configured model name from app config."""
    return current_app.config.get("GEMINI_MODEL", "gemini-2.5-pro")


# --- Validation ---

def _validate_request(query_key="prompt"):
    if not request.is_json:
        return None, (jsonify({"error": "Request must be JSON"}), 400)

    data = request.get_json()
    query = data.get(query_key, "").strip()
    if not query:
        return None, (jsonify({"error": f"'{query_key}' is required and must be non-empty"}), 400)

    # Success! Return the full data payload
    return data, None


# --- Default Model (General Chat) ---

def get_default_model():
    """
    Returns a cached config for the general chat model.
    Uses the singleton pattern like the client.
    """
    global _model_default
    if _model_default is None:
        _model_default = {
            "model": _get_model_name(),
            "config": types.GenerateContentConfig(
                # Configures "on-the-fly" processing
                thinking_config=types.ThinkingConfig(thinking_budget=512)
            ),
        }
    return _model_default


# --- Agriculture Assistant Model ---

def get_agri_model():
    """
    Returns a cached config for the specialized Agri bot.
    Injects the AGRI_PROMPT as a 'system_instruction'.
    """
    global _model_agri
    if _model_agri is None:
        _model_agri = {
            "model": _get_model_name(),
            "config": types.GenerateContentConfig(
                # This is the key: it tells the model its "persona"
                system_instruction=AGRI_PROMPT,
                thinking_config=types.ThinkingConfig(thinking_budget=1024)
            ),
        }
    return _model_agri


# --- Extract Text ---

def _extract_text(response):
    """Safely extract generated text from the Gemini response."""
    try:
        # Check for empty or invalid responses
        if not response:
            return None, "Empty response from Gemini API"
        # Check if the 'text' attribute exists and has content
        if hasattr(response, "text") and response.text:
            return response.text.strip(), None
        # Fallback error
        return None, "No text returned from Gemini API"
    except Exception as e:
        # Log the full exception for debugging
        current_app.logger.exception("Error parsing Gemini response")
        return None, str(e)


# --- ROUTES ---

@api_bp.route("/text_to_text", methods=["POST"])
def text_to_text():
    """
    General purpose endpoint.
    Expects JSON: {"prompt": "User's question"}
    """
    # 1. Validate the request
    # Uses "prompt" as the key and "PROMPT_MAX_LENGTH" for length check
    data, error = _validate_request("prompt")
    if error:
        return error # Returns the (error_json, status_code) tuple

    prompt = data["prompt"]

    try:
        # 2. Get the singleton client and model config
        client = _get_gemini_client()
        model_info = get_default_model()

        # 3. Call the Gemini API
        response = client.models.generate_content(
            model=model_info["model"],
            contents=prompt,
            config=model_info["config"],
        )

        # 4. Extract the text response
        reply, err = _extract_text(response)
        if err:
            return jsonify({"error": err}), 400

        # 5. Send success response
        return jsonify({"reply": reply}), 200

    except Exception as e:
        # Catch-all for unexpected errors (like API key failure)
        current_app.logger.exception("Error in /text_to_text")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/ask", methods=["POST"])
def ask_agriculture():
    """
    Agriculture assistant endpoint.
    Expects JSON: {"query": "User's farm question"}
    """
    # 1. Validate the request
    # Uses "query" as the key
    # *** FIX: Changed "AGENT_MAX_LENGTH" to "PROMPT_MAX_LENGTH" ***
    # Now it correctly uses the setting from your .env file
    data, error = _validate_request("query")
    if error:
        return error

    user_query = data["query"]

    try:
        # 2. Get the singleton client and Agri model config
        client = _get_gemini_client()
        model_info = get_agri_model() # <-- Uses the Agri config

        # 3. Call the Gemini API
        response = client.models.generate_content(
            model=model_info["model"],
            contents=user_query,
            config=model_info["config"], # <-- This config has the AGRI_PROMPT
        )

        # 4. Extract the text response
        reply, err = _extract_text(response)
        if err:
            return jsonify({"error": err}), 400

        # 5. Send success response
        return jsonify({"reply": reply}), 200

    except Exception as e:
        # Catch-all for unexpected errors
        current_app.logger.exception("Error in /ask (agriculture)")
        return jsonify({"error": str(e)}), 500