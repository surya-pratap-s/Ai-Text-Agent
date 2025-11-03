import os
from flask import Blueprint, jsonify, request, current_app
import google.generativeai as genai

api_bp = Blueprint("api", __name__)

def get_genai_model():
    
    api_key = current_app.config.get("GEMINIAI_API_KEY")
    model_name = current_app.config.get("GEMINI_MODEL", "gemini-2.5-flash")

    if not api_key:
        raise RuntimeError("GEMINIAI_API_KEY is not configured in the application.")

    # Configure the library with the API key
    genai.configure(api_key=api_key)

    # Create and return a model handle
    return genai.GenerativeModel(model_name)


@api_bp.route("/text_to_text", methods=["POST"])
def chat():
    try:
        # ensure JSON body
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400

        data = request.get_json()
        prompt = data.get("prompt", "")
        if not isinstance(prompt, str) or not prompt.strip():
            return jsonify({"error": "Prompt is required and must be a non-empty string"}), 400

        # limit prompt length to prevent abuse
        max_len = int(os.getenv("PROMPT_MAX_LENGTH", 2000))
        if len(prompt) > max_len:
            return jsonify({"error": f"Prompt too long (max {max_len} characters)"}), 400

        # Get configured model
        model = get_genai_model()
        response = model.generate_content(prompt)

        # Some libraries return nested objects; handle safely
        reply_text = getattr(response, "text", None)
        if reply_text is None:
            # try other common structure
            reply_text = str(response)

        return jsonify({"reply": reply_text}), 200

    except RuntimeError as re:
        # configuration errors
        current_app.logger.exception("Configuration error")
        return jsonify({"error": str(re)}), 500

    except Exception as e:
        # Log unexpected errors for debugging (server-side)
        current_app.logger.exception("Error while generating content")
        return jsonify({"error": "Server error: " + str(e)}), 500
    
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

@api_bp.route("/ask", methods=["POST"])
def agent():
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400

        data = request.get_json()
        user_query = data.get("query", "").strip()

        if not user_query:
            return jsonify({"error": "Query missing"}), 400

        # Get configured model
        model = get_genai_model()

        # Combine structured prompt
        prompt = f"{AGRI_PROMPT}\n\nUser Question: {user_query}\n\nAI Response:"

        # Generate response
        response = model.generate_content(prompt)

        reply_text = getattr(response, "text", None)
        if not reply_text:
            reply_text = str(response)

        return jsonify({"reply": reply_text.strip()}), 200

    except RuntimeError as re:
        current_app.logger.exception("Configuration error")
        return jsonify({"error": str(re)}), 500

    except Exception as e:
        current_app.logger.exception("Error while generating content")
        return jsonify({"error": f"Server error: {e}"}), 500