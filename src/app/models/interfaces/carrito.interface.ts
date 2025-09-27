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
  numeroPedido: string;
  fecha: Date;
  items: ItemCarrito[];
  subtotal: number;
  costoEnvio: number;
  descuentos: number;
  total: number;
  estado: EstadoPedido;
  direccionEnvio: DireccionEnvio;
  metodoPago: MetodoPago;
  fechaEstimadaEntrega?: Date;
  fechaEntrega?: Date;
  tracking?: string;
  notas?: string;
}

export type EstadoPedido = 
  | 'Pendiente' 
  | 'Confirmado' 
  | 'Preparando' 
  | 'Enviado' 
  | 'En Tránsito' 
  | 'Entregado' 
  | 'Cancelado' 
  | 'Devuelto';

export interface HistorialCompras {
  pedidos: Pedido[];
  totalPedidos: number;
  totalGastado: number;
  ultimoPedido?: Pedido;
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