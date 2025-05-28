// Comando: help.js

export default function showHelp() {
  console.log(`
    Uso:
      gen <comando> <ruta/completa/al/nombre> [opciones]

    Comandos disponibles:
      ng:component     Genera un componente Angular
      ng:add-dialog    Genera un componente tipo formulario en diálogo
      ng:service       Genera un servicio Angular REST, GraphQL o vacío

    Opciones generales:
      --bare, -B, -b           No generar carpetas extra (solo para ng:component)
      --rest, -r               Forzar servicio tipo REST (ng:service)
      --gql, -g                Forzar servicio tipo GraphQL (ng:service)
      --none, -n               Servicio vacío (ng:service)

    Ejemplos:
      gen ng:component dashboard/home/user
      gen ng:component shared/avatar --bare
      gen ng:add-dialog settings/user-preferences
      gen ng:service user shared/services
      gen ng:service producto shared/services --gql
      gen ng:service util shared/services --none

    Todos los comandos crean las carpetas bajo src/app/

    Si no se especifica el tipo de servicio, se mostrará un selector interactivo.
  `);
  process.exit(0);
}
