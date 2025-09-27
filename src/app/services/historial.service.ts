import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Pedido, HistorialCompras, EstadoPedido, ItemCarrito } from '../models/interfaces/carrito.interface';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  private historialSubject = new BehaviorSubject<HistorialCompras>({
    pedidos: [],
    totalPedidos: 0,
    totalGastado: 0
  });

  public historial$ = this.historialSubject.asObservable();

  // Datos mock del historial
  private pedidosMock: Pedido[] = [
    {
      id: '1',
      numeroPedido: 'PED-2024-001',
      fecha: new Date('2024-09-20'),
      items: [
        {
          carta: {
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
          cantidad: 2,
          subtotal: 50000
        },
        {
          carta: {
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
          cantidad: 1,
          subtotal: 45000
        }
      ],
      subtotal: 95000,
      costoEnvio: 5000,
      descuentos: 0,
      total: 100000,
      estado: 'Entregado',
      direccionEnvio: {
        nombre: 'Juan Pérez',
        direccion: 'Av. Providencia 1234, Depto 56',
        ciudad: 'Providencia',
        codigoPostal: '7500000',
        telefono: '+56912345678'
      },
      metodoPago: {
        tipo: 'Tarjeta',
        detalles: '****-1234 Visa'
      },
      fechaEstimadaEntrega: new Date('2024-09-25'),
      fechaEntrega: new Date('2024-09-24'),
      tracking: 'CH123456789CL'
    },
    {
      id: '2',
      numeroPedido: 'PED-2024-002',
      fecha: new Date('2024-09-15'),
      items: [
        {
          carta: {
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
          },
          cantidad: 1,
          subtotal: 35000
        }
      ],
      subtotal: 35000,
      costoEnvio: 3000,
      descuentos: 2000,
      total: 36000,
      estado: 'En Tránsito',
      direccionEnvio: {
        nombre: 'Juan Pérez',
        direccion: 'Av. Providencia 1234, Depto 56',
        ciudad: 'Providencia',
        codigoPostal: '7500000',
        telefono: '+56912345678'
      },
      metodoPago: {
        tipo: 'PayPal',
        detalles: 'juan.perez@email.com'
      },
      fechaEstimadaEntrega: new Date('2024-09-28'),
      tracking: 'CH987654321CL'
    },
    {
      id: '3',
      numeroPedido: 'PED-2024-003',
      fecha: new Date('2024-09-10'),
      items: [
        {
          carta: {
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
          cantidad: 3,
          subtotal: 75000
        }
      ],
      subtotal: 75000,
      costoEnvio: 0, // Envío gratis
      descuentos: 5000,
      total: 70000,
      estado: 'Cancelado',
      direccionEnvio: {
        nombre: 'Juan Pérez',
        direccion: 'Av. Providencia 1234, Depto 56',
        ciudad: 'Providencia',
        codigoPostal: '7500000',
        telefono: '+56912345678'
      },
      metodoPago: {
        tipo: 'Transferencia',
        detalles: 'Transferencia bancaria'
      },
      notas: 'Pedido cancelado por solicitud del cliente'
    }
  ];

  constructor() {
    this.cargarHistorial();
  }

  // Obtener historial completo
  obtenerHistorial(): Observable<HistorialCompras> {
    return this.historial$;
  }

  // Obtener pedido por ID
  obtenerPedidoPorId(id: string): Pedido | undefined {
    return this.pedidosMock.find(pedido => pedido.id === id);
  }

  // Obtener pedidos por estado
  obtenerPedidosPorEstado(estado: EstadoPedido): Pedido[] {
    return this.pedidosMock.filter(pedido => pedido.estado === estado);
  }

  // Filtrar pedidos por rango de fechas
  obtenerPedidosPorFecha(fechaInicio: Date, fechaFin: Date): Pedido[] {
    return this.pedidosMock.filter(pedido =>
      pedido.fecha >= fechaInicio && pedido.fecha <= fechaFin
    );
  }

  // Obtener estadísticas del historial
  obtenerEstadisticas(): {
    totalPedidos: number;
    totalGastado: number;
    pedidosEntregados: number;
    pedidosPendientes: number;
    pedidosCancelados: number;
    promedioCompra: number;
  } {
    const pedidosEntregados = this.pedidosMock.filter(p => p.estado === 'Entregado').length;
    const pedidosPendientes = this.pedidosMock.filter(p =>
      ['Pendiente', 'Confirmado', 'Preparando', 'Enviado', 'En Tránsito'].includes(p.estado)
    ).length;
    const pedidosCancelados = this.pedidosMock.filter(p =>
      ['Cancelado', 'Devuelto'].includes(p.estado)
    ).length;

    const totalGastado = this.pedidosMock
      .filter(p => p.estado === 'Entregado')
      .reduce((sum, pedido) => sum + pedido.total, 0);

    const promedioCompra = pedidosEntregados > 0 ? totalGastado / pedidosEntregados : 0;

    return {
      totalPedidos: this.pedidosMock.length,
      totalGastado,
      pedidosEntregados,
      pedidosPendientes,
      pedidosCancelados,
      promedioCompra
    };
  }

  // Reordenar un pedido (agregar items al carrito)
  reordenar(pedidoId: string): ItemCarrito[] {
    const pedido = this.obtenerPedidoPorId(pedidoId);
    return pedido ? pedido.items : [];
  }

  // Cancelar pedido
  cancelarPedido(pedidoId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const pedido = this.pedidosMock.find(p => p.id === pedidoId);
        if (pedido && ['Pendiente', 'Confirmado'].includes(pedido.estado)) {
          pedido.estado = 'Cancelado';
          pedido.notas = 'Pedido cancelado por el usuario';
          this.cargarHistorial(); // Actualizar el subject
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  private cargarHistorial(): void {
    const pedidosOrdenados = [...this.pedidosMock].sort((a, b) =>
      b.fecha.getTime() - a.fecha.getTime()
    );

    const totalGastado = this.pedidosMock
      .filter(p => p.estado === 'Entregado')
      .reduce((sum, pedido) => sum + pedido.total, 0);

    const historial: HistorialCompras = {
      pedidos: pedidosOrdenados,
      totalPedidos: this.pedidosMock.length,
      totalGastado,
      ultimoPedido: pedidosOrdenados[0]
    };

    this.historialSubject.next(historial);
  }

  // Obtener color del estado
  obtenerColorEstado(estado: EstadoPedido): string {
    const colores = {
      'Pendiente': 'warning',
      'Confirmado': 'primary',
      'Preparando': 'secondary',
      'Enviado': 'tertiary',
      'En Tránsito': 'secondary',
      'Entregado': 'success',
      'Cancelado': 'danger',
      'Devuelto': 'medium'
    };
    return colores[estado] || 'medium';
  }

  // Obtener descripción del estado
  obtenerDescripcionEstado(estado: EstadoPedido): string {
    const descripciones = {
      'Pendiente': 'Esperando confirmación de pago',
      'Confirmado': 'Pago confirmado, preparando pedido',
      'Preparando': 'Preparando tu pedido para envío',
      'Enviado': 'Pedido enviado desde nuestro almacén',
      'En Tránsito': 'Tu pedido está en camino',
      'Entregado': 'Pedido entregado exitosamente',
      'Cancelado': 'Pedido cancelado',
      'Devuelto': 'Pedido devuelto'
    };
    return descripciones[estado] || 'Estado desconocido';
  }
}
