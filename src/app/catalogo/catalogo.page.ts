import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonRange,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonChip,
  IonText,
  IonItem,
  IonFab,
  IonFabButton,
  IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, filterOutline, cartOutline } from 'ionicons/icons';

import { CardProductoComponent } from '../components/card-producto/card-producto.component';
import { CartasService } from '../services/cartas.service';
import { CarritoService } from '../services/carrito.service';
import { Carta, FiltrosBusqueda } from '../models/interfaces/carta.interface';

@Component({
  selector: 'app-catalogo',
  templateUrl: 'catalogo.page.html',
  styleUrls: ['catalogo.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonRange,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonChip,
    IonText,
    IonItem,
    IonFab,
    IonFabButton,
    IonBadge,
    CardProductoComponent
  ],
})
export class CatalogoPage implements OnInit, OnDestroy {
  cartas: Carta[] = [];
  cartasFiltradas: Carta[] = [];
  categorias: string[] = [];
  juegos: string[] = [];
  cantidadCarrito = 0;

  mostrarFiltros = false;

  filtros: FiltrosBusqueda = {
    texto: '',
    categoria: 'todas',
    juegoSeleccionado: 'todos',
    rarezaSeleccionada: 'todas',
    precioMin: 0,
    precioMax: 100000,
    ordenarPor: 'nombre'
  };

  rarezas = ['Todas', 'Común', 'Poco Común', 'Rara', 'Épica', 'Legendaria'];
  opcionesOrden = [
    { value: 'nombre', label: 'Nombre A-Z' },
    { value: 'precio-asc', label: 'Precio: Menor a Mayor' },
    { value: 'precio-desc', label: 'Precio: Mayor a Menor' },
    { value: 'fecha', label: 'Más Recientes' }
  ];

  private subscriptions: Subscription[] = [];

  constructor(
    private cartasService: CartasService,
    private carritoService: CarritoService
  ) {
    addIcons({ searchOutline, filterOutline, cartOutline });
  }

  ngOnInit() {
    this.cargarDatos();
    this.aplicarFiltros();

    // Suscribirse a cambios en el carrito
    const carritoSub = this.carritoService.obtenerCantidadItems().subscribe(
      cantidad => this.cantidadCarrito = cantidad
    );
    this.subscriptions.push(carritoSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private cargarDatos(): void {
    // Cargar cartas
    const cartasSub = this.cartasService.obtenerCartas().subscribe(
      cartas => {
        this.cartas = cartas;
        this.aplicarFiltros();
      }
    );
    this.subscriptions.push(cartasSub);

    // Cargar opciones de filtros
    this.categorias = this.cartasService.obtenerCategorias();
    this.juegos = this.cartasService.obtenerJuegos();

    // Establecer rango de precios
    if (this.cartas.length > 0) {
      const precios = this.cartas.map(c => c.precio);
      this.filtros.precioMin = Math.min(...precios);
      this.filtros.precioMax = Math.max(...precios);
    }
  }

  onBuscar(event: any): void {
    this.filtros.texto = event.target.value || '';
    this.aplicarFiltros();
  }

  onCategoriaChange(): void {
    this.aplicarFiltros();
  }

  onJuegoChange(): void {
    this.aplicarFiltros();
  }

  onRarezaChange(): void {
    this.aplicarFiltros();
  }

  onPrecioChange(event: any): void {
    this.filtros.precioMin = event.detail.value.lower;
    this.filtros.precioMax = event.detail.value.upper;
    this.aplicarFiltros();
  }

  onOrdenChange(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.cartasFiltradas = this.cartasService.filtrarCartas(this.filtros);
  }

  toggleFiltros(): void {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  limpiarFiltros(): void {
    this.filtros = {
      texto: '',
      categoria: 'todas',
      juegoSeleccionado: 'todos',
      rarezaSeleccionada: 'todas',
      precioMin: 0,
      precioMax: 100000,
      ordenarPor: 'nombre'
    };
    this.aplicarFiltros();
  }

  onCartaSeleccionada(carta: Carta): void {
    // TODO: Navegar a página de detalle de la carta
    console.log('Carta seleccionada:', carta);
  }

  onAgregarAFavoritos(carta: Carta): void {
    // TODO: Implementar sistema de favoritos
    console.log('Agregar a favoritos:', carta);
  }

  trackByCarta(index: number, carta: Carta): number {
    return carta.id;
  }

  get precioRangoTexto(): string {
    const min = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(this.filtros.precioMin);

    const max = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(this.filtros.precioMax);

    return `${min} - ${max}`;
  }
}
