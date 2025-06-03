// 📁 frontend/types/admin.ts

export interface Usuario {
  id: number;
  nombreCompleto: string;
  correo: string;
  rol: 'admin' | 'vendedor' | 'comprador' | string;
  estado: 'activo' | 'bloqueado';
  createdAt?: string;
  totalProductos?: number;
  promedioCalificacion?: number;
  totalResenas?: number;
}

export interface Reporte {
  id: number;
  tipo: 'producto' | 'reseña' | 'mensaje';
  motivo: string;
  contenidoId: number;
  descripcion?: string;
  estado: 'pendiente' | 'resuelto';
  createdAt: string;
  usuario: {
    nombreCompleto: string;
    correo: string;
  };
}

export interface VendedorDetalle {
  id: number;
  nombre: string;
  promedioCalificacion: number;
  totalResenas: number;
  totalProductos: number;
  totalReportes: number;
}

// Otros tipos que puedas necesitar...