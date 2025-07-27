# Listelee.io Application Flow

This document outlines the user flow for the Listelee.io application, from the initial landing page to creating and managing a waitlist.

## 1. Landing Page and Authentication

The user journey begins on the main landing page, which is designed to quickly communicate the value proposition of Listelee.io.

```mermaid
flowchart TD
    A[Visit Landing Page] --> B{Compelling CTA};
    B --> C[Click "Hemen Başla"];
    C --> D[/dashboard];
    D -- if not logged in --> E[/login];
    E --> F[Enter Email/Password];
    F --> G[Authenticate with Supabase];
    G -- on success --> D;
```

*   **A: Visit Landing Page**: The user arrives at the main marketing page (`/`).
*   **B: Compelling CTA**: The page features clear calls-to-action, such as "Hemen Başla" (Start Now).
*   **C: Click "Hemen Başla"**: The user clicks the main CTA to start the process.
*   **D: /dashboard**: The user is redirected to the dashboard.
*   **E: /login**: If the user is not authenticated, the middleware redirects them to the login page.
*   **F: Enter Email/Password**: The user enters their credentials.
*   **G: Authenticate with Supabase**: The app uses Supabase Auth to verify the user's credentials.
*   **H: on success**: Upon successful authentication, the user is redirected to their dashboard.

## 2. Project Creation and Management

Once authenticated, the user can create and manage their waitlist projects from the dashboard.

```mermaid
flowchart TD
    A[/dashboard] --> B[View Project List];
    B --> C{Create New Project};
    C --> D[/dashboard/editor];
    D --> E[Enter Project Name and Slug];
    E --> F[Click "Oluştur"];
    F --> G[Save to Supabase `projects` table];
    G --> H[/dashboard/editor/:id];
    
    B --> I{Edit Existing Project};
    I --> J[/dashboard/editor/:id];
    J --> K[Update Project Details];
    K --> L[Save changes to Supabase];

    B --> M{View Waitlist Page};
    M --> N[/:slug];
```

*   **A: /dashboard**: The user is on their main dashboard.
*   **B: View Project List**: The dashboard displays a list of the user's existing projects.
*   **C: Create New Project**: The user clicks the "Yeni Proje Oluştur" (Create New Project) button.
*   **D: /dashboard/editor**: The user is taken to the project creation page.
*   **E: Enter Project Name and Slug**: The user provides a name and a unique slug for their project.
*   **F: Click "Oluştur"**: The user submits the form.
*   **G: Save to Supabase**: A new record is created in the `projects` table in Supabase.
*   **H: /dashboard/editor/:id**: The user is redirected to the editor for their newly created project.
*   **I: Edit Existing Project**: From the dashboard, the user can choose to edit an existing project.
*   **J: /dashboard/editor/:id**: The user is taken to the editor for the selected project.
*   **K: Update Project Details**: The user can modify the project's name and slug.
*   **L: Save changes to Supabase**: The updates are saved to the corresponding record in the `projects` table.
*   **M: View Waitlist Page**: The user can click a link to view the live waitlist page for their project.
*   **N: /:slug**: A public page is rendered using the project's slug.

## 3. Public Waitlist and Lead Collection

The public-facing waitlist page is where visitors can sign up.

```mermaid
flowchart TD
    A[Visit Public Page `/:slug`] --> B[View Waitlist Form];
    B --> C[Enter Email Address];
    C --> D[Submit Form];
    D --> E{Save to Supabase `leads` table};
    E -- on success --> F[Show Success Message];
    E -- on duplicate --> G[Show "Already on list" Message];
```

*   **A: Visit Public Page**: A visitor navigates to the public URL of a waitlist page (e.g., `listele.io/my-cool-idea`).
*   **B: View Waitlist Form**: The page displays the waitlist form.
*   **C: Enter Email Address**: The visitor enters their email address.
*   **D: Submit Form**: The visitor submits the form.
*   **E: Save to Supabase**: The email address is saved to the `leads` table in Supabase, linked to the `projectId`.
*   **F: Show Success Message**: A success message is displayed to the visitor.
*   **G: Show "Already on list" Message**: If the email already exists for that project, a message is shown indicating that they are already on the waitlist. 