# Ghidra Brutalist: AI Decompilation Assistant

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cris-renee/generated-app-AI-for-ghidra)

Ghidra Brutalist is a minimalist, Brutalist-style web application designed to augment the reverse engineering workflow. Users paste decompiled C/C++ code from tools like Ghidra into a raw text interface. The application then leverages powerful AI models via the Cloudflare Agents backend to perform various analyses. These include generating plain-English explanations of the code's logic, identifying potential security vulnerabilities, suggesting more meaningful variable and function names, and even translating the low-level code into a high-level Python equivalent for better comprehension. The UI is intentionally stark, focusing on function over form with large typography, a high-contrast color scheme, and blocky, functional elements, creating a powerful and focused tool for deep code analysis.

## Key Features

*   **AI-Powered Code Analysis**: Get plain-English explanations of complex C/C++ code.
*   **Vulnerability Detection**: Identify potential security vulnerabilities in the provided code snippet.
*   **Smart Refactoring**: Receive AI-generated suggestions for more meaningful variable and function names.
*   **Code Translation**: Translate low-level C/C++ into high-level, readable Python.
*   **Brutalist UI**: A stark, functional, and high-contrast interface that prioritizes content and clarity.
*   **Real-time Streaming**: AI responses are streamed in real-time for an interactive experience.
*   **Built on Cloudflare**: Leverages the power and speed of Cloudflare Workers and Agents for the backend.

## Technology Stack

*   **Frontend**:
    *   React
    *   Vite
    *   TypeScript
    *   Tailwind CSS
    *   Zustand
    *   Framer Motion
*   **Backend**:
    *   Cloudflare Workers
    *   Cloudflare Agents (Durable Objects)
    *   Hono
*   **AI**:
    *   Cloudflare AI Gateway
    *   OpenAI Models

## Getting Started

Follow these instructions to get the project running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [Bun](https://bun.sh/) package manager
*   A Cloudflare account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd ghidra_brutalist
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up environment variables:**

    Create a `.dev.vars` file in the root of the project. This file is used by Wrangler to load environment variables for local development.

    ```ini
    # .dev.vars
    CF_AI_BASE_URL="https://gateway.ai.cloudflare.com/v1/YOUR_ACCOUNT_ID/YOUR_GATEWAY_ID/openai"
    CF_AI_API_KEY="your-cloudflare-api-key"
    ```

    *   `CF_AI_BASE_URL`: Your Cloudflare AI Gateway URL.
    *   `CF_AI_API_KEY`: Your Cloudflare AI Gateway API key.

4.  **Run the development server:**

    This command starts the Vite frontend and the Wrangler development server for the backend worker simultaneously.

    ```bash
    bun run dev
    ```

    The application should now be running on `http://localhost:3000`.

## Usage

1.  Open the application in your browser.
2.  Paste a snippet of decompiled C or C++ code into the large text area on the left.
3.  Click one of the analysis action buttons below the text area (e.g., 'EXPLAIN LOGIC').
4.  The AI-generated analysis will be streamed into the results panel on the right.

## Development

The project is structured into two main parts: the frontend application and the backend worker.

*   `src/`: Contains all the frontend React code.
    *   `src/pages/HomePage.tsx`: The main and only view of the application, containing all UI and state logic.
    *   `src/lib/chat.ts`: The `chatService` used to communicate with the backend worker.
*   `worker/`: Contains the Cloudflare Worker backend code.
    *   `worker/agent.ts`: The core `ChatAgent` Durable Object that manages chat state and logic.
    *   `worker/chat.ts`: The `ChatHandler` class responsible for interacting with the AI model.
    *   `worker/userRoutes.ts`: Defines the API routes for the application.

## Deployment

This project is designed to be deployed to Cloudflare.

1.  **Login to Cloudflare:**
    ```bash
    bunx wrangler login
    ```

2.  **Deploy the application:**
    ```bash
    bun run deploy
    ```
    This command will build the frontend application and deploy both the static assets and the worker to your Cloudflare account.

3.  **Configure Secrets:**
    After deployment, you must add your `CF_AI_API_KEY` as a secret to your deployed worker.
    ```bash
    bunx wrangler secret put CF_AI_API_KEY
    ```
    You will be prompted to enter the secret value.

Alternatively, deploy directly from your GitHub repository:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cris-renee/generated-app-AI-for-ghidra)