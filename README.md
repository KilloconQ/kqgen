# kqgen

> **A fast and flexible CLI for generating Angular components and services.**
> Includes presets for tables, filters and for REST/GraphQL services.

---

## 🚀 Installation

### Global

```sh
npm install -g kqgen
# or
pnpm add -g kqgen
# or
bun add -g kqgen
```

### Temporary usage (without global install)

```sh
npx kqgen <command> ...
```

---

## ⚡️ Basic Usage

```sh
kqgen <command> <full/path/to/name> [options]
```

### Examples

```sh
kqgen ng:component dashboard/home/user
kqgen ng:component shared/avatar --bare
kqgen ng:component dashboard/products --type=table
kqgen ng:component shared/quick-search --type=filter
kqgen ng:component shared/user-form --type=add-dialog
kqgen ng:service auth shared/services --rest
kqgen ng:service product shared/services --gql
kqgen init
```

---

## 🎛️ Component Presets and Types

- `--type=table, -t, -tt`
  Table component (Angular Material, paginator & sort)
- `--type=filter, -tf`
  Standalone filter component
- `--type=add-dialog, -tad`
  Form in Angular Material dialog
- `--bare, -b, -B`
  Only the base file (no services/models/interfaces folders)
- If no --type is provided, the default preset is used

---

## 🚦 Service Options

- `--rest, -r` REST service
- `--gql, -g` GraphQL service (with base queries)
- `--none, -n` Empty service (structure only)

(If not specified, a prompt will be shown)

---

## 🎨 Global Customization

Edit `gen.config.js` in your project root to change colors and styles for generated components:

```js
// gen.config.js
export default {
  theme: {
    primaryColor: "#377bc8",
    secondaryColor: "#7c3aed",
    borderRadius: "8px",
  },
};
```

You can quickly generate this config with:

```sh
kqgen init
```

---

## 📝 Notes

- All commands generate files inside `src/app/` by default (unless run from another subfolder).
- If no type is specified for service or component, an interactive prompt appears.
- Use `kqgen help`, `kqgen --help` or `kqgen -h` to display help.
- Works on Linux, Mac, and Windows.
- Inspired by the speed and flexibility of modern code generators.

---

## 🤝 Contributions

Pull requests, feature ideas, and issues are welcome at [KilloconQ](https://github.com/KilloconQ/kqgen.git).
Want new presets? Request or contribute them!

---
