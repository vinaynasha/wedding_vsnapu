import { Component, OnInit, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeddingGalleryItem } from '../../models/wedding.models';
import { WeddingGalleryService } from '../../services/wedding-gallery.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {
  @ViewChild('scrollTrack') scrollTrack!: ElementRef<HTMLElement>;

  items = signal<WeddingGalleryItem[]>([]);
  activeCategory = signal<string>('all');
  lightboxItem = signal<WeddingGalleryItem | null>(null);
  isDragging = false;

  private dragStartX = 0;
  private scrollStartLeft = 0;

  categories = signal<string[]>([]);

  constructor(private galleryService: WeddingGalleryService) {}

  ngOnInit(): void {
    this.galleryService.getActiveItems().subscribe({
      next: items => {
        this.items.set(items);
        const cats = Array.from(new Set(items.map(i => i.category).filter(Boolean) as string[]));
        this.categories.set(cats);
      }
    });
  }

  get filteredItems(): WeddingGalleryItem[] {
    const cat = this.activeCategory();
    const all = this.items();
    return cat === 'all' ? all : all.filter(i => i.category === cat);
  }

  setCategory(cat: string): void {
    this.activeCategory.set(cat);
  }

  openLightbox(item: WeddingGalleryItem): void {
    if (!this.isDragging) {
      this.lightboxItem.set(item);
    }
  }

  closeLightbox(): void {
    this.lightboxItem.set(null);
  }

  onDragStart(event: MouseEvent): void {
    this.isDragging = false;
    this.dragStartX = event.pageX;
    this.scrollStartLeft = this.scrollTrack.nativeElement.scrollLeft;

    const onMove = (e: MouseEvent) => {
      const dx = e.pageX - this.dragStartX;
      if (Math.abs(dx) > 5) this.isDragging = true;
      this.scrollTrack.nativeElement.scrollLeft = this.scrollStartLeft - dx;
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      setTimeout(() => this.isDragging = false, 50);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }
}
