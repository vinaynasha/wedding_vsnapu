import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeddingContentService } from '../../services/wedding-content.service';

@Component({
  selector: 'app-quote-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quote-section.component.html',
  styleUrl: './quote-section.component.css'
})
export class QuoteSectionComponent implements OnInit {
  /** CMS key prefix: 'quote1' or 'quote2' */
  @Input() prefix = 'quote1';

  private contentService = inject(WeddingContentService);

  imageUrl = signal<string | null>(null);
  quoteText = signal('');
  quoteAuthor = signal('');

  ngOnInit() {
    this.contentService.getAll().subscribe({
      next: c => {
        if (c[`${this.prefix}.imageUrl`]) this.imageUrl.set(c[`${this.prefix}.imageUrl`]);
        if (c[`${this.prefix}.text`]) this.quoteText.set(c[`${this.prefix}.text`]);
        if (c[`${this.prefix}.author`]) this.quoteAuthor.set(c[`${this.prefix}.author`]);
      },
      error: () => {}
    });
  }
}
