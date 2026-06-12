# Video Reviews — Design Spec
**Date:** 2026-06-12
**Project:** weddings.vsnapu.com + VSnapU admin panel

## Overview

Replace the hardcoded written reviews section on the wedding landing page with a dynamic video reviews section. Videos can be direct file uploads or YouTube links, managed through the existing Wedding Gallery admin panel.

---

## 1. Data Layer

### Backend — `WeddingGalleryItem` model
Add a single nullable column to the existing `WeddingGalleryItem` entity:

```csharp
public string? Location { get; set; }  // Max 80 chars, nullable
```

**Field mapping for review-video items:**
| WeddingGalleryItem field | Review meaning     |
|--------------------------|--------------------|
| `Title`                  | Reviewer name      |
| `Category`               | Event type         |
| `Location`               | City / location    |
| `GalleryType`            | `"review-video"`   |
| `MediaUrl`               | YouTube URL or direct video URL |
| `ThumbnailUrl`           | Optional custom thumbnail |

**Migration:** Single EF Core migration adding `Location` (nvarchar(80), nullable) to `WeddingGalleryItems` table.

**API:** No controller changes needed. `WeddingGalleryController` already serializes the full model. The new field is exposed automatically on all GET endpoints and accepted on POST/PUT.

### Frontend model update
In both `weddings.vsnapu.com` and `VSnapU-App`, add `location?: string` to the `WeddingGalleryItem` TypeScript interface.

---

## 2. Admin Panel (`VSnapU-App`)

**File:** `src/app/components/panel/wedding-gallery/wedding-gallery.component`

### 2a. Filter dropdown + pagination (top of list)
Add a gallery type filter dropdown above the items table. Options:
- All
- Wedding Photos (`wedding-photo`)
- Wedding Videos (`wedding-video`)
- Pre-Wedding Photos (`pre-wedding`)
- Pre-Wedding Films (`pre-wedding-video`)
- Video Reviews (`review-video`)
- Client Logos (`client-logo`)

Table filters reactively on selection. Default: All.

**Pagination:** Display 10 items per page. Show page number buttons (Previous / 1 2 3 … / Next) below the table. Pagination resets to page 1 whenever the filter changes. Client-side only — the existing `GET /api/WeddingGallery/all` endpoint returns all items and pagination is applied in the component.

### 2b. New gallery type option
Add `{ value: 'review-video', label: 'Video Reviews' }` to the gallery type dropdown in the add/edit form.

### 2c. Context-sensitive field labels
When `galleryType === 'review-video'` is selected in the form:
- "Title" label → **"Reviewer Name"**
- "Category" label → **"Event Type"**
- Show new **"Location"** text input field (max 80 chars, optional)

For all other gallery types the form is unchanged.

### 2d. Video input
When `review-video` is selected, the existing YouTube/upload toggle is shown — identical to the existing `wedding-video` and `pre-wedding-video` behaviour. No new upload logic needed.

---

## 3. Landing Page (`weddings.vsnapu.com`)

### 3a. Remove written reviews
Delete `src/app/components/reviews/reviews.component.ts/html/css` and remove it from `app.routes.ts` / any parent template.

### 3b. New `video-reviews` component
**Path:** `src/app/components/video-reviews/`

**Data source:** Calls existing `WeddingGalleryService.getActiveItems()`, filters for `galleryType === 'review-video'`.

**Layout — 3-column grid:**
```
[ card ] [ card ] [ card ]
[ card ] [ card ] [ card ]
```
- ≤900px: 2 columns
- ≤600px: 1 column

**Card anatomy:**
1. Thumbnail area (16:9 aspect ratio) with centered play button overlay
2. On click: plays inline — YouTube → `<iframe>` embed (DomSanitizer), direct video → `<video>` element
3. Below video: reviewer name (bold), location, event type (muted/italic)

**YouTube thumbnail fallback:** If no `thumbnailUrl`, auto-generate from YouTube video ID (`maxresdefault.jpg`) — same pattern as existing video gallery components.

**Empty state:** If the API returns no `review-video` items, the section renders nothing (no empty cards, no error).

**Section header:**
- Eyebrow: `Our Couples`
- Title: `What Our Couples Say`
- Subtitle (italic): matches existing page style

**Styling:** Matches existing page dark theme (`#0a0a0a` background, Cormorant Garamond, `#E31837` accent, white/muted text).

---

## 4. Files Changed

### Backend (`VSnapU`)
- `Models/WeddingGalleryItem.cs` — add `Location` property
- `Migrations/` — new EF migration

### Admin frontend (`VSnapU-App`)
- `models/wedding-enquiry.ts` — add `location?: string` to interface
- `components/panel/wedding-gallery/wedding-gallery.component.ts` — filter dropdown, review-video type, Location field, context labels
- `components/panel/wedding-gallery/wedding-gallery.component.html` — filter UI, Location input, conditional labels

### Landing page (`weddings.vsnapu.com`)
- `models/wedding.models.ts` — add `location?: string`
- `components/reviews/` — **DELETE** entire folder
- `components/video-reviews/` — **CREATE** new component (ts, html, css)
- Parent template / app routes — swap `app-reviews` → `app-video-reviews`

---

## 5. Out of Scope

- Pagination (gallery service returns all active items; volume of reviews is expected to be low)
- Review moderation / approval workflow
- Star ratings on video reviews
- Any changes to the upload size limits or allowed file types (existing limits apply)
