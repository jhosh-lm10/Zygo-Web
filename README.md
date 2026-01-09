# Zygo - Clínica Obstétrica

Sitio web moderno de Zygo, una clínica obstétrica de alto nivel, profesional y compasiva, construido con Astro 4.x y Bun.

## 🚀 Descripción del Proyecto

Zygo es una clínica especializada en obstetricia que ofrece cuidado experto y compasivo para cada etapa del viaje maternal. Este sitio web fue desarrollado con un enfoque en:

- **Performance**: Optimización extrema con Astro SSG
- **SEO**: Meta tags completos, sitemap automático y schema.org markup
- **UX**: Animaciones suaves y View Transitions API
- **Accesibilidad**: HTML semántico y soporte completo WCAG AA
- **Responsividad**: Diseño mobile-first completamente responsive

## 🛠️ Stack Tecnológico

- **Framework**: Astro 5.x (Static Site Generation)
- **Runtime & Package Manager**: Bun
- **Estilos**: CSS nativo con variables CSS (metodología BEM)
- **JavaScript**: TypeScript para mejor type-safety
- **Content Management**: Astro Content Collections con Zod
- **Optimización de Imágenes**: Componente nativo de Astro
- **Animaciones**: View Transitions API + Intersection Observer

## 📁 Estructura del Proyecto

```
zygo-astro/
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── ServiceCard.astro
│   │   ├── TeamMember.astro
│   │   ├── ContactForm.astro
│   │   └── AnimatedSection.astro
│   ├── content/           # Content Collections
│   │   ├── config.ts      # Schemas de validación
│   │   ├── servicios/     # Archivos MD de servicios
│   │   └── equipo/        # Archivos MD del equipo
│   ├── layouts/           # Layouts base
│   │   └── BaseLayout.astro
│   ├── pages/             # Páginas del sitio (rutas)
│   │   ├── index.astro
│   │   ├── servicios.astro
│   │   ├── servicios-ginecologicos.astro
│   │   ├── servicios-obstetricos.astro
│   │   ├── equipo.astro
│   │   ├── contacto.astro
│   │   └── 404.astro
│   ├── scripts/           # Scripts TypeScript
│   │   └── scroll-animations.ts
│   └── styles/            # Estilos globales
│       └── global.css
├── public/                # Assets estáticos
│   ├── img/              # Imágenes
│   └── robots.txt
├── astro.config.mjs      # Configuración de Astro
├── package.json
├── tsconfig.json
└── README.md
```

## 🚦 Comandos Disponibles

```bash
# Instalar dependencias
bun install

# Iniciar servidor de desarrollo
bun run dev

# Build para producción
bun run build

# Preview del build de producción
bun run preview

# Ver comandos disponibles de Astro
bun run astro
```

## 🌐 Desarrollo Local

1. **Clonar el repositorio** (si aplica):
   ```bash
   git clone [URL_DEL_REPO]
   cd zygo-astro
   ```

2. **Instalar Bun** (si no lo tienes):
   - Windows: `powershell -c "irm bun.sh/install.ps1|iex"`
   - macOS/Linux: `curl -fsSL https://bun.sh/install | bash`

3. **Instalar dependencias**:
   ```bash
   bun install
   ```

4. **Iniciar servidor de desarrollo**:
   ```bash
   bun run dev
   ```

5. **Abrir en el navegador**:
   El sitio estará disponible en `http://localhost:4321`

## 📄 Páginas del Sitio

- **Inicio** (`/`): Página principal con hero, servicios destacados, equipo e instalaciones
- **Servicios** (`/servicios`): Listado de categorías de servicios (ginecológicos y obstétricos)
- **Servicios Ginecológicos** (`/servicios-ginecologicos`): Detalle de servicios ginecológicos
- **Servicios Obstétricos** (`/servicios-obstetricos`): Detalle de servicios obstétricos
- **Equipo** (`/equipo`): Presentación del equipo médico con estadísticas
- **Contacto** (`/contacto`): Formulario de contacto, información y mapa
- **404**: Página personalizada de error 404

## 🎨 Características Principales

### Performance
- **SSG (Static Site Generation)**: Todo el contenido es pre-renderizado en build time
- **Optimización de Imágenes**: Componente `<Image>` con lazy loading y formatos modernos
- **Code Splitting**: Carga automática solo del JavaScript necesario
- **CSS Minificado**: Estilos optimizados y comprimidos

### SEO
- Meta tags dinámicos en cada página
- Open Graph tags completos para redes sociales
- Schema.org markup (MedicalBusiness)
- Sitemap automático generado
- Canonical URLs en todas las páginas
- robots.txt configurado

### UX/UI
- View Transitions API para navegación ultra suave
- Animaciones de scroll con Intersection Observer
- Menú móvil responsive con animaciones
- Formulario de contacto con validación en tiempo real
- Diseño mobile-first completamente responsive

### Accesibilidad
- HTML semántico (`header`, `nav`, `main`, `footer`, `section`, `article`)
- ARIA labels en elementos interactivos
- Alt text descriptivo en todas las imágenes
- Contraste de colores WCAG AA
- Soporte para `prefers-reduced-motion`

## 🔧 Content Collections

El sitio usa Astro Content Collections para gestionar el contenido de forma estructurada:

### Servicios (`src/content/servicios/`)
```typescript
{
  title: string;
  description: string;
  icon: string;          // SVG string
  category: 'ginecologico' | 'obstetrico';
  order: number;
}
```

### Equipo (`src/content/equipo/`)
```typescript
{
  name: string;
  specialty: string;
  image: string;         // Path a la imagen
  bio?: string;
  order: number;
}
```

## 🎯 Variables CSS

El sitio utiliza variables CSS para mantener la consistencia del diseño:

```css
/* Colores */
--primary-color: #722F37;
--accent-color: #F5F5DC;
--cta-color: #A8343A;

/* Tipografía */
--font-primary: 'Poppins', sans-serif;
--font-secondary: 'Manrope', sans-serif;

/* Espaciado, sombras, transiciones, etc. */
```

## 📱 Información de Contacto

- **Teléfono**: 930 928 175
- **Email**: zygo.gos@gmail.com
- **Dirección (Lima)**: Av. Defensores del Morro 611 - Oficina 301, Chorrillos
- **Dirección (Cusco)**: Calle Nueva Nro 478, Segundo piso - Wanchaq
- **Redes Sociales**: Facebook, Instagram, TikTok

## 📝 Notas Importantes

- El proyecto mantiene el sitio HTML original intacto en el directorio padre
- Todas las funcionalidades del sitio original están preservadas y mejoradas
- La identidad visual (colores, tipografías) se mantiene 100%
- El sitio es completamente estático (no requiere servidor Node.js en producción)

## 🚀 Deployment

El sitio puede ser desplegado en cualquier servicio de hosting estático:

- **Vercel**: `vercel deploy`
- **Netlify**: Conectar repositorio Git
- **GitHub Pages**: Configurar GitHub Actions
- **Cloudflare Pages**: Conectar repositorio Git

Comando de build: `bun run build`  
Directorio de salida: `dist/`

## 📄 Licencia

Proyecto privado - Todos los derechos reservados © 2024 Zygo

---

Desarrollado con ❤️ usando Astro + Bun
