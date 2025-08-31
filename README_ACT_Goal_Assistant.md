# Values-Based Goal Writing Assistant

## Project Description

This is a simple web application designed to assist educators, students, and families in writing clear, measurable, and values-aligned Individualized Education Program (IEP) or behavior goals. It leverages principles from Acceptance and Commitment Training (ACT) to help users articulate goals that are meaningful and actionable.

## Key Features

*   **Values Selection:** Users can browse and select from a predefined list of core values to guide their goal-setting process.
*   **Goal Prompt Generation:** The application will provide structured prompts and sentence starters to help users formulate specific, measurable, achievable, relevant, and time-bound (SMART) goals.
*   **Goal Input & Refinement:** A dedicated area for users to write and refine their goals, with guidance on incorporating measurable criteria and positive behavioral language.
*   **Print/Export Option:** Functionality to easily print or copy the finalized goals for use in IEP meetings, behavior intervention plans (BIPs), or personal tracking.

## Technologies Used

This project is built with modern web technologies to ensure a robust, scalable, and user-friendly experience:

*   **Next.js:** A React framework for building fast and scalable web applications.
*   **TypeScript:** Provides type safety and improves code quality and maintainability.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
*   **ESLint:** For maintaining code consistency and catching potential errors.

## Getting Started (Local Development)

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have the following installed on your machine:

*   Node.js (LTS version recommended)
*   pnpm (a fast, disk space efficient package manager)

    If you don't have pnpm, you can install it via npm:
    ```bash
    npm install -g pnpm
    ```

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <your-repository-name>
    ```
    *(Note: You will need to create a new Git repository for this project first.)*

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

### Running the Development Server

To start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Initial Project Structure

Upon setup, your project will have a structure similar to this:

```
act-goal-assistant/
├── public/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout for the application
│   │   └── page.tsx        # Main application page
│   └── components/         # Directory for reusable UI components
│   └── lib/                # Directory for utility functions, data, etc.
├── .eslintrc.json
├── .gitignore
├── next.config.js
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Deployment (Netlify)

This application is designed for easy deployment on platforms like Netlify.

1.  **Create a new site on Netlify:** Connect your Git repository (where this project resides).
2.  **Build command:** `pnpm build`
3.  **Publish directory:** `out` (or `.next` if not using `output: 'export'` in `next.config.js`)

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is open-sourced under the MIT License. See the `LICENSE` file for more details.
