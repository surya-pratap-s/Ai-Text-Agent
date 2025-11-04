# 🤖 AI Agent Platform (AI Text Agent)

This is a full-stack platform for hosting multiple AI chat agents, built with a **Next.js 14** frontend and a **Flask (Python)** backend. This project is designed as a secure, scalable, and modern template for building and serving specialized AI models.

It comes pre-configured with two distinct agents, both powered by the **Google Gemini API**:
1.  **General AI Agent:** A general-purpose text-to-text chat agent with session history.
2.  **Specialized Agri-Assistant:** A domain-specific agent fine-tuned with a system prompt to answer questions *only* about agriculture.


---

## 🚀 Core Features

* **Multi-Agent Architecture:** The Flask backend is built to serve different AI "personas" from a single API, demonstrated by the `/api/text_to_text` (general) and `/api/ask` (specialized) endpoints.
* **Modern Frontend:** Built with the **Next.js 14 App Router**, **React 19**, and **TypeScript**.
* **Authentication:** Securely integrated with **NextAuth.js** (v4), providing Google OAuth and test credentials providers to protect routes.
* **Specialized AI:** The Agriculture Assistant uses a detailed **system prompt** (`AGRI_PROMPT`) to ensure it stays on topic and provides high-quality, specialized answers.
* **Dynamic UI:**
    * Fully responsive design using **TailwindCSS**.
    * **Dark/Light Mode** support via `next-themes`.
    * Rich **Markdown Rendering** (`react-markdown`) for AI responses, including code highlighting (`rehype-highlight`).
* **Chat Session Management:** The general AI chat (`/ai_text`) automatically saves and loads chat history to/from `localStorage`, allowing users to resume conversations.
* **Scalable Python Backend:** A lightweight Flask API server handles all AI logic, keeping the frontend fast and API keys secure on the server.
* **Clean Codebase:** The project is cleanly separated into a `client` (Next.js) and `server` (Flask) directory, with clear configuration.

---

## 🧩 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14, React 19, TypeScript, TailwindCSS |
| **Backend** | Flask (Python) |
| **AI Model** | Google Gemini API (`google-genai`) |
| **Authentication** | NextAuth.js (Google Provider, Credentials Provider) |
| **UI Components** | `lucide-react` (Icons), `react-markdown` |
| **Server Comms** | REST API, `Flask-CORS` |

---

## 📂 Project Structure

Here is a complete, enhanced README.md file code based on all the features and technologies present in your project files.

Below the README code, you will also find the resume bio you requested.

Complete README.md File Code
Markdown

# 🤖 AI Agent Platform (AI Text Agent)

This is a full-stack platform for hosting multiple AI chat agents, built with a **Next.js 14** frontend and a **Flask (Python)** backend. This project is designed as a secure, scalable, and modern template for building and serving specialized AI models.

It comes pre-configured with two distinct agents, both powered by the **Google Gemini API**:
1.  **General AI Agent:** A general-purpose text-to-text chat agent with session history.
2.  **Specialized Agri-Assistant:** A domain-specific agent fine-tuned with a system prompt to answer questions *only* about agriculture.

![Project Homepage](https://i.imgur.com/v8S7nZk.png)

---

## 🚀 Core Features

* **Multi-Agent Architecture:** The Flask backend is built to serve different AI "personas" from a single API, demonstrated by the `/api/text_to_text` (general) and `/api/ask` (specialized) endpoints.
* **Modern Frontend:** Built with the **Next.js 14 App Router**, **React 19**, and **TypeScript**.
* **Authentication:** Securely integrated with **NextAuth.js** (v4), providing Google OAuth and test credentials providers to protect routes.
* **Specialized AI:** The Agriculture Assistant uses a detailed **system prompt** (`AGRI_PROMPT`) to ensure it stays on topic and provides high-quality, specialized answers.
* **Dynamic UI:**
    * Fully responsive design using **TailwindCSS**.
    * **Dark/Light Mode** support via `next-themes`.
    * Rich **Markdown Rendering** (`react-markdown`) for AI responses, including code highlighting (`rehype-highlight`).
* **Chat Session Management:** The general AI chat (`/ai_text`) automatically saves and loads chat history to/from `localStorage`, allowing users to resume conversations.
* **Scalable Python Backend:** A lightweight Flask API server handles all AI logic, keeping the frontend fast and API keys secure on the server.
* **Clean Codebase:** The project is cleanly separated into a `client` (Next.js) and `server` (Flask) directory, with clear configuration.

---

## 🧩 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14, React 19, TypeScript, TailwindCSS |
| **Backend** | Flask (Python) |
| **AI Model** | Google Gemini API (`google-genai`) |
| **Authentication** | NextAuth.js (Google Provider, Credentials Provider) |
| **UI Components** | `lucide-react` (Icons), `react-markdown` |
| **Server Comms** | REST API, `Flask-CORS` |

---

## 📂 Project Structure

---

    /ai-text-agent 
      ├── /client # Next.js 14 Frontend 
      │ ├── /app 
      │ │ ├── /ai_agent # Specialized Agri-Bot Page 
      │ │ ├── /ai_text # General Chat-History Page 
      │ │ ├── /api/auth # NextAuth.js Route Handler 
      │ │ └── page.tsx # Homepage / Service Selector 
      │ ├── /components # Shared React Components (Header, Footer, SEO) 
      │ ├── tailwind.config.js 
      │ └── package.json 
      │── /server # Flask (Python) Backend 
      | ├── /api 
      | │  ├── init.py # Creates Flask App, configures CORS 
      | │  └── routes.py # API endpoints (/ask, /text_to_text) & AI logic 
      | ├── app.py # Entry point to run the server 
      | └── requirements.txt

---

## ⚙️ Setup & Installation

To run this project, you need to set up both the server and the client.

### 1. Server (Flask)

The server runs on port `5000` (by default).

```bash
# 1. Navigate to the server directory
cd server

# 2. Create a virtual environment
python -m venv venv
source venv/bin/activate  # (or .\venv\Scripts\activate on Windows)

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Create a .env file in the /server directory
# (See .env.example if one exists, or add the following)
GEMINIAI_API_KEY="YOUR_GOOGLE_AI_API_KEY"
CORS_ALLOWED_ORIGINS="http://localhost:3000" # Client URL
FLASK_DEBUG="1"

# 5. Run the server
flask run


# 1. Navigate to the client directory
cd client

# 2. Install Node.js dependencies
npm install

# 3. Create a .env.local file in the /client directory
# These are required for NextAuth and the API connection
NEXT_PUBLIC_API_URL="http://localhost:5000/api"

# NextAuth Secrets (generate a secret: openssl rand -hex 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="YOUR_32_CHAR_SECRET_HERE"

# Google Provider (from Google Cloud Console)
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"

# 4. Run the client
npm run dev

***End***
