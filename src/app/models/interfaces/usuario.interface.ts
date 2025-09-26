export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: Date;
  region: string;
  comuna: string;
  direccion: string;
  fotoPerfil?: string;
  fechaRegistro: Date;
  ultimaConexion: Date;
}

export interface PerfilUsuario {
  usuario: Usuario;
  estadisticas: EstadisticasUsuario;
}

export interface EstadisticasUsuario {
  totalCompras: number;
  totalGastado: number;
  cartasFavoritas: number;
  fechaUltimaCompra?: Date;
}

export interface EditarPerfilData {
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string; // En formato string para los formularios
  region: string;
  comuna: string;
  direccion: string;
  password?: string;
  confirmarPassword?: string;
}

export interface Region {
  id: string;
  nombre: string;
  comunas: Comuna[];
}

export interface Comuna {
  id: string;
  nombre: string;
  regionId: string;
}

export interface CambioPassword {
  passwordActual: string;
  passwordNueva: string;
  confirmarPassword: string;
}
