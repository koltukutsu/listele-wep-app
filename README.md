# Listele.io - Fikrini Listele, İşini Test Et

![Listele.io](/public/opengraph-image.png)

<p>
  Türkiye’deki girişimciler için dakikalar içinde bekleme listesi sayfası kurup fikrini gerçek kullanıcılarla test etmeyi sağlayan no-code platform.
</p>

## Core Features

- **Next.js 15**: Built with the latest features of the leading React framework for performance and developer experience.
- **Supabase**: The open source Firebase alternative for database, authentication, and storage.
- **Resend Integration**: Send transactional emails (e.g., confirmation emails) through Resend using your custom domain.
- **One-Click Vercel Deploy**: Get your waitlist live in minutes.
- **Tailwind CSS & React**: Modern, responsive UI built with utility-first CSS and React components.
- **TypeScript**: Type safety for a more robust codebase.

## Prerequisites: Setting Up External Services

Before you can run this project, you'll need to configure a few external services:

### 1. Supabase

Supabase is used for database, authentication, and storage.
1.  Sign up for a free account at [Supabase](https://supabase.com/).
2.  Create a new project.
3.  Go to the "SQL Editor" and run the script from `supabase/schema.sql` to create the necessary tables.
4.  Go to "Project Settings" -> "API" and get your `Project URL` and `Project API keys` (use the `anon` key).

### 2. Resend

Resend is used for sending transactional emails (e.g., signup confirmations).
1.  Create an account at [Resend](https://resend.com/).
2.  Add and verify your domain (e.g., `yourdomain.com`).
3.  Generate an API key from the "API Keys" section. This will be your `RESEND_API_KEY`.
4.  Note the email address you'll send from (e.g., `waitlist@yourdomain.com`). This will be your `RESEND_FROM_EMAIL`.

## Local Development Setup

To run this project on your local machine:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/listele-io.git 
    cd listele-io
    ```

2.  **Install Dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set Up Environment Variables:**
    Create a `.env.local` file in the root of your project. You can copy `.env.example` and fill in the values you obtained from the prerequisite steps:
    ```env
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL="YOUR_SUPABASE_URL"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

    # Resend
    RESEND_API_KEY=your_resend_api_key
    RESEND_FROM_EMAIL=you@yourdomain.com # Email address to send from (must be verified in Resend)
    ```

4.  **Run the Development Server:**
    ```bash
    pnpm dev
    ```
    Your application should now be running on `http://localhost:3000`.

## License

This template is open-source and available under the [MIT License](LICENSE.md). You are free to use, modify, and distribute it for personal or commercial projects.# listele-wep-app
