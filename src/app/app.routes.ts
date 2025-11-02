import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'historial-compras',
    loadComponent: () => import('./pages/historial-compras/historial-compras.page').then(m => m.HistorialComprasPage)
  },
  {
    path: 'inicio-sesion',
    loadComponent: () => import('./pages/inicio-sesion/inicio-sesion/inicio-sesion.page').then( (m) => m.InicioSesionPage)
  },
  {
    path: 'crear-sesion',
    loadComponent: () => import('./pages/crear-sesion/crear-sesion/crear-sesion.page').then( (m) => m.CrearSesionPage)
  },
  {
  path: 'catalogo',
  loadComponent: () =>
    import('./catalogo/catalogo.page').then(m => m.CatalogoPage)
}

];
