import { Carta } from './carta.interface';

export interface ItemCarrito {
  carta: Carta;
  cantidad: number;
  subtotal: number;
}

export interface Carrito {
  items: ItemCarrito[];
  total: number;
  cantidadItems: number;
}

export interface Pedido {
  id: string;
  fecha: Date;
  items: ItemCarrito[];
  total: number;
  estado: 'Pendiente' | 'Confirmado' | 'Enviado' | 'Entregado' | 'Cancelado';
  direccionEnvio: DireccionEnvio;
  metodoPago: MetodoPago;
}

export interface DireccionEnvio {
  nombre: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  telefono: string;
}

export interface MetodoPago {
  tipo: 'Tarjeta' | 'PayPal' | 'Transferencia';
  detalles: string;
}
