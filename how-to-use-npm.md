# How to use npm to install 3rd-party js

1. cd < current project folder>

2. npm init -y (initialize npm env by default setting, will create package.json)

3. npm install < 3rd-party js > (will add js in `node_modules`)

> `npm create` will create a project with vite.
---

# Pay Attention to JS Type

## iife umd esm

- iife : use with <script>
- esm : use with import module
- umd : use with module loader

## js mjs

- js : use with <script>
- mjs : use with import module
