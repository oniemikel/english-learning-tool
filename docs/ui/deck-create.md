# Create Deck Screen

## 1. Purpose
To provide a form for users to create a new word deck by providing a name and an optional description.

## 2. URL
- `/decks/new`

## 3. Target Users
- All authenticated users.

## 4. Layout Structure
- **Header:** Standard application header.
- **Sidebar:** Standard application sidebar on desktop.
- **Main Content:** A simple, single-column form layout centered within the main content area. It includes a page title, input fields, and action buttons.
- **Footer:** Not present.
- **Responsive Layout:** The form is centered and responsive by nature. It will stack vertically on all devices.

## 5. Component List
- **`PageTitle` (Existing Component)**
  - **Role:** Displays the title of the screen, "Create New Deck".
- **`Input` (from `shadcn/ui`)**
  - **Role:** For the deck name.
- **`Textarea` (from `shadcn/ui`)**
  - **Role:** For the deck description.
- **`Button` (from `shadcn/ui`)**
  - **Role:** For form submission ("Create Deck") and cancellation ("Cancel").
- **`Form` components (from `react-hook-form` and `shadcn/ui`)**
  - **Role:** To manage the form state, validation, and submission.

## 6. Display Items
- A form with fields for "Name" and "Description".

## 7. Input Fields
- **Deck Name:**
  - **Field Name:** `name`
  - **Data Type:** `string`
  - **Required:** Yes
  - **Default Value:** `""`
  - **Validation Rules:**
    - Must be between 1 and 100 characters.
    - A required field message will be shown if empty.
- **Deck Description:**
  - **Field Name:** `description`
  - **Data Type:** `string`
  - **Required:** No
  - **Default Value:** `""`
  - **Validation Rules:**
    - Maximum length of 500 characters.

## 8. Buttons & Actions
- **`Create Deck` Button:**
  - **Type:** `submit`
  - **Action:** Submits the form data to the API. On success, it redirects the user to the newly created deck's detail page (`/decks/[new-id]`).
  - **Handler:** The `react-hook-form` `handleSubmit` function.
  - **State:** Shows a loading indicator and is disabled during form submission.
- **`Cancel` Button:**
  - **Action:** Discards the form and navigates the user back to the Deck List screen (`/decks`).

## 9. Dialogs / Modals
- None.

## 10. Error States & Display
- **Validation Errors:** Displayed inline under each respective form field (e.g., "Name is required").
- **API Error:** If the form submission fails due to a server or network error, a toast notification is displayed with a message like "Failed to create deck. Please try again." The submit button becomes active again.

## 11. Loading States
- **Submitting:** When the "Create Deck" button is clicked, it enters a loading state (disabled with a spinner) until the API response is received.

## 12. Empty States
- Not applicable. This is a form for creation.

## 13. API Integration
- **Create Deck:**
  - **Endpoint:** `POST /api/decks`
  - **HTTP Method:** `POST`
  - **Request Body Structure:**
    ```json
    {
      "name": "My New Deck",
      "description": "A description for the deck."
    }
    ```
  - **Expected Response Structure (Success):**
    ```json
    {
      "success": true,
      "data": {
        "id": "new-uuid-...",
        "name": "My New Deck",
        "description": "A description for the deck.",
        "wordCount": 0,
        "progress": 0,
        "createdAt": "2026-07-26T11:00:00Z"
      }
    }
    ```

## 14. State Management
- **React Hook Form (`useForm`) with Zod (`zodResolver`):**
  - To manage the entire form's state, including field values, validation, and submission state (`isSubmitting`).
  - A Zod schema will be defined to enforce the validation rules.
- **TanStack Query (`useMutation`):**
  - To handle the API mutation (the `POST` request).
  - Manages the loading (`isLoading`) and error states of the API call.

## 15. Screen Flow / Navigation
```mermaid
graph TD
    A[User clicks "New Deck" on /decks] --> B[Navigate to /decks/new];
    B --> C[Display empty "Create Deck" form];
    C --> D[User fills out the form];
    D --> E[User clicks "Create Deck"];
    E --> F{Form validation};
    F -- Fails --> G[Show inline validation errors];
    F -- Passes --> H{Submit data to POST /api/decks};
    H -- Success --> I[Redirect to the new deck's page /decks/[new-id]];
    H -- Failure --> J[Show error toast and re-enable form];
    
    C --> K[User clicks "Cancel"];
    K --> L[Navigate back to /decks];
```

## 16. Responsive Specifications
- **PC:** The form is displayed in a centered card with a maximum width (e.g., 768px) to ensure it doesn't become too wide on large screens.
- **Tablet:** Similar to PC, the form is centered with a comfortable width.
- **Mobile:** The form card takes up most of the screen width, with minimal horizontal padding. Field labels are likely stacked on top of the inputs rather than being side-by-side.
