export default function showHelp() {
  console.log(`
  kqgen CLI – Angular Component & Service Generator

  Usage:
    kqgen <command> <full/path/to/name> [options]

  Available commands:
    ng:component        Generate an Angular component (presets: default, table, filter, add-dialog)
    ng:service          Generate an Angular service (REST, GraphQL or empty)
    init                Create a sample gen.config.js in the project root
    --prettier,  -p     Enable prettier configuration

  Options for ng:component:
    --type=table,   -t, -tt        Table component (with paginator and sorting)
    --type=filter,  -tf            Filter standalone component
    --type=add-dialog, -tad        Form in Angular Material dialog
    --bare,         -b, -B         Only the base file (no extra folders)
    (If --type is not set, the default preset is used)

  Options for ng:service:
    --rest,         -r             Force REST service
    --gql,          -g             Force GraphQL service (generates queries)
    --none,         -n             Empty service (structure only)
    (If type is not set, a prompt will appear)

  Examples:
    kqgen ng:component dashboard/home/user
    kqgen ng:component shared/avatar --bare
    kqgen ng:component dashboard/products --type=table
    kqgen ng:component shared/quick-search --type=filter
    kqgen ng:component shared/user-form --type=add-dialog
    kqgen ng:service auth shared/services --rest
    kqgen ng:service product shared/services --gql
    kqgen init

  Notes:
    - All commands generate files inside src/app/ (by default)
    - If no type is specified, an interactive prompt will be shown (when applicable)
    - Customize colors and styles by creating gen.config.js in your project root
    - Use 'kqgen help', 'kqgen --help' or 'kqgen -h' to see this help

  `);
  process.exit(0);
}
