import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'catalogo',
        loadComponent: () =>
          import('../catalogo/catalogo.page').then((m) => m.CatalogoPage),
      },
      {
        path: 'carrito',
        loadComponent: () =>
          import('../carrito/carrito.page').then((m) => m.CarritoPage),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('../perfil/perfil.page').then((m) => m.PerfilPage),
      },
      {
        path: '',
        redirectTo: '/tabs/catalogo',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/catalogo',
    pathMatch: 'full',
  },
];
