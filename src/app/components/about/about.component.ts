import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  stats = [
    { value: '1200+', label: 'Weddings Captured' },
    { value: '50+', label: 'Cities Covered' },
    { value: '98%', label: 'Happy Couples' },
    { value: '10+', label: 'Years of Experience' }
  ];

  pillars = [
    {
      icon: '◎',
      title: 'Candid-First Approach',
      body: 'We blend into your celebration and capture real emotions as they unfold — no stiff poses, only genuine moments.'
    },
    {
      icon: '◈',
      title: 'Cinematic Storytelling',
      body: 'Every wedding film we create is a short movie, not just a recording. We craft narrative arcs with music, emotion, and detail shots.'
    },
    {
      icon: '◇',
      title: 'AI-Powered Delivery',
      body: 'Guests find their photos instantly with our AI facial recognition gallery. No more searching through thousands of images.'
    },
    {
      icon: '◉',
      title: 'Nationwide Coverage',
      body: 'From intimate court marriages in Mumbai to royal palace weddings in Rajasthan — our team travels everywhere across India.'
    }
  ];
}
