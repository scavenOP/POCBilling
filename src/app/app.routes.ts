import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/new-bill', pathMatch: 'full' },
  { path: 'new-bill', loadComponent: () => import('./components/new-bill/new-bill.component').then(m => m.NewBillComponent) },
  { path: 'shop-settings', loadComponent: () => import('./components/shop-settings/shop-settings.component').then(m => m.ShopSettingsComponent) },
  { path: 'product-management', loadComponent: () => import('./components/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent) },
  { path: 'customer-management', loadComponent: () => import('./components/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent) },
  { path: 'user-management', loadComponent: () => import('./components/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent) },
  { path: '**', redirectTo: '/new-bill' }
];
