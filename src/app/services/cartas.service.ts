import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Carta, FiltrosBusqueda } from '../models/interfaces/carta.interface';

@Injectable({
  providedIn: 'root'
})
export class CartasService {
  private cartasSubject = new BehaviorSubject<Carta[]>([]);
  public cartas$ = this.cartasSubject.asObservable();

  private cartasMock: Carta[] = [
    {
      id: 1,
      nombre: 'Pikachu Holo',
      descripcion: 'Carta holográfica de Pikachu en excelente estado',
      precio: 25000,
      imagen: 'assets/images/pikachu-holo.jpg',
      categoria: 'Pokemon',
      juego: 'Pokemon TCG',
      rareza: 'Rara',
      stock: 5,
      fechaLanzamiento: new Date('2023-01-15'),
      estado: 'Nuevo'
    },
    {
      id: 2,
      nombre: 'Charizard GX',
      descripcion: 'Poderosa carta de Charizard GX edición especial',
      precio: 45000,
      imagen: 'assets/images/charizard-gx.jpg',
      categoria: 'Pokemon',
      juego: 'Pokemon TCG',
      rareza: 'Épica',
      stock: 3,
      fechaLanzamiento: new Date('2023-03-10'),
      estado: 'Nuevo'
    },
    {
      id: 3,
      nombre: 'Dragón Blanco de Ojos Azules',
      descripcion: 'Clásica carta de Yu-Gi-Oh! primera edición',
      precio: 35000,
      imagen: 'assets/images/dragon-blanco.jpg',
      categoria: 'Yu-Gi-Oh',
      juego: 'Yu-Gi-Oh! TCG',
      rareza: 'Legendaria',
      stock: 2,
      fechaLanzamiento: new Date('2022-12-01'),
      estado: 'Usado - Excelente'
    }
  ];

  constructor() {
    this.cartasSubject.next(this.cartasMock);
  }

  // Obtener todas las cartas
  obtenerCartas(): Observable<Carta[]> {
    return this.cartas$;
  }

  // Obtener carta por ID
  obtenerCartaPorId(id: number): Carta | undefined {
    return this.cartasMock.find(carta => carta.id === id);
  }

  // Filtrar cartas
  filtrarCartas(filtros: FiltrosBusqueda): Carta[] {
    let cartasFiltradas = [...this.cartasMock];

    // Filtro por texto
    if (filtros.texto) {
      cartasFiltradas = cartasFiltradas.filter(carta =>
        carta.nombre.toLowerCase().includes(filtros.texto.toLowerCase()) ||
        carta.descripcion.toLowerCase().includes(filtros.texto.toLowerCase())
      );
    }

    // Filtro por categoria
    if (filtros.categoria && filtros.categoria !== 'todas') {
      cartasFiltradas = cartasFiltradas.filter(carta =>
        carta.categoria.toLowerCase() === filtros.categoria.toLowerCase()
      );
    }

    // Filtro por juego
    if (filtros.juegoSeleccionado && filtros.juegoSeleccionado !== 'todos') {
      cartasFiltradas = cartasFiltradas.filter(carta =>
        carta.juego.toLowerCase() === filtros.juegoSeleccionado.toLowerCase()
      );
    }

    // Filtro por rareza
    if (filtros.rarezaSeleccionada && filtros.rarezaSeleccionada !== 'todas') {
      cartasFiltradas = cartasFiltradas.filter(carta =>
        carta.rareza.toLowerCase() === filtros.rarezaSeleccionada.toLowerCase()
      );
    }

    // Filtro por precio
    cartasFiltradas = cartasFiltradas.filter(carta =>
      carta.precio >= filtros.precioMin && carta.precio <= filtros.precioMax
    );

    // Ordenar
    switch (filtros.ordenarPor) {
      case 'precio-asc':
        cartasFiltradas.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio-desc':
        cartasFiltradas.sort((a, b) => b.precio - a.precio);
        break;
      case 'nombre':
        cartasFiltradas.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'fecha':
        cartasFiltradas.sort((a, b) => b.fechaLanzamiento.getTime() - a.fechaLanzamiento.getTime());
        break;
    }

    return cartasFiltradas;
  }

  // Obtener categorías disponibles
  obtenerCategorias(): string[] {
    return [...new Set(this.cartasMock.map(carta => carta.categoria))];
  }

  // Obtener juegos disponibles
  obtenerJuegos(): string[] {
    return [...new Set(this.cartasMock.map(carta => carta.juego))];
  }

  // Actualizar stock de una carta
  actualizarStock(id: number, nuevoStock: number): void {
    const carta = this.cartasMock.find(c => c.id === id);
    if (carta) {
      carta.stock = nuevoStock;
      this.cartasSubject.next([...this.cartasMock]);
    }
  }
}
