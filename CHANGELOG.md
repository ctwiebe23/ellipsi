# Ellipsi Changelog

## 3.2.1 on 2025-12-30

### Added

- `summary` shortcut function

### Fixed

- `tag` now handles `SVGElements` the same as `HTMLElements`

## 3.2.0 on 2025-10-17

### Changed

- Transitioned to Typescript to generate both the JavaScript file and the
  Typescript declaration file used by IDEs for code completion

## 3.1.0 on 2025-10-17

### Added

- Optional parameter to the `on` function that lets you pass options to the
  `addEventListener` function

## 3.0.1 on 2025-09-12

### Fixed

- Properly documented types via JSDoc

## 3.0.0 on 2025-08-14

### Added

- `Shadow`, a type that contains potential shadow roots
- `shadow`, a function that builds `Shadow`s
- `shortTag`, a function that builds shortcut functions

### Changed

- `forEach` loops to `for(let i = 0;...)` loops for performance
- `attr` function no longer takes a variable number of arguments
- Shortcut functions are now created with `shortTag`

### Removed

- minified version, as performance gains turned out to be negligble and the
  minify package was unable to process regular expressions

## 2.4.2 on 2025-06-19

### Fixed

- bug when passing `null` or `undefined` to `tag` function

## 2.0.0 on 2025-06-18

### Added

- example directory

### Changed

- name to Ellipsi (Finnish for ellipsis) from dots

## 1.4.0 on 2025-06-17

### Added

- Minify as a development dependency
- ability to use JSON objects as attributes in `tag` function

## 1.0.0 on 2025-06-16

### Added

- Project start
