import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss'
})
export class BreadcrumbComponent implements OnInit {
  items: BreadcrumbItem[] = [];
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.update(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.update(event.urlAfterRedirects));
  }

  private update(url: string): void {
    const path = url.split('?')[0].split('/').filter(Boolean);
    const labels: Record<string, string> = {
      home: 'Início',
      new: 'Nova simulação',
      all: 'Minhas simulações',
      report: 'Relatório da simulação',
      account: 'Minha conta',
      help: 'Ajuda'
    };
    const current = labels[path[0]] ?? 'Página';
    this.items = path[0] === 'home'
      ? [{ label: current }]
      : [{ label: 'Início', url: '/home' }, { label: current }];
  }
}
