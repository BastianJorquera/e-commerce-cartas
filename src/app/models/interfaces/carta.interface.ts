export interface Carta {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
  juego: string;
  rareza: 'Común' | 'Poco Común' | 'Rara' | 'Épica' | 'Legendaria';
  stock: number;
  fechaLanzamiento: Date;
  estado: 'Nuevo' | 'Usado - Excelente' | 'Usado - Bueno' | 'Usado - Regular';
}

export interface CategoriaFiltro {
  id: string;
  nombre: string;
  activo: boolean;
}

export interface FiltrosBusqueda {
  texto: string;
  categoria: string;
  juegoSeleccionado: string;
  rarezaSeleccionada: string;
  precioMin: number;
  precioMax: number;
  ordenarPor: 'precio-asc' | 'precio-desc' | 'nombre' | 'fecha';
}
