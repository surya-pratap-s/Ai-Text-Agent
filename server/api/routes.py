from flask import Blueprint, jsonify, request, current_app
from google import genai
from google.genai import types

api_bp = Blueprint("api", __name__)

# --- Cached Clients ---
_client = None
_model_default = None
_model_agri = None


# --- Agriculture Assistant Prompt ---
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
    """Return a singleton Gemini client."""
    global _client
    if _client is None:
        api_key = current_app.config.get("GEMINIAI_API_KEY")
        if not api_key:
            current_app.logger.error("GEMINIAI_API_KEY is missing")
            raise RuntimeError("GEMINIAI_API_KEY must be set in Flask config")

        _client = genai.Client(api_key=api_key)
        current_app.logger.info("Gemini client initialized")
    return _client


def _get_model_name():
    return current_app.config.get("GEMINI_MODEL", "gemini-2.5-pro")


# --- Validation ---

def _validate_request(query_key="prompt", max_len_key="PROMPT_MAX_LENGTH"):
    """Validate and extract user query from JSON request."""
    if not request.is_json:
        return None, (jsonify({"error": "Request must be JSON"}), 400)

    data = request.get_json()
    query = data.get(query_key, "").strip()
    if not query:
        return None, (jsonify({"error": f"'{query_key}' is required and must be non-empty"}), 400)

    max_len = current_app.config.get(max_len_key, 2000)
    if len(query) > max_len:
        return None, (jsonify({"error": f"'{query_key}' too long (max {max_len} characters)"}), 400)

    return data, None


# --- Default Model (General Chat) ---

def get_default_model():
    """Return model config for general chat."""
    global _model_default
    if _model_default is None:
        _model_default = {
            "model": _get_model_name(),
            "config": types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(thinking_budget=512)
            ),
        }
    return _model_default


# --- Agriculture Assistant Model ---

def get_agri_model():
    """Return model config with agriculture assistant role."""
    global _model_agri
    if _model_agri is None:
        _model_agri = {
            "model": _get_model_name(),
            "config": types.GenerateContentConfig(
                system_instruction=AGRI_PROMPT,
                thinking_config=types.ThinkingConfig(thinking_budget=1024)
            ),
        }
    return _model_agri


# --- Extract Text ---

def _extract_text(response):
    """Safely extract generated text or return an error."""
    try:
        if not response:
            return None, "Empty response from Gemini API"
        if hasattr(response, "text") and response.text:
            return response.text.strip(), None
        return None, "No text returned from Gemini API"
    except Exception as e:
        current_app.logger.exception("Error parsing Gemini response")
        return None, str(e)


# --- ROUTES ---

@api_bp.route("/text_to_text", methods=["POST"])
def text_to_text():
    """General purpose endpoint."""
    data, error = _validate_request("prompt", "PROMPT_MAX_LENGTH")
    if error:
        return error

    prompt = data["prompt"]

    try:
        client = _get_gemini_client()
        model_info = get_default_model()

        response = client.models.generate_content(
            model=model_info["model"],
            contents=prompt,
            config=model_info["config"],
        )

        reply, err = _extract_text(response)
        if err:
            return jsonify({"error": err}), 400

        return jsonify({"reply": reply}), 200

    except Exception as e:
        current_app.logger.exception("Error in /text_to_text")
        return jsonify({"error": str(e)}), 500


@api_bp.route("/ask", methods=["POST"])
def ask_agriculture():
    """Agriculture assistant endpoint."""
    data, error = _validate_request("query", "AGENT_MAX_LENGTH")
    if error:
        return error

    user_query = data["query"]

    try:
        client = _get_gemini_client()
        model_info = get_agri_model()

        response = client.models.generate_content(
            model=model_info["model"],
            contents=user_query,
            config=model_info["config"],
        )

        reply, err = _extract_text(response)
        if err:
            return jsonify({"error": err}), 400

        return jsonify({"reply": reply}), 200

    except Exception as e:
        current_app.logger.exception("Error in /ask (agriculture)")
        return jsonify({"error": str(e)}), 500
