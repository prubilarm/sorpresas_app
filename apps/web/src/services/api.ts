// In production: connects to live Railway backend API
// In development: connects to local Express backend on http://localhost:4000/api
export const API_BASE =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:4000/api'
    : 'https://recuerdos-qrweb-production.up.railway.app/api';

export function getPrintableCardUrl(
  projectId: string,
  slug?: string,
  options?: {
    styleId?: string;
    kicker?: string;
    message?: string;
    names?: string;
    qrPosition?: string;
    fontFamily?: string;
    titleSize?: string;
    qrSize?: string;
    borderStyle?: string;
    canvasData?: any;
  }
): string {
  const params = new URLSearchParams();
  if (slug) {
    params.append('targetUrl', getPublicGiftUrl(slug));
  }
  if (options?.styleId) params.append('styleId', options.styleId);
  if (options?.kicker) params.append('kicker', options.kicker);
  if (options?.message) params.append('message', options.message);
  if (options?.names) params.append('names', options.names);
  if (options?.qrPosition) params.append('qrPosition', options.qrPosition);
  if (options?.fontFamily) params.append('fontFamily', options.fontFamily);
  if (options?.titleSize) params.append('titleSize', options.titleSize);
  if (options?.qrSize) params.append('qrSize', options.qrSize);
  if (options?.borderStyle) params.append('borderStyle', options.borderStyle);
  if (options?.canvasData) params.append('canvasData', JSON.stringify(options.canvasData));

  const queryStr = params.toString();
  return `${API_BASE}/projects/${projectId}/card${queryStr ? '?' + queryStr : ''}`;
}

export function getQrCodeUrl(
  projectId: string,
  format: 'png' | 'svg' = 'png',
  color: string = '#e83482',
  bgColor: string = '#ffffff',
  slug?: string
): string {
  const params = new URLSearchParams({
    format,
    color,
    bgColor,
  });
  if (slug) {
    params.append('targetUrl', getPublicGiftUrl(slug));
  }
  return `${API_BASE}/projects/${projectId}/qr?${params.toString()}`;
}

export function getPublicGiftUrl(slug: string): string {
  const customFrontend = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_FRONTEND_URL) || '';
  const baseUrl = customFrontend || 'https://sorpresas-app-web.vercel.app';
  return `${baseUrl.replace(/\/$/, '')}/r/${slug}`;
}

export function resolveMediaUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const backendServer = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:4000'
    : 'https://recuerdos-qrweb-production.up.railway.app';
  return `${backendServer}${url.startsWith('/') ? '' : '/'}${url}`;
}

export async function fetchPublicGift(slug: string) {
  const res = await fetch(`${API_BASE}/public/r/${slug}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'No fue posible cargar el regalo.');
  }
  return data;
}

export async function loginAdmin(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Error al iniciar sesión.');
  }
  return data;
}

export async function fetchProjects(token?: string, filters?: { search?: string; status?: string; occasion?: string }) {
  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.occasion) params.append('occasion', filters.occasion);

  const res = await fetch(`${API_BASE}/projects?${params.toString()}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al obtener proyectos');
  return data;
}

export async function fetchProjectById(id: string) {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Proyecto no encontrado');
  return data;
}

export async function createProject(payload: any) {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al crear proyecto');
  return data;
}

export async function updateProject(id: string, payload: any) {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al actualizar proyecto');
  return data;
}

export async function publishProject(id: string) {
  const res = await fetch(`${API_BASE}/projects/${id}/publish`, { method: 'POST' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al publicar proyecto');
  return data;
}

export async function unpublishProject(id: string) {
  const res = await fetch(`${API_BASE}/projects/${id}/unpublish`, { method: 'POST' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al despublicar proyecto');
  return data;
}

export async function duplicateProject(id: string) {
  const res = await fetch(`${API_BASE}/projects/${id}/duplicate`, { method: 'POST' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al duplicar proyecto');
  return data;
}

export async function deleteProject(id: string) {
  const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al eliminar proyecto');
  return data;
}

export async function uploadMediaFile(projectId: string, file: File, caption?: string) {
  const formData = new FormData();
  formData.append('projectId', projectId);
  formData.append('file', file);
  if (caption) formData.append('caption', caption);

  const res = await fetch(`${API_BASE}/media/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al subir archivo multimedia');
  return data;
}

export async function deleteMediaFile(id: string) {
  const res = await fetch(`${API_BASE}/media/${id}`, { method: 'DELETE' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al eliminar archivo');
  return data;
}

export async function trackAnalyticsEvent(projectId: string, eventType: string) {
  try {
    await fetch(`${API_BASE}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, eventType }),
    });
  } catch (err) {
    // Ignore analytics tracking errors silently
  }
}

export async function createProjectExport(projectId: string, config: any) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al solicitar exportación de video');
  return data;
}

export async function fetchProjectExports(projectId: string) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/exports`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al obtener historial de exportaciones');
  return data;
}

export async function deleteProjectExport(projectId: string, exportId: string) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/exports/${exportId}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al eliminar exportación');
  return data;
}
