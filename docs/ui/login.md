# Login Screen

## 1. Purpose
To provide a secure and simple entry point for users to access the application using their Google account.

## 2. URL
- `/`
- `/login` (alias or redirect to `/`)
- Unauthenticated users trying to access protected routes will be redirected to `/?callbackUrl=[intended_path]`.

## 3. Target Users
- All new and returning users of the application.

## 4. Layout Structure
- This screen uses a minimal, centered layout and does not include the standard application header, sidebar, or footer.
- **Header:** Not present.
- **Sidebar:** Not present.
- **Main Content:** A single card centered vertically and horizontally on the page containing the login prompt.
- **Footer:** A simple footer with copyright information may be present.
- **Responsive Layout:** The centered layout naturally adapts to all screen sizes. On mobile, the card may take up more of the screen width.

## 5. Component List
- **`LoginCard` (New Component)**
  - **Role:** The main UI container for the login screen.
  - **Responsibilities:** Displays the application title/logo and the login button.
  - **States:** Default state only.
- **`Button` (from `shadcn/ui`)**
  - **Role:** The call-to-action for initiating the login process.
  - **Responsibilities:** Triggers the Google OAuth flow when clicked.
  - **States:** `default`, `hover`, `active`, `disabled` (during auth process).

## 6. Display Items
- Application Title or Logo.
- A brief welcome or explanatory message.
- "Sign in with Google" button.

## 7. Input Fields
- None. This is a passwordless login screen.

## 8. Buttons & Actions
- **`Sign in with Google` Button:**
  - **Action:** Initiates the `signIn('google')` function provided by Auth.js.
  - **Handler:** An `onClick` event handler that calls the authentication provider.
  - **Feedback:** The button should show a loading indicator and be disabled after being clicked to prevent multiple submissions while the OAuth redirect is in progress.

## 9. Dialogs / Modals
- None on this screen. The Google OAuth flow will happen in a browser pop-up or redirect.

## 10. Error States & Display
- **OAuth Authentication Failed:** If the user denies the request on the Google consent screen or if there's an error returned from Google, the user will be redirected back to the login screen.
  - A query parameter (e.g., `?error=OAuthAuthentication`) will be present.
  - A toast or an inline message within the `LoginCard` will display a user-friendly error message, such as "Authentication failed. Please try again."
- **Server/Configuration Error:** For server-side issues (e.g., misconfigured `GOOGLE_CLIENT_ID`), a generic error message like "An unexpected error occurred. Please contact support if the problem persists." will be shown.

## 11. Loading States
- When the "Sign in with Google" button is clicked, a loading spinner should appear within the button, and the button should be disabled until the redirect to Google occurs.

## 12. Empty States
- Not applicable for this screen.

## 13. API Integration
- **Endpoint:** `/api/auth/signin/google` (Handled by Auth.js)
- **HTTP Method:** `POST` (Initiated by client-side library)
- **Expected Response:** This is not a typical API call handled by application code. Auth.js handles the redirect to Google's authentication server. The browser will then be redirected to `/api/auth/callback/google` upon successful or failed authentication.

## 14. State Management
- **React Local State (`useState`):** To manage the loading/disabled state of the login button.
  - `const [isLoading, setIsLoading] = useState(false);`
- **URL Parameters (`useSearchParams`):** To read potential error messages from the URL upon callback from the OAuth provider.
  - `const searchParams = useSearchParams(); const error = searchParams.get('error');`

## 15. Screen Flow / Navigation
```mermaid
graph TD
    A[User visits /] --> B{Is user authenticated?};
    B -- No --> C[Display Login Screen];
    B -- Yes --> D[Redirect to /dashboard];

    C --> E[User clicks "Sign in with Google"];
    E --> F[Redirect to Google OAuth consent screen];
    F -- User approves --> G[Redirect to /api/auth/callback/google];
    G --> H{Auth.js validates token};
    H -- Success --> I[Set session cookie and redirect to /dashboard];
    H -- Failure --> J[Redirect to /?error=...];
    J --> K[Display Login Screen with error message];

    F -- User denies --> J;
```

## 16. Responsive Specifications
- **PC:** A single card, approximately 400px wide, is centered on the screen. There is ample whitespace around it.
- **Tablet:** The card may be slightly wider (e.g., 480px) but remains centered.
- **Mobile:** The card takes up most of the screen width (e.g., `width: 90%` or `width: 100%` with horizontal padding), centered on the screen. The text and button sizes are adjusted for touch targets.
