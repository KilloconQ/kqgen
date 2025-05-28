# gencli

> 🛠️ CLI minimalista y extensible para generar componentes y servicios en Angular (y próximamente para otros frameworks).

---

## Instalación

```bash
# Ejecutar sin instalar (con pnpm)
pnpm dlx github:killoconq/gencli <comando> <ruta> [opciones]
npx github:killoconq/gencli <comando> <ruta> [opciones]
bunx github:killoconq/gencli <comando> <ruta> [opciones]

# O instalar globalmente (después puedes correr simplemente "gen")
pnpm add -g gencli
bun add -g gencli
npm i -g gencli
gen <comando> <ruta> [opciones]
```

---

## Comandos disponibles

### `ng:component`

Genera un componente Angular con estructura base y diferentes presets según el tipo.

#### Presets/Tipos soportados

- `--type=table`, `-t`, `-tt`  
  Componente tipo tabla (`MatTable`) con paginador y ordenamiento.
- `--type=filter`, `-tf`  
  Componente filtro standalone.
- `--type=add-dialog`, `-tad`  
  Componente formulario en diálogo (Angular Material).
- `--bare`, `-b`, `-B`  
  Solo genera el archivo base (`.ts`, `.html`, `.scss`) sin carpetas extra.
- _(Por defecto)_  
  Componente base con carpetas `services/`, `models/`, `interfaces/`.

#### Ejemplos

```bash
gen ng:component dashboard/home/user
gen ng:component shared/avatar --bare
gen ng:component dashboard/products --type=table
gen ng:component dashboard/products -t
gen ng:component shared/quick-search --type=filter
gen ng:component shared/user-form --type=add-dialog
```

---

### `ng:service`

Genera un servicio Angular REST, GraphQL (con queries) o vacío.

#### Opciones

- `--rest`, `-r`  
  Fuerza generación de servicio REST.
- `--gql`, `-g`  
  Fuerza generación de servicio GraphQL (genera queries base).
- `--none`, `-n`  
  Servicio limpio (solo estructura, sin métodos base).
- _(Por defecto)_  
  Se pregunta en consola el tipo de servicio.

#### Ejemplos

```bash
gen ng:service shared/services/user
gen ng:service shared/services/producto --gql
gen ng:service shared/services/auth  --rest
gen ng:service shared/services/util --none
```

---

## Notas

- Todos los comandos crean las carpetas bajo `src/app/` por defecto.
- Si no se especifica el tipo de servicio o componente, se mostrará un selector interactivo en la terminal (si aplica).
- Puedes ver la ayuda con:  
  `gen help`  
  `gen --help`  
  `gen -h`

---

## Planeado próximamente

- Soporte para NestJS (`nest:service`, `nest:module`)
- Soporte para React (`react:component`)
- Nuevos presets y estructuras customizables

---

## Licencia

MIT – creado por Fernando Corrales.
