# CogniFlow - Design & Architecture

This document provides an in-depth explanation of the design philosophy, architecture, and component structure of the CogniFlow application.

## 1. Core Concepts

The application is built around a few central ideas that enable its functionality, with a design philosophy centered on a clean, light, and professional user experience inspired by tools like Stack AI.

### 1.1. Nodes & Edges

The visual workflow is composed of **Nodes** and **Edges**, a concept central to [React Flow](https://reactflow.dev/).

*   **Nodes**: These are the individual processing units in a workflow, styled as floating white cards. Each node has a specific `type` (e.g., `input`, `textGenerator`) which determines its behavior. It holds its own `data`, including configuration (like a prompt template), current `status` (Idle, Running, Success, Error), and post-execution metadata like `result`, `executionTime`, and `tokenCount`.
*   **Node Category**: To improve readability, each node has a `category` (`io`, `ai`, `logic`, `utility`) which determines the color and text of a **header pill**. This allows users to quickly parse the function of different parts of a workflow.
*   **Edges**: These are the connections between nodes, styled as simple, curved gray lines. They define the flow of data and control. Data always flows from an edge's `source` to its `target`. For the `Decision` node, edges also have a `sourceHandle` (`'true'` or `'false'`) to enable conditional routing.

### 1.2. The Execution Engine

The heart of the application is the `runWorkflow` function in `App.tsx`. It is **dynamic, asynchronous, and robust**.

*   **Topological Sort (Implicit)**: It uses a queue-based approach that correctly executes nodes in dependency order, starting with nodes that have no incoming connections (an `in-degree` of 0).
*   **Asynchronous Operations**: The engine is fully `async/await` compatible, waiting for API calls or custom code to complete before proceeding.
*   **Real-time Feedback**: It uses the `updateNodeData` function to update the UI in real-time, changing a node's status and displaying results, errors, and performance metadata as they become available.
*   **Advanced Logic Handling**:
    *   **Branching (`Decision` Node)**: After it executes, it only enqueues the child node connected to the correct `true` or `false` path.
    *   **Merging (`Merge` Node)**: This node naturally works with the in-degree system. It's only enqueued after *all* of its parents have finished.
*   **Cycle Detection**: Before execution, a Depth First Search (DFS) algorithm runs to detect cycles in the graph, preventing infinite loops.

## 2. Project & File Structure

The project is organized to separate concerns, making it easier to maintain and extend.

*   `App.tsx`: The top-level component that orchestrates the entire application layout and state.
*   `services/aiService.ts`: An abstraction layer that handles all communication with external AI APIs.
*   `components/`: Contains all reusable React components.
    *   `customNodes/`: Holds the components for each specific node type (`InputNode`, `TextGeneratorNode`, etc.).
    *   `Sidebar.tsx`: The two-part floating panel system on the left for adding new nodes.
    *   `SettingsPanel.tsx`: The floating panel on the right for configuring a selected node.
    *   `icons.tsx`: A collection of SVG icons used throughout the UI.
*   `types.ts`: Defines all shared TypeScript types and enums.

## 3. Component Breakdown

### Custom Nodes (`components/customNodes/*.tsx`)

*   **`BaseNode.tsx`**: This is a critical wrapper component. It provides the common "card" styling for all nodes, including the header with its colored pill and title, the main body, and the footer for displaying execution metadata. This ensures a consistent look and feel across the entire canvas.
*   **Layouts**: Each specific node component (`TextGeneratorNode`, etc.) is responsible for its internal layout, such as the "PROMPT" box or the display of results, which are styled to match the target UI.

### `Sidebar.tsx`

*   This component is now a **two-part system** to provide a cleaner and more organized user experience.
    1.  **`Icon Navigation Bar`**: A permanent, thin vertical bar on the far left with primary action icons (like Add, History).
    2.  **`AddElementsPanel`**: A secondary, wider panel that is conditionally rendered when the 'Add' icon is clicked. It contains a searchable, collapsible accordion of all available nodes, grouped by category.

### `SettingsPanel.tsx`

*   This is a floating panel on the right that appears when a node is selected.
*   **Conditional Rendering**: It renders different form fields based on the `type` of the `selectedNode`.
*   **Data Flow**: When a user changes a setting, it calls the `onUpdateNodeData` prop passed from `App.tsx` to "lift state up," ensuring a single source of truth for all node data.

## 4. Security Considerations

### The `Code Node`

The `Code Node` provides immense flexibility but introduces significant security risks.

*   **Arbitrary Code Execution**: The node uses `new Function('input', code)` to run user-provided strings as JavaScript.
*   **Risks**: In a multi-user or public environment, a malicious user could execute code to steal data, make unauthorized API calls, or perform XSS attacks.
*   **Mitigation**: For a production-grade, multi-tenant version, this node would need to be either **disabled** or executed in a **secure sandbox** (e.g., a Web Worker or serverless function).
*   **UI Warnings**: The application includes prominent warnings in the UI to alert the user to the potential danger.