# Deck Detail Screen

## 1. Purpose
To display the detailed contents of a specific deck, including its metadata and the list of words it contains. It allows users to study the deck, manage its words, and access editing functions.

## 2. URL
- `/decks/[id]` where `[id]` is the UUID of the deck.

## 3. Target Users
- All authenticated users who own the deck.

## 4. Layout Structure
- **Header:** Standard application header.
- **Sidebar:** Standard application sidebar on desktop.
- **Main Content:**
    - A header section with the deck's name, description, and primary action buttons ("Study this Deck", "Edit Deck").
    - A statistics section showing key metrics for the deck (e.g., word count, learning progress).
    - A main section containing a searchable and paginated list of the words in the deck.
- **Footer:** Not present.
- **Responsive Layout:**
    - **PC:** Full layout with stats and word list clearly visible.
    - **Mobile:** The header and stats section are stacked vertically. The word list might use a more compact view.

## 5. Component List
- **`PageTitle` (Existing Component)**
  - **Role:** Displays the deck name. It will be used as the main title for this page.
- **`Button` (from `shadcn/ui`)**
  - **Role:** Primary actions for the deck.
  - **Responsibilities:** Used for "Study this Deck", "Edit Deck", and "Add Word".
- **`Input` (from `shadcn/ui`)**
  - **Role:** To search for specific words within the deck.
- **`WordListTable` (New Reusable Component)**
  - **Role:** Displays the words in a table format.
  - **Responsibilities:** Shows columns for the word, its translation, its current learning state (New, Review, etc.), and a menu for actions. Supports sorting and pagination.
- **`DataTable` (from `shadcn/ui`)**
  - This can be used to build the `WordListTable`.
- **`StatCard` (Existing Reusable Component)**
  - **Role:** To display key stats about the deck.
  - **Examples:** "Total Words", "Words Learned", "Deck Accuracy".
- **`Pagination` (from `shadcn/ui`)**
  - **Role:** To navigate through the list of words if it spans multiple pages.

## 6. Display Items
- **Deck Header:**
  - Deck Name.
  - Deck Description.
- **Deck Stats:**
  - Total number of words in the deck.
  - Number/percentage of words learned.
  - Accuracy percentage for this deck.
- **Word List Table:**
  - **`Word` column:** The English word.
  - **`Translation` column:** The Japanese translation.
  - **`State` column:** The current FSRS state of the card (e.g., New, Learning, Review).
  - **`Next Review` column:** The date of the next scheduled review.
  - **`Actions` column:** A dropdown menu for each word (Edit, Delete).

## 7. Input Fields
- **Word Search:**
  - **Field Name:** `wordSearchQuery`
  - **Data Type:** `string`
  - **Required:** No
  - **Default Value:** `""`
  - **Validation Rules:** None.

## 8. Buttons & Actions
- **`Study this Deck` Button:**
  - **Action:** Navigates to the study setup screen (`/study`) with the current deck pre-selected.
- **`Edit Deck` Button:**
  - **Action:** Navigates to the edit mode for this deck (`/decks/[id]?mode=edit`).
- **`Add Word` Button:**
  - **Action:** Navigates to the "Create Word" screen (`/words/new`) with the current deck pre-selected.
- **Word Row Click:**
  - **Action:** Navigates to the "Word Detail" screen for that word (`/words/[word-id]`).
- **Word Action Menu:**
  - **`Edit`:** Navigates to the "Edit Word" screen (`/words/[word-id]?mode=edit`).
  - **`Delete`:** Opens a confirmation dialog to logically delete the word from the deck.

## 9. Dialogs / Modals
- **`Delete Word Confirmation` Dialog:**
  - **Trigger:** Clicking "Delete" on a word in the list.
  - **Content:** "Are you sure you want to delete the word '[Word]' from this deck?"
  - **Actions:** `Cancel` and `Delete` buttons.

## 10. Error States & Display
- **Deck Not Found:** If the deck ID is invalid or the user does not have permission to view it, a 404 Not Found page is shown.
- **API Fetch Error:** If the deck details or word list fail to load, an error message with a "Retry" button is displayed.
- **Delete Word Error:** A toast notification is shown if deleting a word fails.

## 11. Loading States
- **Initial Load:** The page shows a skeleton loader for the header, stats, and word table while fetching data.
- **Searching/Pagination:** The table body shows a loading spinner or dims while fetching the updated word list.

## 12. Empty States
- **Deck with No Words:** If a deck has been created but no words have been added, the word list area will display a message like "This deck is empty." with a prominent "Add Word" button.

## 13. API Integration
- **Fetch Deck Details:**
  - **Endpoint:** `GET /api/decks/[id]`
  - **Query Params:** `?page=[page_number]&search=[query]` for word list pagination and filtering.
  - **HTTP Method:** `GET`
  - **Expected Response Structure:**
    ```json
    {
      "success": true,
      "data": {
        "id": "uuid-...",
        "name": "Business English",
        "description": "Common phrases for meetings and emails.",
        "stats": {
          "wordCount": 78,
          "learnedCount": 35,
          "accuracy": 0.89
        },
        "words": {
          "pagination": {
            "currentPage": 1,
            "totalPages": 4,
            "totalCount": 78
          },
          "items": [
            {
              "id": "word-uuid-...",
              "text": "synergy",
              "translation": "相乗効果",
              "state": "REVIEW",
              "nextReviewAt": "2026-08-15T09:00:00Z"
            },
            ...
          ]
        }
      }
    }
    ```
- **Delete Word from Deck:**
    - **Endpoint:** `DELETE /api/words/[id]`
    - **HTTP Method:** `DELETE`

## 14. State Management
- **TanStack Query:** To fetch the deck details and its word list. The query key will include the deck ID, page number, and search query to handle caching and automatic refetching.
- **URL Parameters / Local State:** To manage the current page for pagination and the search query for the word list.

## 15. Screen Flow / Navigation
```mermaid
graph TD
    A[User clicks a deck on /decks] --> B[Navigate to /decks/[id]];
    B --> C[Display page skeleton];
    C --> D{Fetch /api/decks/[id]};
    D -- Success --> E[Render deck details and word list];
    D -- Failure (404) --> F[Show 404 Not Found page];
    D -- Failure (other) --> G[Show error state with retry button];

    E --> H[User clicks "Study this Deck"];
    H --> I[Navigate to /study with deck pre-selected];

    E --> J[User clicks "Edit Deck"];
    J --> K[Navigate to /decks/[id]?mode=edit];
    
    E --> L[User clicks "Add Word"];
    L --> M[Navigate to /words/new with deck pre-selected];

    E --> N[User clicks on a word row];
    N --> O[Navigate to /words/[word-id]];

    E --> P[User searches for a word];
    P --> Q[Refetch word list with search query];
```

## 16. Responsive Specifications
- **PC:** The layout is spacious. The stats are displayed horizontally, and the word table shows all columns.
- **Tablet:** The stat cards may wrap into two rows. The word table remains, but with slightly less padding.
- **Mobile:** The stats are stacked vertically. The word table might be replaced by a list of cards, where each card represents a word and shows its details vertically. Alternatively, the table could become horizontally scrollable. Action buttons are prominent and easily tappable.
