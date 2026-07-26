# Deck List Screen

## 1. Purpose
To allow users to view, search, and manage all of their created word decks. It serves as the entry point for all deck-related activities.

## 2. URL
- `/decks`

## 3. Target Users
- All authenticated users.

## 4. Layout Structure
- **Header:** The standard application header is present.
- **Sidebar:** On desktop, the sidebar is present for primary navigation.
- **Main Content:** The main content area features a page title, action buttons (e.g., "New Deck"), a search/filter bar, and a grid or list of deck cards.
- **Footer:** Not present.
- **Responsive Layout:**
    - **PC:** A multi-column grid (e.g., 2-4 columns) of deck cards.
    - **Tablet:** A 2 or 3-column grid.
    - **Mobile:** A single-column list where deck cards stack vertically.

## 5. Component List
- **`PageTitle` (Existing Component)**
  - **Role:** Displays the title of the screen, "Decks".
- **`Button` (from `shadcn/ui`)**
  - **Role:** Primary actions on the page.
  - **Responsibilities:** Used for "New Deck" and "Import from CSV".
- **`Input` (from `shadcn/ui`)**
  - **Role:** Search filter for decks.
  - **Responsibilities:** Allows users to type a query to filter the list of decks by name.
- **`DeckCard` (New Reusable Component)**
  - **Role:** Represents a single deck in the list.
  - **Responsibilities:** Displays the deck's name, description, number of words, and a progress bar for learning status. The entire card is a link to the deck's detail page. It also includes a dropdown menu for quick actions (Edit, Delete).
  - **States:** `default`, `hover`.
- **`DropdownMenu` (from `shadcn/ui`)**
  - **Role:** Provides quick actions for each `DeckCard`.
  - **Responsibilities:** Contains options like "Edit", "Share", and "Delete".

## 6. Display Items
- **Search Bar:** A text input to filter decks by name.
- **Deck Cards:**
  - Deck Name.
  - Deck Description (truncated if long).
  - Word Count (e.g., "150 words").
  - Learning Progress (a visual progress bar).

## 7. Input Fields
- **Search:**
  - **Field Name:** `searchQuery`
  - **Data Type:** `string`
  - **Required:** No
  - **Default Value:** `""`
  - **Validation Rules:** None.

## 8. Buttons & Actions
- **`New Deck` Button:**
  - **Action:** Navigates the user to the "Create Deck" screen (`/decks/new`).
- **`Import` Button:**
  - **Action:** Navigates the user to the "CSV Import" screen (`/csv-import`).
- **`DeckCard` Click:**
  - **Action:** Navigates the user to the "Deck Detail" screen for that deck (`/decks/[id]`).
- **`DeckCard` Action Menu:**
  - **`Edit`:** Navigates to the "Edit Deck" screen (`/decks/[id]?mode=edit`).
  - **`Delete`:** Opens a confirmation dialog to perform a logical delete on the deck.

## 9. Dialogs / Modals
- **`Delete Confirmation` Dialog:**
  - **Trigger:** Clicking the "Delete" action on a `DeckCard`.
  - **Content:** "Are you sure you want to delete the deck '[Deck Name]'? This action cannot be undone." (Note: It's a logical delete, but the user-facing message should be clear and final).
  - **Actions:**
    - `Cancel` button: Closes the dialog.
    - `Delete` button: Executes the delete API call and removes the deck from the list upon success.

## 10. Error States & Display
- **API Fetch Error:** If the list of decks cannot be fetched, a full-page error message is shown with a "Retry" button.
- **Delete Error:** If a deck fails to delete, a toast notification appears with an error message like "Failed to delete deck. Please try again."

## 11. Loading States
- **Initial Load:** The main content area will display a grid of skeleton loaders that mimic the `DeckCard` layout while the initial data is being fetched.
- **Filtering/Searching:** The list updates instantly on the client-side. If filtering is server-side, a loading spinner could be shown over the list area.
- **Deleting:** When the "Delete" button in the confirmation dialog is clicked, it should show a loading indicator until the API call completes.

## 12. Empty States
- **No Decks:** If the user has not created any decks, the main content area will display a message like "You have no decks." along with a prominent "Create New Deck" button to guide them.

## 13. API Integration
- **Fetch Decks:**
  - **Endpoint:** `GET /api/decks`
  - **Query Params:** `?search=[query]`
  - **HTTP Method:** `GET`
  - **Expected Response Structure:**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "uuid-...",
          "name": "Business English",
          "description": "Common phrases for meetings and emails.",
          "wordCount": 78,
          "progress": 0.45,
          "updatedAt": "2026-07-26T10:00:00Z"
        },
        ...
      ]
    }
    ```
- **Delete Deck:**
  - **Endpoint:** `DELETE /api/decks/[id]`
  - **HTTP Method:** `DELETE`
  - **Expected Response Structure:**
    ```json
    { "success": true, "data": { "id": "uuid-..." } }
    ```

## 14. State Management
- **TanStack Query:** To fetch and cache the list of decks. It will manage the data, loading, and error states. The search query can be passed to the query key to automatically refetch when it changes.
- **React Local State (`useState`):**
  - To manage the value of the search input field.
  - To control the visibility of the delete confirmation dialog and store the ID of the deck to be deleted.

## 15. Screen Flow / Navigation
```mermaid
graph TD
    A[User navigates to /decks] --> B[Display Deck List skeleton];
    B --> C{Fetch /api/decks};
    C -- Success --> D[Display list of DeckCards];
    C -- Failure --> E[Display error state with retry button];
    C -- Success (empty list) --> F[Display empty state with "Create New Deck" button];

    D --> G[User types in search bar];
    G --> H[Refetch decks with search query or filter client-side];

    D --> I[User clicks "New Deck"];
    I --> J[Navigate to /decks/new];

    D --> K[User clicks a DeckCard];
    K --> L[Navigate to /decks/[id]];

    D --> M[User clicks "Delete" on a deck];
    M --> N[Show delete confirmation dialog];
    N -- User confirms --> O{Call DELETE /api/decks/[id]};
    O -- Success --> P[Remove deck from list and show success toast];
    O -- Failure --> Q[Show error toast];
    N -- User cancels --> D;
```

## 16. Responsive Specifications
- **PC (>= 1024px):** `DeckCard`s are displayed in a 3 or 4-column grid.
- **Tablet (768px - 1023px):** The grid reflows to 2 columns.
- **Mobile (< 768px):** The layout becomes a single-column list of `DeckCard`s, each taking up the full content width. The action buttons ("New Deck", "Import") may be stacked or placed under an icon button to save space.
