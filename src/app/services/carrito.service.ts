import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItemCarrito, Carrito } from '../models/interfaces/carrito.interface';
import { Carta } from '../models/interfaces/carta.interface';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoSubject = new BehaviorSubject<Carrito>({
    items: [],
    total: 0,
    cantidadItems: 0
  });

  public carrito$ = this.carritoSubject.asObservable();

  constructor() {
    this.cargarCarritoLocal();
  }

  // Agregar carta al carrito
  agregarCarta(carta: Carta, cantidad: number = 1): void {
    const carritoActual = this.carritoSubject.value;
    const itemExistente = carritoActual.items.find(item => item.carta.id === carta.id);

    if (itemExistente) {
      // Si ya existe, aumentar cantidad
      itemExistente.cantidad += cantidad;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.carta.precio;
    } else {
      // Si no existe, agregar nuevo item
      const nuevoItem: ItemCarrito = {
        carta: carta,
        cantidad: cantidad,
        subtotal: cantidad * carta.precio
      };
      carritoActual.items.push(nuevoItem);
    }

    this.actualizarTotales();
    this.guardarCarritoLocal();
  }

  // Remover carta del carrito
  removerCarta(cartaId: number): void {
    const carritoActual = this.carritoSubject.value;
    carritoActual.items = carritoActual.items.filter(item => item.carta.id !== cartaId);

    this.actualizarTotales();
    this.guardarCarritoLocal();
  }

  // Actualizar cantidad de una carta
  actualizarCantidad(cartaId: number, nuevaCantidad: number): void {
    if (nuevaCantidad <= 0) {
      this.removerCarta(cartaId);
      return;
    }

    const carritoActual = this.carritoSubject.value;
    const item = carritoActual.items.find(item => item.carta.id === cartaId);

    if (item) {
      item.cantidad = nuevaCantidad;
      item.subtotal = nuevaCantidad * item.carta.precio;
      this.actualizarTotales();
      this.guardarCarritoLocal();
    }
  }

  // Vaciar carrito
  vaciarCarrito(): void {
    this.carritoSubject.next({
      items: [],
      total: 0,
      cantidadItems: 0
    });
    this.guardarCarritoLocal();
  }

  // Obtener cantidad de items en el carrito
  obtenerCantidadItems(): Observable<number> {
    return new Observable(observer => {
      this.carrito$.subscribe(carrito => {
        observer.next(carrito.cantidadItems);
      });
    });
  }

  // Verificar si una carta está en el carrito
  estaEnCarrito(cartaId: number): boolean {
    const carritoActual = this.carritoSubject.value;
    return carritoActual.items.some(item => item.carta.id === cartaId);
  }

  // Obtener cantidad de una carta específica en el carrito
  obtenerCantidadCarta(cartaId: number): number {
    const carritoActual = this.carritoSubject.value;
    const item = carritoActual.items.find(item => item.carta.id === cartaId);
    return item ? item.cantidad : 0;
  }

  private actualizarTotales(): void {
    const carritoActual = this.carritoSubject.value;

    carritoActual.total = carritoActual.items.reduce((total, item) => total + item.subtotal, 0);
    carritoActual.cantidadItems = carritoActual.items.reduce((total, item) => total + item.cantidad, 0);

    this.carritoSubject.next(carritoActual);
  }

  private guardarCarritoLocal(): void {
    const carritoActual = this.carritoSubject.value;
    localStorage.setItem('carrito-cartas', JSON.stringify(carritoActual));
  }

  private cargarCarritoLocal(): void {
    const carritoGuardado = localStorage.getItem('carrito-cartas');
    if (carritoGuardado) {
      try {
        const carrito = JSON.parse(carritoGuardado);
        this.carritoSubject.next(carrito);
      } catch (error) {
        console.error('Error al cargar carrito del localStorage:', error);
      }
    }
  }
}
