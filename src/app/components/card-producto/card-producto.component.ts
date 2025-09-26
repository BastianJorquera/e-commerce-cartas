import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonChip,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cartOutline, heartOutline, heart } from 'ionicons/icons';
import { Carta } from '../../models/interfaces/carta.interface';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-card-producto',
  templateUrl: './card-producto.component.html',
  styleUrls: ['./card-producto.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonBadge,
    IonChip,
    IonLabel
  ]
})
export class CardProductoComponent {
  @Input() carta!: Carta;
  @Input() mostrarBtnAgregar = true;
  @Output() cartaSeleccionada = new EventEmitter<Carta>();
  @Output() agregarAFavoritos = new EventEmitter<Carta>();

  esFavorita = false;

  constructor(private carritoService: CarritoService) {
    addIcons({ cartOutline, heartOutline, heart });
  }

  onAgregarAlCarrito(): void {
    if (this.carta.stock > 0) {
      this.carritoService.agregarCarta(this.carta);
    }
  }

  onVerDetalle(): void {
    this.cartaSeleccionada.emit(this.carta);
  }

  onToggleFavorito(): void {
    this.esFavorita = !this.esFavorita;
    this.agregarAFavoritos.emit(this.carta);
  }

  get stockBajo(): boolean {
    return this.carta.stock <= 3 && this.carta.stock > 0;
  }

  get sinStock(): boolean {
    return this.carta.stock === 0;
  }

  get precioFormateado(): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(this.carta.precio);
  }

  get colorRareza(): string {
    const colores = {
      'Común': 'medium',
      'Poco Común': 'success',
      'Rara': 'primary',
      'Épica': 'secondary',
      'Legendaria': 'warning'
    };
    return colores[this.carta.rareza] || 'medium';
  }

  get estadoClase(): string {
    return 'estado-' + this.carta.estado.toLowerCase().replace(/\s+/g, '-');
  }
}
