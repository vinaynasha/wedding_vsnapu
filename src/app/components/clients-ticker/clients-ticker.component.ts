import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeddingGalleryService } from '../../services/wedding-gallery.service';
import { WeddingGalleryItem } from '../../models/wedding.models';

@Component({
  selector: 'app-clients-ticker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients-ticker.component.html',
  styleUrl: './clients-ticker.component.css'
})
export class ClientsTickerComponent implements OnInit {
  private galleryService = inject(WeddingGalleryService);

  items = signal<WeddingGalleryItem[]>([]);

  row1 = computed(() => {
    const all = this.items();
    if (!all.length) return [];
    return all.slice(0, Math.ceil(all.length / 2));
  });

  row2 = computed(() => {
    const all = this.items();
    if (all.length < 2) return [];
    return all.slice(Math.ceil(all.length / 2));
  });

  ngOnInit() {
    this.galleryService.getActiveItems().subscribe({
      next: all => this.items.set(
        all
          .filter(i => i.galleryType === 'client-logo')
          .sort((a, b) => a.sortOrder - b.sortOrder)
      ),
      error: () => {}
    });
  }
}
