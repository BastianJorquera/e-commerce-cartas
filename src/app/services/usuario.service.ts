import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario, PerfilUsuario, EstadisticasUsuario, Region, Comuna, EditarPerfilData } from '../models/interfaces/usuario.interface';
import { HistorialService } from './historial.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioSubject = new BehaviorSubject<PerfilUsuario | null>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  // Datos mock del usuario (solo info personal)
  private usuarioMock: Usuario = {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@email.com',
    fechaNacimiento: new Date('1990-05-15'),
    region: 'Metropolitana',
    comuna: 'Providencia',
    direccion: 'Av. Providencia 1234, Depto 56',
    fotoPerfil: 'assets/images/avatar-placeholder.jpg',
    fechaRegistro: new Date('2023-01-10'),
    ultimaConexion: new Date()
  };

  // Regiones y comunas de Chile (datos simplificados)
  private regionesChile: Region[] = [
    {
      id: 'rm',
      nombre: 'Metropolitana',
      comunas: [
        { id: 'santiago', nombre: 'Santiago', regionId: 'rm' },
        { id: 'providencia', nombre: 'Providencia', regionId: 'rm' },
        { id: 'lascondes', nombre: 'Las Condes', regionId: 'rm' },
        { id: 'vitacura', nombre: 'Vitacura', regionId: 'rm' },
        { id: 'nuñoa', nombre: 'Ñuñoa', regionId: 'rm' },
        { id: 'maipu', nombre: 'Maipú', regionId: 'rm' },
        { id: 'loprado', nombre: 'Lo Prado', regionId: 'rm' }
      ]
    },
    {
      id: 'valparaiso',
      nombre: 'Valparaíso',
      comunas: [
        { id: 'valparaiso-ciudad', nombre: 'Valparaíso', regionId: 'valparaiso' },
        { id: 'viñadelmar', nombre: 'Viña del Mar', regionId: 'valparaiso' },
        { id: 'concon', nombre: 'Concón', regionId: 'valparaiso' }
      ]
    },
    {
      id: 'biobio',
      nombre: 'Biobío',
      comunas: [
        { id: 'concepcion', nombre: 'Concepción', regionId: 'biobio' },
        { id: 'talcahuano', nombre: 'Talcahuano', regionId: 'biobio' },
        { id: 'chillan', nombre: 'Chillán', regionId: 'biobio' }
      ]
    }
  ];

  constructor(private historialService: HistorialService) {
    // El perfil se cargará combinando usuario + estadísticas del historial
  }

  // Obtener perfil del usuario (combina datos personales + estadísticas del historial)
  obtenerPerfil(): Observable<PerfilUsuario | null> {
    return combineLatest([
      this.historialService.obtenerHistorial()
    ]).pipe(
      map(([historial]) => {
        if (!this.usuarioMock) return null;

        // Calcular estadísticas reales desde el historial
        const estadisticas = this.historialService.obtenerEstadisticas();
        const pedidosEntregados = historial.pedidos.filter(p => p.estado === 'Entregado');

        const estadisticasReales: EstadisticasUsuario = {
          totalCompras: estadisticas.pedidosEntregados,
          totalGastado: estadisticas.totalGastado,
          cartasFavoritas: 8, // TODO: Implementar sistema de favoritos real
          fechaUltimaCompra: historial.ultimoPedido?.fecha
        };

        const perfil: PerfilUsuario = {
          usuario: this.usuarioMock,
          estadisticas: estadisticasReales
        };

        // Actualizar el subject para mantener compatibilidad
        this.usuarioSubject.next(perfil);

        return perfil;
      })
    );
  }

  // Actualizar información del usuario
  actualizarPerfil(datos: EditarPerfilData): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const perfilActual = this.usuarioSubject.value;
        if (perfilActual) {
          perfilActual.usuario = {
            ...perfilActual.usuario,
            nombre: datos.nombre,
            apellido: datos.apellido,
            email: datos.email,
            fechaNacimiento: new Date(datos.fechaNacimiento),
            region: datos.region,
            comuna: datos.comuna,
            direccion: datos.direccion
          };
          this.usuarioSubject.next(perfilActual);
          this.guardarEnStorage(perfilActual);
        }
        resolve(true);
      }, 1000);
    });
  }

  // Cambiar foto de perfil
  cambiarFotoPerfil(nuevaFoto: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const perfilActual = this.usuarioSubject.value;
        if (perfilActual) {
          perfilActual.usuario.fotoPerfil = nuevaFoto;
          this.usuarioSubject.next(perfilActual);
          this.guardarEnStorage(perfilActual);
        }
        resolve(true);
      }, 500);
    });
  }

  // Cambiar contraseña
  cambiarPassword(passwordActual: string, passwordNueva: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular validación de password actual
        if (passwordActual === 'password123') { // Password mock
          resolve(true);
        } else {
          reject('Contraseña actual incorrecta');
        }
      }, 1000);
    });
  }

  // Cerrar sesión
  cerrarSesion(): void {
    this.usuarioSubject.next(null);
    localStorage.removeItem('usuario-perfil');
  }

  // Verificar si hay usuario logueado
  estaLogueado(): boolean {
    return this.usuarioSubject.value !== null;
  }

  // Obtener regiones
  obtenerRegiones(): Region[] {
    return this.regionesChile;
  }

  // Obtener comunas por región
  obtenerComunasPorRegion(regionId: string): Comuna[] {
    const region = this.regionesChile.find(r => r.id === regionId);
    return region ? region.comunas : [];
  }

  // Obtener estadísticas del usuario
  obtenerEstadisticas(): EstadisticasUsuario | null {
    const perfil = this.usuarioSubject.value;
    return perfil ? perfil.estadisticas : null;
  }

  private guardarEnStorage(perfil: PerfilUsuario): void {
    localStorage.setItem('usuario-perfil', JSON.stringify(perfil));
  }

  private cargarDeStorage(): PerfilUsuario | null {
    const datos = localStorage.getItem('usuario-perfil');
    if (datos) {
      try {
        const perfil = JSON.parse(datos);
        // Convertir strings de fecha a Date objects
        perfil.usuario.fechaNacimiento = new Date(perfil.usuario.fechaNacimiento);
        perfil.usuario.fechaRegistro = new Date(perfil.usuario.fechaRegistro);
        perfil.usuario.ultimaConexion = new Date(perfil.usuario.ultimaConexion);
        if (perfil.estadisticas.fechaUltimaCompra) {
          perfil.estadisticas.fechaUltimaCompra = new Date(perfil.estadisticas.fechaUltimaCompra);
        }
        return perfil;
      } catch (error) {
        console.error('Error al cargar perfil del storage:', error);
        return null;
      }
    }
    return null;
  }
}
