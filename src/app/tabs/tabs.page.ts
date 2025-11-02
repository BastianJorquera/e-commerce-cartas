import { Component, EnvironmentInjector, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { libraryOutline, cartOutline, personOutline } from 'ionicons/icons';
import { UsuarioService } from '../services/usuario.service';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [CommonModule, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(private router: Router, private usuarioService: UsuarioService) {
  addIcons({ libraryOutline, cartOutline, personOutline });
}

  onTabClick(event: Event, tab: string): void {
  event.preventDefault();

  if (tab === 'perfil') {
    if (this.usuarioService.estaLogueado()) {
      this.router.navigateByUrl('/tabs/perfil');
    } else {
      this.router.navigateByUrl('/inicio-sesion');
    }
  } else {
    this.router.navigateByUrl(`/tabs/${tab}`);
  }
  }
}

