import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonItem,
  IonThumbnail,
  IonLabel,
  IonButton,
  IonIcon,
  IonInput,
  IonChip,
  IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { removeOutline, addOutline, trashOutline } from 'ionicons/icons';
import { ItemCarrito } from '../../models/interfaces/carrito.interface';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-carrito-item',
  templateUrl: './carrito-item.component.html',
  styleUrls: ['./carrito-item.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonItem,
    IonThumbnail,
    IonLabel,
    IonButton,
    IonIcon,
    IonInput,
    IonChip,
    IonText
  ]
})
export class CarritoItemComponent {
  @Input() item!: ItemCarrito;
  @Input() modoEdicion = true;
  @Output() itemActualizado = new EventEmitter<void>();
  @Output() itemEliminado = new EventEmitter<number>();

  constructor(private carritoService: CarritoService) {
    addIcons({ removeOutline, addOutline, trashOutline });
  }

  aumentarCantidad(): void {
    const nuevaCantidad = this.item.cantidad + 1;

    // Verificar stock disponible
    if (nuevaCantidad <= this.item.carta.stock) {
      this.carritoService.actualizarCantidad(this.item.carta.id, nuevaCantidad);
      this.itemActualizado.emit();
    }
  }

  disminuirCantidad(): void {
    const nuevaCantidad = this.item.cantidad - 1;

    if (nuevaCantidad > 0) {
      this.carritoService.actualizarCantidad(this.item.carta.id, nuevaCantidad);
      this.itemActualizado.emit();
    }
  }

  eliminarItem(): void {
    this.carritoService.removerCarta(this.item.carta.id);
    this.itemEliminado.emit(this.item.carta.id);
  }

  onCantidadChange(event: any): void {
    const nuevaCantidad = parseInt(event.target.value) || 1;

    if (nuevaCantidad > 0 && nuevaCantidad <= this.item.carta.stock) {
      this.carritoService.actualizarCantidad(this.item.carta.id, nuevaCantidad);
      this.itemActualizado.emit();
    } else {
      // Revertir al valor anterior si es inválido
      event.target.value = this.item.cantidad;
    }
  }

  get precioFormateado(): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(this.item.carta.precio);
  }

  get subtotalFormateado(): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(this.item.subtotal);
  }

  get puedeAumentar(): boolean {
    return this.item.cantidad < this.item.carta.stock;
  }

  get colorRareza(): string {
    const colores = {
      'Común': 'medium',
      'Poco Común': 'success',
      'Rara': 'primary',
      'Épica': 'secondary',
      'Legendaria': 'warning'
    };
    return colores[this.item.carta.rareza] || 'medium';
  }
}
