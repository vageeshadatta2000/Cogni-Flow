# CogniFlow: AI Workflow Orchestrator

**CogniFlow is a modern, visual, and interactive web application for designing, orchestrating, and executing complex AI-driven workflows. Built with React and TypeScript, it provides a sleek drag-and-drop interface inspired by professional tools like Stack AI to chain together different processing tasks.**

![CogniFlow UI Screenshot](https://user-images.githubusercontent.com/12345/placeholder.png) <!-- It's recommended to replace this with a new screenshot -->

## ✨ Key Features

*   **Visual Workflow Builder**: A drag-and-drop canvas powered by React Flow to intuitively build and manage workflows.
*   **Professional UI**: A sleek, light-themed interface inspired by modern AI tools. Panels and nodes are floating elements for a clean, layered look.
*   **Categorized Nodes**: Nodes feature a colored header "pill" for easy identification (e.g., Action, I/O, Logic).
*   **Rich Node Library**:
    *   **Core Nodes**: `Text Input`, `Output`, and `Merge` to start, end, and combine workflow paths.
    *   **AI Nodes**: `AI Text` (Generation), `Web Search` (with sources), and `AI Image` (Generation).
    *   **Logic & Data Nodes**:
        *   `Decision`: Implement conditional `if/else` logic to create dynamic, branching workflows.
        *   `JSON`: Parse and stringify JSON data.
        *   `Code`: Run custom JavaScript to perform complex data transformations (**Use with caution**).
*   **Dynamic Execution Engine**: An intelligent engine that processes nodes in the correct order, handles branching and merging, and prevents infinite loops.
*   **Real-time Feedback**: Nodes display their status (running, success, error) and metadata like execution time and token count upon completion.
*   **Interactive Controls**: A floating sidebar for adding elements and a clean footer for canvas navigation.

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript
*   **UI Components**: Tailwind CSS for styling
*   **Workflow Canvas**: [React Flow](https://reactflow.dev/)
*   **AI Services**: Abstraction layer for Google Gemini API (`gemini-2.5-flash` for text/search, `imagen-3.0-generate-002` for images)
*   **Build/Dev**: Vite

## 🚀 Getting Started

### Prerequisites

*   Node.js and npm (or yarn/pnpm)
*   A valid API Key for the AI services being used.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/cogniflow.git
    cd cogniflow
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    For local development, create a file named `.env.local` in the root of the project. Add your API key to this file, prefixed with `VITE_`.
    ```
    VITE_API_KEY=your_secret_api_key_here
    ```
    *Note: When deploying to a platform like Vercel or Netlify, you will set `VITE_API_KEY` in their environment variable settings dashboard.*

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on a local port (e.g., `http://localhost:5173`).

## 💡 How to Use

1.  **Add Elements**: Click the `+` icon on the far-left navigation bar to open the "Add Elements" panel. Drag nodes from this panel onto the canvas.
2.  **Connect Nodes**: Click and drag from the handle (small circle) on one node to a handle on another to create a connection.
3.  **Configure Nodes**: Click on any node on the canvas to open the **Properties Panel** on the right. Here you can change its label, set prompts, define conditions, or write custom code.
4.  **Run the Workflow**: Click the **Run** button in the header. Nodes will update their status in real-time as they execute.
5.  **View Results**: The final result will appear in the **Output** node(s). Intermediate results and metadata can be seen within each node after it successfully executes.