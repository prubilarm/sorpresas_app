# Reporte de Migración desde la Plantilla Original (`regalo_qr_producto_v2`)

## Respaldo Creado
- **Directorio de respaldo**: `regalo_qr_producto_v2_backup` (Copia exacta intacta de los archivos originales).

## Componentes y Recursos Reutilizados
1. **Visuales e Íconos**:
   - `assets/fotos/portada.svg`, `assets/fotos/foto01.svg`, `assets/fotos/foto02.svg`, `assets/qr.png` migrados al sistema de assets estáticos y almacenamiento.
2. **Estilos CSS y Animaciones**:
   - Los gradientes radiales oscuros, efectos de resplandor, tipografía Georgia / script y animaciones clave (`beat`, `pulse`, `floatHeart`) de `styles.css` fueron incorporados en `apps/web/src/index.css`.
3. **Lógica de Negocio y Configuración**:
   - La estructura de objeto `window.REGALO` de `config.js` fue refinada y tipada formalmente en `@recuerdos-qr/shared`.
   - El generador de QR externo de `generar_qr.html` fue sustituido por un servicio backend nativo de alta resolución en PNG y SVG (`/api/projects/:id/qr`).
   - La tarjeta de impresión de 9x9 cm de `tarjeta.html` fue convertida en un servicio de exportación PDF vectorial de alta precisión (`/api/projects/:id/card`).
