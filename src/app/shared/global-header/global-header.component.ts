import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonHeader,
  IonToolbar,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, bagOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-global-header',
  templateUrl: './global-header.component.html',
  styleUrls: ['./global-header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonButton,
    IonIcon
  ]
})
export class GlobalHeaderComponent {
  @Input() showSearch: boolean = true;
  @Input() searchPlaceholder: string = 'Búsqueda';

  constructor(private router: Router) {
    addIcons({ searchOutline, bagOutline, personOutline });
  }

  onSearchInput(event: any): void {
    const searchTerm = event.target.value;
    // TODO: Implementar lógica de búsqueda global
    console.log('Searching for:', searchTerm);
  }

  onCartClick(): void {
    this.router.navigate(['/tabs/carrito']);
  }

  onProfileClick(): void {
    this.router.navigate(['/tabs/perfil']);
  }
}