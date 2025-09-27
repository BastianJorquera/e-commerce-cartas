import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonText,
  IonChip,
  IonBadge,
  IonNote,
  IonSegment,
  IonSegmentButton,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  receiptOutline,
  refreshOutline,
  eyeOutline,
  closeOutline,
  checkmarkOutline,
  timeOutline,
  carOutline
} from 'ionicons/icons';

import { HistorialService } from '../../services/historial.service';
import { CarritoService } from '../../services/carrito.service';
import { HistorialCompras, Pedido, EstadoPedido } from '../../models/interfaces/carrito.interface';

@Component({
  selector: 'app-historial-compras',
  templateUrl: './historial-compras.page.html',
  styleUrls: ['./historial-compras.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonText,
    IonChip,
    IonBadge,
    IonNote,
    IonSegment,
    IonSegmentButton,
    FormsModule
  ]
})
export class HistorialComprasPage implements OnInit, OnDestroy {
  historial: HistorialCompras = {
    pedidos: [],
    totalPedidos: 0,
    totalGastado: 0
  };

  pedidosFiltrados: Pedido[] = [];
  filtroActivo: string = 'todos';
  cargando = true;

  private subscription?: Subscription;

  constructor(
    private historialService: HistorialService,
    private carritoService: CarritoService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({
      arrowBackOutline,
      receiptOutline,
      refreshOutline,
      eyeOutline,
      closeOutline,
      checkmarkOutline,
      timeOutline,
      carOutline
    });
  }

  ngOnInit() {
    this.cargarHistorial();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private cargarHistorial(): void {
    this.cargando = true;
    this.subscription = this.historialService.obtenerHistorial().subscribe(
      historial => {
        this.historial = historial;
        this.aplicarFiltro(this.filtroActivo);
        this.cargando = false;
      }
    );
  }

  onFiltroChange(event: any): void {
    this.filtroActivo = event.detail.value;
    this.aplicarFiltro(this.filtroActivo);
  }

  private aplicarFiltro(filtro: string): void {
    switch (filtro) {
      case 'todos':
        this.pedidosFiltrados = this.historial.pedidos;
        break;
      case 'entregados':
        this.pedidosFiltrados = this.historial.pedidos.filter(p => p.estado === 'Entregado');
        break;
      case 'pendientes':
        this.pedidosFiltrados = this.historial.pedidos.filter(p =>
          ['Pendiente', 'Confirmado', 'Preparando', 'Enviado', 'En Tránsito'].includes(p.estado)
        );
        break;
      case 'cancelados':
        this.pedidosFiltrados = this.historial.pedidos.filter(p =>
          ['Cancelado', 'Devuelto'].includes(p.estado)
        );
        break;
      default:
        this.pedidosFiltrados = this.historial.pedidos;
    }
  }

  onVerDetalle(pedido: Pedido): void {
    // TODO: Navegar a página de detalle del pedido
    this.mostrarToast(`Ver detalle del pedido ${pedido.numeroPedido}`, 'primary');
  }

  async onReordenar(pedido: Pedido): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Reordenar Pedido',
      message: `¿Deseas agregar todos los productos del pedido ${pedido.numeroPedido} al carrito?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar al Carrito',
          role: 'confirm',
          handler: () => {
            this.reordenarPedido(pedido);
          }
        }
      ]
    });

    await alert.present();
  }

  private reordenarPedido(pedido: Pedido): void {
    pedido.items.forEach(item => {
      this.carritoService.agregarCarta(item.carta, item.cantidad);
    });

    this.mostrarToast(
      `${pedido.items.length} producto(s) agregado(s) al carrito`,
      'success'
    );

    // Navegar al carrito
    this.router.navigate(['/tabs/carrito']);
  }

  async onCancelarPedido(pedido: Pedido): Promise<void> {
    if (!['Pendiente', 'Confirmado'].includes(pedido.estado)) {
      this.mostrarToast('Este pedido no puede ser cancelado', 'warning');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Cancelar Pedido',
      message: `¿Estás seguro de que quieres cancelar el pedido ${pedido.numeroPedido}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Sí, Cancelar',
          role: 'confirm',
          handler: () => {
            this.cancelarPedido(pedido.id);
          }
        }
      ]
    });

    await alert.present();
  }

  private async cancelarPedido(pedidoId: string): Promise<void> {
    try {
      const resultado = await this.historialService.cancelarPedido(pedidoId);
      if (resultado) {
        this.mostrarToast('Pedido cancelado correctamente', 'success');
        this.cargarHistorial(); // Recargar para actualizar el estado
      } else {
        this.mostrarToast('No se pudo cancelar el pedido', 'danger');
      }
    } catch (error) {
      this.mostrarToast('Error al cancelar el pedido', 'danger');
    }
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

  trackByPedido(index: number, pedido: Pedido): string {
    return pedido.id;
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(precio);
  }

  obtenerColorEstado(estado: EstadoPedido): string {
    return this.historialService.obtenerColorEstado(estado);
  }

  obtenerDescripcionEstado(estado: EstadoPedido): string {
    return this.historialService.obtenerDescripcionEstado(estado);
  }

  get estadisticas() {
    return this.historialService.obtenerEstadisticas();
  }

  get totalGastadoFormateado(): string {
    return this.formatearPrecio(this.historial.totalGastado);
  }
}
