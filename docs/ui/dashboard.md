# Dashboard Screen

## 1. Purpose
To provide users with a comprehensive overview of their learning progress, upcoming reviews, and quick access to key application features. It serves as the main hub after logging in.

## 2. URL
- `/dashboard`

## 3. Target Users
- All authenticated users.

## 4. Layout Structure
- **Header:** The standard application header is present, containing global navigation and user profile/settings access.
- **Sidebar:** On desktop, a sidebar is present for primary navigation between different sections of the app (Decks, Words, Statistics, etc.).
- **Main Content:** A grid-based layout containing various widgets that display learning statistics and provide calls to action.
- **Footer:** Not present, to maximize content area.
- **Responsive Layout:**
    - **PC:** A multi-column grid (e.g., 2 or 3 columns) for widgets.
    - **Tablet:** A 2-column grid.
    - **Mobile:** A single-column layout where widgets stack vertically. The sidebar is replaced by a bottom navigation bar.

## 5. Component List
- **`PageTitle` (Existing Component)**
  - **Role:** Displays the title of the screen, "Dashboard".
- **`StatCard` (New Reusable Component)**
  - **Role:** A small card to display a single key metric.
  - **Responsibilities:** Shows a label, a large value, and an optional icon or small chart.
  - **States:** `loading`, `default`.
  - **Examples:** "Words Learned", "Review Accuracy", "Current Streak".
- **`ReviewsWidget` (New Component)**
  - **Role:** Shows the number of cards due for review.
  - **Responsibilities:** Displays counts for "New", "Review", and "Due" cards. Contains a primary button to start a study session.
- **`ActivityHeatmap` (New Component)**
  - **Role:** Visualizes the user's study consistency over the past year.
  - **Responsibilities:** Renders a grid of colored squares, similar to a GitHub contribution graph, where color intensity represents study activity on a given day.
- **`DeckQuickView` (New Component)**
  - **Role:** Provides a quick look at recently studied or created decks.
  - **Responsibilities:** Lists a few decks with their names and progress bars. Each item links to the deck's detail page.
- **`Button` (from `shadcn/ui`)**
  - **Role:** The primary call-to-action to begin studying.
  - **Responsibilities:** Navigates the user to the `/study` page.

## 6. Display Items
- **Reviews Widget:**
  - Number of "Due" cards (cards where `nextReviewAt` is in the past).
  - Number of "New" cards.
  - Number of "Review" cards scheduled for today.
- **Stat Cards:**
  - Total words learned.
  - Overall accuracy percentage.
  - Current learning streak (in days).
- **Activity Heatmap:**
  - A calendar view of the last year, with days colored based on the number of reviews completed.
- **Deck Quick View:**
  - List of 3-5 most recently interacted-with decks.
  - For each deck: Deck Name, progress bar indicating completion.

## 7. Input Fields
- None. This is a display-only screen.

## 8. Buttons & Actions
- **`Start Study Session` Button:**
  - **Action:** Navigates the user to the study setup screen (`/study`).
  - **Location:** Prominently placed, likely within the `ReviewsWidget`.
- **Deck Links:**
  - **Action:** Clicking on a deck name or card in the `DeckQuickView` navigates the user to that deck's detail page (`/decks/[id]`).

## 9. Dialogs / Modals
- None.

## 10. Error States & Display
- **API Fetch Error:** If data for the widgets cannot be fetched from the server, the affected widget(s) will display an error message (e.g., "Could not load data") with a "Retry" button.
- **Syncing Error:** If there is a persistent data synchronization issue, a global banner or toast notification may be displayed, separate from the dashboard content itself.

## 11. Loading States
- **Initial Load:** The entire dashboard will show a skeleton loader for each widget while fetching initial data. This provides a structural preview of the page.
- **Widget-Level Loading:** If a user triggers a refresh on a specific widget, only that widget will show a loading state (e.g., a spinner or a pulsating animation).

## 12. Empty States
- **New User:** For a brand new user with no study history, the dashboard will show a welcome message. The activity heatmap and stat cards will show '0' or introductory text. The `ReviewsWidget` will prompt them to add their first deck or words.
- **No Decks:** If a user has no decks, the `DeckQuickView` will display a message like "You don't have any decks yet" with a button to "Create your first deck".

## 13. API Integration
- **Endpoint:** `GET /api/dashboard`
- **HTTP Method:** `GET`
- **Expected Response Structure:** A single endpoint is preferred to fetch all data required for the dashboard in one network request.
  ```json
  {
    "success": true,
    "data": {
      "reviewCounts": {
        "due": 42,
        "new": 10,
        "review": 88
      },
      "stats": {
        "totalWords": 1240,
        "accuracy": 0.92,
        "streak": 14
      },
      "activity": [
        { "date": "2026-07-26", "count": 15 },
        { "date": "2026-07-25", "count": 5 },
        ...
      ],
      "recentDecks": [
        { "id": "uuid-...", "name": "Advanced Vocabulary", "progress": 0.75 },
        { "id": "uuid-...", "name": "Business English", "progress": 0.33 }
      ]
    }
  }
  ```

## 14. State Management
- **TanStack Query:** To fetch, cache, and manage the state of the dashboard data from the `/api/dashboard` endpoint. It will handle loading, error, and success states automatically.
- **Zustand (Optional):** If there are user settings on the dashboard that affect other parts of the app (e.g., a quick toggle), Zustand could be used to manage that global state. For display-only data, TanStack Query is sufficient.

## 15. Screen Flow / Navigation
```mermaid
graph TD
    A[User logs in] --> B[Redirect to /dashboard];
    B --> C[Display Dashboard with Skeleton Loaders];
    C --> D{Fetch /api/dashboard};
    D -- Success --> E[Render widgets with data];
    D -- Failure --> F[Display error state in widgets];

    E --> G[User clicks "Start Study Session"];
    G --> H[Navigate to /study];

    E --> I[User clicks a deck in "DeckQuickView"];
    I --> J[Navigate to /decks/[id]];

    E --> K[User clicks navigation link in Sidebar/Header];
    K --> L[Navigate to other screens (e.g., /words, /settings)];
```

## 16. Responsive Specifications
- **PC (>= 1024px):** A 2 or 3-column grid. The `ReviewsWidget` and `ActivityHeatmap` might span all columns at the top, with `StatCard`s and `DeckQuickView` filling the grid below.
- **Tablet (768px - 1023px):** A 2-column grid. Widgets reflow to fit. The sidebar might be collapsed by default.
- **Mobile (< 768px):** A single-column, vertical layout. The sidebar is replaced with a bottom navigation bar. Each widget takes the full width of the content area.
