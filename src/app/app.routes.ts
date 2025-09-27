import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'historial-compras',
    loadComponent: () => import('./pages/historial-compras/historial-compras.page').then(m => m.HistorialComprasPage)
  }
];
