import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeddingGalleryService } from '../../services/wedding-gallery.service';
import { WeddingGalleryItem } from '../../models/wedding.models';

@Component({
  selector: 'app-pre-wedding-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pre-wedding-gallery.component.html',
  styleUrl: './pre-wedding-gallery.component.css'
})
export class PreWeddingGalleryComponent implements OnInit {
  private galleryService = inject(WeddingGalleryService);

  @ViewChild('track') track!: ElementRef<HTMLDivElement>;

  items = signal<WeddingGalleryItem[]>([]);
  lightboxItem = signal<WeddingGalleryItem | null>(null);

  private dragging = false;
  private startX = 0;
  private scrollLeft = 0;
  private didDrag = false;

  ngOnInit() {
    this.galleryService.getActiveItems().subscribe({
      next: all => this.items.set(all.filter(i => i.galleryType === 'pre-wedding')),
      error: () => {}
    });
  }

  onDragStart(e: MouseEvent | TouchEvent) {
    this.dragging = true;
    this.didDrag = false;
    const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
    this.startX = x - this.track.nativeElement.offsetLeft;
    this.scrollLeft = this.track.nativeElement.scrollLeft;
    this.track.nativeElement.style.cursor = 'grabbing';
  }

  onDragMove(e: MouseEvent | TouchEvent) {
    if (!this.dragging) return;
    e.preventDefault();
    const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
    const walk = (x - this.startX - (-this.track.nativeElement.offsetLeft)) * 1.5;
    if (Math.abs(walk) > 5) this.didDrag = true;
    this.track.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  onDragEnd() {
    this.dragging = false;
    this.track.nativeElement.style.cursor = 'grab';
  }

  scrollBy(dir: 'left' | 'right') {
    const cards = this.track.nativeElement.children;
    const step = cards.length >= 2
      ? (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft
      : (cards[0] as HTMLElement)?.offsetWidth ?? 352;
    this.track.nativeElement.scrollBy({ left: dir === 'right' ? step : -step, behavior: 'smooth' });
  }

  openLightbox(item: WeddingGalleryItem) {
    if (!this.didDrag) this.lightboxItem.set(item);
  }

  closeLightbox() { this.lightboxItem.set(null); }
}
