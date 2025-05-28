export default function showHelp() {
  console.log(`
    Uso:
      gen <comando> <ruta/completa/al/nombre> [opciones]

    Comandos disponibles:
      ng:component       Genera un componente Angular con estructura base o preset
      ng:service         Genera un servicio Angular (REST, GraphQL o vacío)

    Presets y tipos para ng:component:
      --type=table, -t, -tt           Genera un componente de tabla (con paginador/sort)
      --type=filter, -tf              Genera un componente filtro (standalone)
      --type=add-dialog, -tad         Genera un formulario en diálogo (Angular Material)
      --bare, -b, -B                  Solo el archivo base (sin carpetas extra)
      (Si no se indica --type, se genera el preset default)

    Opciones para ng:service:
      --rest, -r                      Fuerza servicio tipo REST
      --gql, -g                       Fuerza servicio tipo GraphQL (genera queries base)
      --none, -n                      Servicio limpio (solo estructura)
      (Si no se indica tipo, se preguntará en consola)

    Ejemplos:
      gen ng:component dashboard/home/user
      gen ng:component shared/avatar --bare
      gen ng:component dashboard/products --type=table
      gen ng:component dashboard/products -t
      gen ng:component shared/quick-search --type=filter
      gen ng:component shared/user-form --type=add-dialog
      gen ng:service auth shared/services --rest
      gen ng:service producto shared/services --gql

    Notas:
      - Todos los comandos crean las carpetas bajo src/app/
      - Si no se especifica el tipo de servicio o componente, se mostrará un selector interactivo (si aplica)
      - El comando 'gen help', 'gen --help' o 'gen -h' muestra esta ayuda

    `);
  process.exit(0);
}
