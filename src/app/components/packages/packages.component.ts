import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface WeddingPackage {
  name: string;
  description: string;
  features: string[];
  highlight?: boolean;
}

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.css'
})
export class PackagesComponent {
  packages: WeddingPackage[] = [
    {
      name: 'Essential',
      description: 'Perfect for intimate ceremonies and small weddings.',
      features: [
        '1 photographer',
        '8 hours of coverage',
        '300+ edited photos',
        'Online gallery delivery',
        'Print-ready files'
      ]
    },
    {
      name: 'Signature',
      description: 'Our most popular package for a complete wedding experience.',
      features: [
        '2 photographers',
        '12 hours of coverage',
        '600+ edited photos',
        '3-minute cinematic highlights film',
        'Same-day slideshow',
        'Premium leather album',
        'Online gallery & USB'
      ],
      highlight: true
    },
    {
      name: 'Cinematic',
      description: 'Full cinematic production for couples who want it all.',
      features: [
        '3 photographers + videographer',
        'Full-day coverage',
        '1000+ edited photos',
        'Feature-length wedding film',
        'Drone aerial shots',
        'Pre-wedding shoot included',
        'Luxury album + canvas print',
        'Priority editing (7 days)'
      ]
    }
  ];

  scrollToEnquiry(): void {
    const el = document.getElementById('hero-enquiry') ?? document.querySelector('.enquiry-card');
    el?.scrollIntoView({ behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
