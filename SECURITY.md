# Políticas de Seguridad Web - Recuerdos QR

1. **Autenticación en Servidor**: El panel administrativo está resguardado mediante tokens JWT validados en cada petición sensible.
2. **Sanitización de Entradas**: Todos los datos enviados por el usuario se validan con esquemas Zod en el backend para prevenir XSS e inyecciones.
3. **Restricción MIME Real de Archivos**: La subida de fotografías y videos verifica los tipos MIME reales y extensiones de archivo permitidas (JPG, PNG, WebP, MP4, WebM).
4. **Protección de Datos Sensibles**: No existen credenciales, claves ni secretos incrustados en el código fuente. Toda la configuración sensible se gestiona a través de `.env`.
