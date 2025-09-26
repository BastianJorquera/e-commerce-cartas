import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonButton,
  IonIcon,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonNote,
  IonBadge,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, cartOutline, checkmarkOutline } from 'ionicons/icons';

import { CarritoItemComponent } from '../components/carrito-item/carrito-item.component';
import { CarritoService } from '../services/carrito.service';
import { Carrito } from '../models/interfaces/carrito.interface';

@Component({
  selector: 'app-carrito',
  templateUrl: 'carrito.page.html',
  styleUrls: ['carrito.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonButton,
    IonIcon,
    IonText,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonNote,
    IonBadge,
    CarritoItemComponent
  ],
})
export class CarritoPage implements OnInit, OnDestroy {
  carrito: Carrito = {
    items: [],
    total: 0,
    cantidadItems: 0
  };

  private subscription?: Subscription;

  constructor(
    private carritoService: CarritoService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({ trashOutline, cartOutline, checkmarkOutline });
  }

  ngOnInit() {
    // Suscribirse a cambios en el carrito
    this.subscription = this.carritoService.carrito$.subscribe(
      carrito => this.carrito = carrito
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async onVaciarCarrito(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Vaciar Carrito',
      message: '¿Estás seguro de que quieres eliminar todos los productos del carrito?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Vaciar',
          role: 'confirm',
          handler: () => {
            this.carritoService.vaciarCarrito();
            this.mostrarToast('Carrito vaciado correctamente', 'success');
          }
        }
      ]
    });

    await alert.present();
  }

  onItemActualizado(): void {
    // El carrito se actualiza automáticamente via subscription
    console.log('Item actualizado');
  }

  onItemEliminado(cartaId: number): void {
    this.mostrarToast('Producto eliminado del carrito', 'success');
  }

  async onProcederPago(): Promise<void> {
    if (this.carrito.items.length === 0) {
      this.mostrarToast('El carrito está vacío', 'warning');
      return;
    }

    // TODO: Implementar proceso de pago real
    const alert = await this.alertController.create({
      header: 'Proceder al Pago',
      message: `Total a pagar: ${this.totalFormateado}\n\n¿Continuar con el proceso de pago?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Continuar',
          role: 'confirm',
          handler: () => {
            this.simularPago();
          }
        }
      ]
    });

    await alert.present();
  }

  private async simularPago(): Promise<void> {
    // Simulación de proceso de pago
    const loading = await this.toastController.create({
      message: 'Procesando pago...',
      duration: 2000
    });

    await loading.present();

    setTimeout(() => {
      this.carritoService.vaciarCarrito();
      this.mostrarToast('¡Pago realizado con éxito! Gracias por tu compra.', 'success');
    }, 2000);
  }

  private async mostrarToast(mensaje: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'bottom'
    });

    await toast.present();
  }

  trackByItem(index: number, item: any): number {
    return item.carta.id;
  }

  get totalFormateado(): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(this.carrito.total);
  }

  get carritoVacio(): boolean {
    return this.carrito.items.length === 0;
  }

  get resumenCompra(): string {
    if (this.carritoVacio) return '';

    const items = this.carrito.cantidadItems;
    const itemsTexto = items === 1 ? 'producto' : 'productos';
    return `${items} ${itemsTexto} • ${this.totalFormateado}`;
  }
}
