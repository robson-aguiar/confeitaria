# 🎨 Phase 1: Premium Design Implementation

**Goal**: Elevate the brand's perceived value through a "Gourmet" visual identity, implementing a new color palette, typography, and micro-interactions.

## User Review Required
> [!IMPORTANT]
> This will significantly change the look of the website. The blue/white theme will be replaced by a Cream/Gold/Chocolate theme.

## Proposed Changes

### CSS Architecture
#### [MODIFY] [style.css](file:///c:/Users/robson.aguiar/OneDrive%20-%20Dedalus%20Prime/Documents/General/Confeitaria/css/style.css)
-   **Color Palette**:
    -   Replace generic blues with "Gourmet" tones:
        -   Primary: Deep Chocolate (`#3E2723`) or Gold (`#D4AF37`)
        -   Background: Cream/Off-white (`#FAFAF5`) instead of pure white
        -   Accents: Muted Red/Berries (`#9E2A2B`)
-   **Typography**:
    -   Import `Playfair Display` for headings (Elegant, classic).
    -   Keep `Inter` or switch to `Lato` for body text (Clean, readable).
-   **Components**:
    -   Redesign buttons to be more elegant (less rounded, maybe gold borders or shadow).
    -   Update cards with soft shadows and hover lifts.

### HTML Structure
#### [MODIFY] [index.html](file:///c:/Users/robson.aguiar/OneDrive%20-%20Dedalus%20Prime/Documents/General/Confeitaria/index.html)
-   **Fonts**: Add Google Fonts link for `Playfair Display`.
-   **Hero Section**: Adjust structure for new "Cinematic" look.

## Verification Plan

### Automated Tests
-   Check console for 404s on new font/image assets.

### Manual Verification
-   **Visual Check**: Verify the new color palette is applied globally.
-   **Typography**: Ensure headings use the new serif font.
-   **Responsiveness**: Check if the new design holds up on mobile.
