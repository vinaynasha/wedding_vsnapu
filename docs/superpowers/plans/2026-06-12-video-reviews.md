# Video Reviews Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded written reviews section with a dynamic video reviews section fed from the existing wedding gallery system.

**Architecture:** Extend `WeddingGalleryItem` with a `Location` field and add a `review-video` gallery type. The admin panel gains a filter dropdown, pagination, and context-sensitive form labels for the new type. The landing page replaces the static `ReviewsComponent` with a new `VideoReviewsComponent` that renders a 3-column grid of videos.

**Tech Stack:** .NET 8 / EF Core 8 (backend), Angular 17+ standalone components with signals (admin + landing page), Bootstrap 5 (admin UI)

---

## File Map

| Repo | File | Change |
|------|------|--------|
| VSnapU | `Models/WeddingGalleryItem.cs` | Add `Location` property |
| VSnapU | `Controllers/WeddingGalleryController.cs` | Add `Location` to DTOs + projections |
| VSnapU | `Migrations/` | New EF migration |
| VSnapU-App | `models/wedding-enquiry.ts` | Add `location` to interfaces |
| VSnapU-App | `components/panel/wedding-gallery/wedding-gallery.component.ts` | Filter, pagination, review-video type, location field |
| VSnapU-App | `components/panel/wedding-gallery/wedding-gallery.component.html` | Filter toolbar, pagination, location input, context labels |
| weddings | `models/wedding.models.ts` | Add `location` to interface |
| weddings | `components/reviews/` | **DELETE** entire folder |
| weddings | `components/video-reviews/` | **CREATE** new component (ts, html, css) |
| weddings | `app.ts` | Swap ReviewsComponent → VideoReviewsComponent |
| weddings | `app.html` | Swap `<app-reviews>` → `<app-video-reviews>` |

---

## Task 1: Add Location to backend model and controller

**Files:**
- Modify: `C:\Users\Vinay\Development\VsnapU\Apps\VSnapU\VSnapU\Models\WeddingGalleryItem.cs`
- Modify: `C:\Users\Vinay\Development\VsnapU\Apps\VSnapU\VSnapU\Controllers\WeddingGalleryController.cs`

- [ ] **Step 1: Add Location property to model**

In `WeddingGalleryItem.cs`, add after the `Category` property (line 28):

```csharp
[MaxLength(80)]
public string? Location { get; set; }
```

- [ ] **Step 2: Add Location to the response DTO**

In `WeddingGalleryController.cs`, add to `WeddingGalleryItemResponse` class after the `category` property:

```csharp
[JsonPropertyName("location")] public string? Location { get; set; }
```

- [ ] **Step 3: Add Location to the request DTO**

In `WeddingGalleryController.cs`, add to `SaveWeddingGalleryItemRequest` class after the `category` property:

```csharp
[JsonPropertyName("location")] public string? Location { get; set; }
```

- [ ] **Step 4: Add Location to GetActiveAsync projection**

In `GetActiveAsync`, add `Location = i.Location,` after `Category = i.Category,`:

```csharp
.Select(i => new WeddingGalleryItemResponse
{
    Id = i.Id,
    Title = i.Title,
    MediaUrl = i.MediaUrl,
    MediaType = i.MediaType,
    ThumbnailUrl = i.ThumbnailUrl,
    Category = i.Category,
    Location = i.Location,
    GalleryType = i.GalleryType,
    SortOrder = i.SortOrder
})
```

- [ ] **Step 5: Add Location to GetAllAsync projection**

Same change in `GetAllAsync`:

```csharp
.Select(i => new WeddingGalleryItemResponse
{
    Id = i.Id,
    Title = i.Title,
    MediaUrl = i.MediaUrl,
    MediaType = i.MediaType,
    ThumbnailUrl = i.ThumbnailUrl,
    Category = i.Category,
    Location = i.Location,
    GalleryType = i.GalleryType,
    SortOrder = i.SortOrder,
    IsActive = i.IsActive,
    CreatedAtUtc = i.CreatedAtUtc
})
```

- [ ] **Step 6: Add Location to CreateAsync**

In the `new WeddingGalleryItem { ... }` block, add after `Category = Truncate(request.Category, 40),`:

```csharp
Location = Truncate(request.Location, 80),
```

- [ ] **Step 7: Add Location to UpdateAsync**

After `item.Category = Truncate(request.Category, 40);`, add:

```csharp
item.Location = Truncate(request.Location, 80);
```

- [ ] **Step 8: Add Location to ToResponse helper**

In `ToResponse`, add `Location = i.Location,` after `Category = i.Category,`:

```csharp
private static WeddingGalleryItemResponse ToResponse(WeddingGalleryItem i) => new()
{
    Id = i.Id,
    Title = i.Title,
    MediaUrl = i.MediaUrl,
    MediaType = i.MediaType,
    ThumbnailUrl = i.ThumbnailUrl,
    Category = i.Category,
    Location = i.Location,
    GalleryType = i.GalleryType,
    SortOrder = i.SortOrder,
    IsActive = i.IsActive,
    CreatedAtUtc = i.CreatedAtUtc
};
```

- [ ] **Step 9: Create EF Core migration**

```bash
cd "C:\Users\Vinay\Development\VsnapU\Apps\VSnapU\VSnapU"
dotnet ef migrations add AddLocationToWeddingGalleryItem
```

Expected: new file `Migrations\{timestamp}_AddLocationToWeddingGalleryItem.cs` containing an `AddColumn` for `location` (nvarchar(80), nullable).

- [ ] **Step 10: Apply migration to database**

```bash
dotnet ef database update
```

Expected: `Done.`

- [ ] **Step 11: Build to verify no errors**

```bash
cd "C:\Users\Vinay\Development\VsnapU\Apps\VSnapU"
dotnet build
```

Expected: `Build succeeded.`

- [ ] **Step 12: Commit**

```bash
cd "C:\Users\Vinay\Development\VsnapU\Apps\VSnapU"
git add VSnapU/Models/WeddingGalleryItem.cs VSnapU/Controllers/WeddingGalleryController.cs VSnapU/Migrations/
git commit -m "feat(wedding-gallery): add Location field to WeddingGalleryItem"
```

---

## Task 2: Update admin app TypeScript interfaces

**Files:**
- Modify: `C:\Users\Vinay\Development\VsnapU\Apps\VSnapU-App\src\app\models\wedding-enquiry.ts`

- [ ] **Step 1: Add location to WeddingGalleryItem interface**

After `category?: string | null;` (line 35), add:

```typescript
location?: string | null;
```

- [ ] **Step 2: Add location to SaveWeddingGalleryItemRequest interface**

After `category?: string | null;` (line 47), add:

```typescript
location?: string | null;
```

- [ ] **Step 3: Commit**

```bash
cd "C:\Users\Vinay\Development\VsnapU\Apps\VSnapU-App"
git add src/app/models/wedding-enquiry.ts
git commit -m "feat(models): add location field to wedding gallery interfaces"
```

---

## Task 3: Update admin wedding-gallery component TypeScript

**Files:**
- Modify: `C:\Users\Vinay\Development\VsnapU\Apps\VSnapU-App\src\app\components\panel\wedding-gallery\wedding-gallery.component.ts`

- [ ] **Step 1: Add imports for computed**

Change the Angular import at line 1 to include `computed`:

```typescript
import { ChangeDetectionStrategy, Component, OnInit, signal, inject, computed } from '@angular/core';
```

- [ ] **Step 2: Add review-video to galleryTypes**

Replace the `galleryTypes` array (lines 36–42):

```typescript
galleryTypes = [
  { label: 'Wedding Photos',    value: 'wedding-photo' },
  { label: 'Wedding Videos',    value: 'wedding-video' },
  { label: 'Pre-Wedding Photos',value: 'pre-wedding' },
  { label: 'Pre-Wedding Films', value: 'pre-wedding-video' },
  { label: 'Video Reviews',     value: 'review-video' },
  { label: 'Client Logos',      value: 'client-logo' }
];
```

- [ ] **Step 3: Add filter and pagination signals**

After `bulkGalleryType = signal<string>('client-logo');` (line 49), add:

```typescript
// ── Filter + pagination ──
filterType = signal<string>('all');
currentPage = signal<number>(1);
readonly pageSize = 10;

filteredItems = computed(() =>
  this.filterType() === 'all'
    ? this.items()
    : this.items().filter(i => i.galleryType === this.filterType())
);

totalPages = computed(() => Math.ceil(this.filteredItems().length / this.pageSize));

paginatedItems = computed(() => {
  const start = (this.currentPage() - 1) * this.pageSize;
  return this.filteredItems().slice(start, start + this.pageSize);
});

pageNumbers = computed(() =>
  Array.from({ length: this.totalPages() }, (_, i) => i + 1)
);
```

- [ ] **Step 4: Add location to form group**

Replace the `form` definition (lines 51–58):

```typescript
form = this.fb.group({
  title:       [''],
  galleryType: ['wedding-photo', Validators.required],
  thumbnailUrl:[''],
  category:    [''],
  location:    [''],
  sortOrder:   [0],
  isActive:    [true]
});
```

- [ ] **Step 5: Update isVideoSection to include review-video**

Replace lines 60–63:

```typescript
get isVideoSection(): boolean {
  return this.form.value.galleryType === 'wedding-video'
      || this.form.value.galleryType === 'pre-wedding-video'
      || this.form.value.galleryType === 'review-video';
}

get isReviewVideo(): boolean {
  return this.form.value.galleryType === 'review-video';
}
```

- [ ] **Step 6: Update galleryType change subscription to include review-video**

Replace lines 69–78 in `ngOnInit`:

```typescript
this.form.get('galleryType')!.valueChanges.subscribe(type => {
  const isVideo = type === 'wedding-video' || type === 'pre-wedding-video' || type === 'review-video';
  if (!isVideo) {
    this.mediaInputType.set('upload');
    this.uploadedUrl.set(null);
    this.youtubeThumbnailPreview.set(null);
    this.youtubeInputUrl = '';
    this.uploadedThumbUrl.set(null);
    this.uploadedMediaType.set('photo');
  }
});
```

- [ ] **Step 7: Reset filter when loading items**

In the `load()` method, reset pagination when items reload:

```typescript
load(): void {
  this.galleryService.getAllItems().subscribe({
    next: items => {
      this.items.set(items);
      this.currentPage.set(1);
    },
    error: () => this.toastService.showDanger('Failed to load gallery items.')
  });
}
```

- [ ] **Step 8: Add filter, pagination, and helper methods**

After `load()`, add:

```typescript
setFilter(type: string): void {
  this.filterType.set(type);
  this.currentPage.set(1);
}

goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPages()) this.currentPage.set(page);
}

minVal(a: number, b: number): number { return Math.min(a, b); }
```

- [ ] **Step 9: Update openAddForm to reset location**

In `openAddForm()`, the `form.reset` call should include location:

```typescript
this.form.reset({ galleryType: 'wedding-photo', sortOrder: 0, isActive: true, location: '' });
```

- [ ] **Step 10: Update openEditForm to populate location**

In `openEditForm`, add `location` to the `form.patchValue` call:

```typescript
this.form.patchValue({
  title:       item.title ?? '',
  galleryType: item.galleryType ?? 'wedding-photo',
  thumbnailUrl:item.thumbnailUrl ?? '',
  category:    item.category ?? '',
  location:    item.location ?? '',
  sortOrder:   item.sortOrder,
  isActive:    item.isActive
});
```

- [ ] **Step 11: Update save() to include location in request**

In `save()`, replace the `request` object:

```typescript
const request: SaveWeddingGalleryItemRequest = {
  title:       v.title || null,
  mediaUrl:    url,
  mediaType:   this.uploadedMediaType(),
  thumbnailUrl:thumbUrl,
  category:    v.category || null,
  location:    v.location || null,
  galleryType: v.galleryType!,
  sortOrder:   v.sortOrder ?? 0,
  isActive:    v.isActive ?? true
};
```

- [ ] **Step 12: Update bulk upload request to include location: null**

In `uploadBulk()`, add `location: null` to the request object:

```typescript
const request: SaveWeddingGalleryItemRequest = {
  title:       files[i].name.replace(/\.[^/.]+$/, ''),
  mediaUrl:    res.url,
  mediaType:   'photo',
  thumbnailUrl:null,
  category:    null,
  location:    null,
  galleryType,
  sortOrder:   i,
  isActive:    true
};
```

- [ ] **Step 13: Commit**

```bash
cd "C:\Users\Vinay\Development\VsnapU\Apps\VSnapU-App"
git add src/app/components/panel/wedding-gallery/wedding-gallery.component.ts
git commit -m "feat(wedding-gallery): add filter, pagination, review-video type, location field"
```

---

## Task 4: Update admin wedding-gallery component HTML

**Files:**
- Modify: `C:\Users\Vinay\Development\VsnapU\Apps\VSnapU-App\src\app\components\panel\wedding-gallery\wedding-gallery.component.html`

- [ ] **Step 1: Add filter toolbar between card-header and add/edit form**

After the closing `</div>` of `card-header` (after line 12), add:

```html
<!-- Filter toolbar -->
<div class="card-body border-bottom py-2">
  <div class="d-flex align-items-center gap-2 flex-wrap">
    <label class="form-label mb-0 text-nowrap small fw-semibold">Filter:</label>
    <select class="form-select form-select-sm" style="max-width:220px"
      [value]="filterType()"
      (change)="setFilter($any($event.target).value)">
      <option value="all">All Sections</option>
      <option *ngFor="let t of galleryTypes" [value]="t.value">{{ t.label }}</option>
    </select>
    <span class="text-muted small">
      {{ filteredItems().length }} item{{ filteredItems().length !== 1 ? 's' : '' }}
    </span>
  </div>
</div>
```

- [ ] **Step 2: Add Title and Category context-sensitive labels in form**

Replace the Title field block (lines 29–33):

```html
<!-- Title / Reviewer Name -->
<div class="col-12 col-md-4">
  <label class="form-label">{{ isReviewVideo ? 'Reviewer Name' : 'Title' }}</label>
  <input type="text" class="form-control" formControlName="title"
    [placeholder]="isReviewVideo ? 'e.g. Priya & Rahul' : 'Optional caption'" />
</div>
```

- [ ] **Step 3: Add Location and Event Type fields after Title (review-video only)**

After the Title field block and before Sort/Active, add:

```html
<!-- Location — visible for review-video only -->
@if (isReviewVideo) {
  <div class="col-12 col-md-4">
    <label class="form-label">Location</label>
    <input type="text" class="form-control" formControlName="location"
      placeholder="e.g. Mumbai" maxlength="80" />
  </div>
}

<!-- Category / Event Type -->
<div class="col-12 col-md-4">
  <label class="form-label">{{ isReviewVideo ? 'Event Type' : 'Category' }}</label>
  <input type="text" class="form-control" formControlName="category"
    [placeholder]="isReviewVideo ? 'e.g. Wedding, Engagement' : 'Optional'" maxlength="40" />
</div>
```

- [ ] **Step 4: Update table to use paginatedItems**

Replace `*ngFor="let item of items(); trackBy: trackById"` with:

```html
*ngFor="let item of paginatedItems(); trackBy: trackById"
```

Also update the empty-state row's colspan and condition:

```html
<tr *ngIf="filteredItems().length === 0">
  <td colspan="8" class="text-center py-4 text-muted">
    {{ filterType() === 'all' ? 'No gallery items yet.' : 'No items in this section.' }}
  </td>
</tr>
```

- [ ] **Step 5: Add pagination controls after the table**

After the closing `</table>` and before the closing `</div>` of `table-responsive`, add:

```html
<!-- Pagination -->
@if (totalPages() > 1) {
  <div class="d-flex justify-content-between align-items-center px-3 py-2 border-top">
    <small class="text-muted">
      Page {{ currentPage() }} of {{ totalPages() }}
      &nbsp;·&nbsp;
      Items {{ (currentPage() - 1) * pageSize + 1 }}–{{ minVal(currentPage() * pageSize, filteredItems().length) }} of {{ filteredItems().length }}
    </small>
    <nav>
      <ul class="pagination pagination-sm mb-0">
        <li class="page-item" [class.disabled]="currentPage() === 1">
          <button class="page-link" (click)="goToPage(currentPage() - 1)">‹</button>
        </li>
        @for (p of pageNumbers(); track p) {
          <li class="page-item" [class.active]="p === currentPage()">
            <button class="page-link" (click)="goToPage(p)">{{ p }}</button>
          </li>
        }
        <li class="page-item" [class.disabled]="currentPage() === totalPages()">
          <button class="page-link" (click)="goToPage(currentPage() + 1)">›</button>
        </li>
      </ul>
    </nav>
  </div>
}

- [ ] **Step 6: Commit**

```bash
cd "C:\Users\Vinay\Development\VsnapU\Apps\VSnapU-App"
git add src/app/components/panel/wedding-gallery/wedding-gallery.component.html
git commit -m "feat(wedding-gallery): add filter toolbar, pagination, location/review fields"
```

---

## Task 5: Landing page — update model and create VideoReviewsComponent

**Files:**
- Modify: `C:\Users\Vinay\Development\VsnapU\weddings.vsnapu.com\src\app\models\wedding.models.ts`
- Create: `C:\Users\Vinay\Development\VsnapU\weddings.vsnapu.com\src\app\components\video-reviews\video-reviews.component.ts`
- Create: `C:\Users\Vinay\Development\VsnapU\weddings.vsnapu.com\src\app\components\video-reviews\video-reviews.component.html`
- Create: `C:\Users\Vinay\Development\VsnapU\weddings.vsnapu.com\src\app\components\video-reviews\video-reviews.component.css`

- [ ] **Step 1: Add location to landing page model**

In `wedding.models.ts`, add `location?: string | null;` to `WeddingGalleryItem` after `category?: string;`:

```typescript
export interface WeddingGalleryItem {
  id: number;
  title?: string;
  mediaUrl: string;
  mediaType: 'photo' | 'video' | string;
  thumbnailUrl?: string;
  category?: string;
  location?: string | null;
  galleryType: string;
  sortOrder: number;
  isActive: boolean;
}
```

- [ ] **Step 2: Create video-reviews.component.ts**

Create `C:\Users\Vinay\Development\VsnapU\weddings.vsnapu.com\src\app\components\video-reviews\video-reviews.component.ts`:

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { WeddingGalleryService } from '../../services/wedding-gallery.service';
import { WeddingGalleryItem } from '../../models/wedding.models';

@Component({
  selector: 'app-video-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-reviews.component.html',
  styleUrl: './video-reviews.component.css'
})
export class VideoReviewsComponent implements OnInit {
  private galleryService = inject(WeddingGalleryService);
  private sanitizer = inject(DomSanitizer);

  items = signal<WeddingGalleryItem[]>([]);
  playingId = signal<number | null>(null);
  playingEmbedUrl = signal<SafeResourceUrl | null>(null);

  ngOnInit() {
    this.galleryService.getActiveItems().subscribe({
      next: all => this.items.set(all.filter(i => i.galleryType === 'review-video')),
      error: () => {}
    });
  }

  play(item: WeddingGalleryItem) {
    if (this.isYoutube(item.mediaUrl)) {
      const id = this.getYoutubeId(item.mediaUrl);
      if (id) {
        this.playingEmbedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`
        ));
      }
    } else {
      this.playingEmbedUrl.set(null);
    }
    this.playingId.set(item.id);
  }

  isYoutube(url: string | null): boolean {
    return /youtube\.com|youtu\.be/.test(url ?? '');
  }

  getYoutubeId(url: string): string | null {
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
  }

  getThumbnail(item: WeddingGalleryItem): string | null {
    if (item.thumbnailUrl) return this.toHttps(item.thumbnailUrl);
    if (this.isYoutube(item.mediaUrl)) {
      const id = this.getYoutubeId(item.mediaUrl);
      if (id) return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    }
    return null;
  }

  private toHttps(url: string): string {
    return url.replace(/^http:\/\//i, 'https://');
  }
}
```

- [ ] **Step 3: Create video-reviews.component.html**

Create `C:\Users\Vinay\Development\VsnapU\weddings.vsnapu.com\src\app\components\video-reviews\video-reviews.component.html`:

```html
@if (items().length > 0) {
  <section id="reviews" class="reviews-section">
    <div class="reviews-inner">
      <div class="reviews-header">
        <p class="section-eyebrow">Our Couples</p>
        <h2 class="section-title">What Our Couples Say</h2>
      </div>

      <div class="reviews-grid">
        @for (item of items(); track item.id) {
          <div class="review-card">
            <div class="video-wrapper">
              @if (playingId() === item.id) {
                @if (isYoutube(item.mediaUrl)) {
                  <iframe
                    [src]="playingEmbedUrl()!"
                    frameborder="0"
                    allow="autoplay; encrypted-media"
                    allowfullscreen
                    class="review-player">
                  </iframe>
                } @else {
                  <video
                    [src]="item.mediaUrl"
                    autoplay
                    controls
                    class="review-player">
                  </video>
                }
              } @else {
                @if (getThumbnail(item)) {
                  <img [src]="getThumbnail(item)!" [alt]="item.title ?? ''" class="review-thumb" />
                } @else {
                  <div class="review-thumb-fallback"></div>
                }
                <button class="play-btn" (click)="play(item)" aria-label="Play review">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="52" height="52">
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                </button>
              }
            </div>

            <div class="review-meta">
              @if (item.title) {
                <p class="reviewer-name">{{ item.title }}</p>
              }
              @if (item.location || item.category) {
                <p class="reviewer-detail">
                  @if (item.location) {<span>{{ item.location }}</span>}
                  @if (item.location && item.category) {<span class="sep">·</span>}
                  @if (item.category) {<span>{{ item.category }}</span>}
                </p>
              }
            </div>
          </div>
        }
      </div>
    </div>
  </section>
}
```

- [ ] **Step 4: Create video-reviews.component.css**

Create `C:\Users\Vinay\Development\VsnapU\weddings.vsnapu.com\src\app\components\video-reviews\video-reviews.component.css`:

```css
.reviews-section {
  background: #0a0a0a;
  padding: 100px 0;
}

.reviews-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.reviews-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-eyebrow {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.8rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #E31837;
  margin-bottom: 12px;
}

.section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 500;
  color: #fff;
  margin: 0;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.review-card {
  background: #111;
  border: 1px solid rgba(255,255,255,0.06);
  transition: border-color 0.3s;
}

.review-card:hover {
  border-color: rgba(227,24,55,0.25);
}

.video-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #000;
}

.review-thumb {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.review-thumb-fallback {
  position: absolute;
  inset: 0;
  background: #1a1a1a;
}

.play-btn {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.35);
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
}

.play-btn:hover {
  background: rgba(0,0,0,0.55);
}

.play-btn svg {
  color: #fff;
  filter: drop-shadow(0 2px 10px rgba(0,0,0,0.7));
  transition: transform 0.2s;
}

.play-btn:hover svg {
  transform: scale(1.12);
}

.review-player {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.review-meta {
  padding: 16px 20px 20px;
}

.reviewer-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 4px;
}

.reviewer-detail {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.45);
  letter-spacing: 0.04em;
  margin: 0;
}

.sep {
  margin: 0 6px;
}

@media (max-width: 900px) {
  .reviews-grid { grid-template-columns: repeat(2, 1fr); }
  .reviews-inner { padding: 0 24px; }
}

@media (max-width: 600px) {
  .reviews-section { padding: 60px 0; }
  .reviews-grid { grid-template-columns: 1fr; }
  .reviews-inner { padding: 0 16px; }
}
```

- [ ] **Step 5: Commit**

```bash
cd "C:\Users\Vinay\Development\VsnapU\weddings.vsnapu.com"
git add src/app/models/wedding.models.ts src/app/components/video-reviews/
git commit -m "feat(video-reviews): create VideoReviewsComponent with 3-column grid layout"
```

---

## Task 6: Wire up VideoReviewsComponent and remove ReviewsComponent

**Files:**
- Modify: `C:\Users\Vinay\Development\VsnapU\weddings.vsnapu.com\src\app\app.ts`
- Modify: `C:\Users\Vinay\Development\VsnapU\weddings.vsnapu.com\src\app\app.html`
- Delete: `C:\Users\Vinay\Development\VsnapU\weddings.vsnapu.com\src\app\components\reviews\`

- [ ] **Step 1: Update app.ts imports**

In `app.ts`, remove the `ReviewsComponent` import and add `VideoReviewsComponent`:

Replace:
```typescript
import { ReviewsComponent } from './components/reviews/reviews.component';
```
With:
```typescript
import { VideoReviewsComponent } from './components/video-reviews/video-reviews.component';
```

In the `imports` array, replace `ReviewsComponent` with `VideoReviewsComponent`.

- [ ] **Step 2: Update app.html**

In `app.html` line 23, replace:
```html
<app-reviews></app-reviews>
```
With:
```html
<app-video-reviews></app-video-reviews>
```

- [ ] **Step 3: Delete reviews component folder**

```bash
rm -rf "C:\Users\Vinay\Development\VsnapU\weddings.vsnapu.com\src\app\components\reviews"
```

- [ ] **Step 4: Build to verify no errors**

```bash
cd "C:\Users\Vinay\Development\VsnapU\weddings.vsnapu.com"
npm run build -- --configuration development 2>&1 | tail -20
```

Expected: `Application bundle generation complete.` with no errors.

- [ ] **Step 5: Commit**

```bash
cd "C:\Users\Vinay\Development\VsnapU\weddings.vsnapu.com"
git add src/app/app.ts src/app/app.html
git rm -r src/app/components/reviews/
git commit -m "feat: replace ReviewsComponent with VideoReviewsComponent"
```
