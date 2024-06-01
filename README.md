# react-to-custom-element

Converts your React component into a custom element that you can register using `customElements.define`. Props are parsed and handled within the converter such that camel-case names are retained and you don't have to register any custom event handlers for props that start with `on`.

This library leverages the parsing capability in React 19.

## Install

```bash
npm i react-to-custom-element
```

## Usage

```js
const element = reactToCustomElement(CustomElement, {
  properties: [
    "propString",
    "propNumber",
    "propBoolean",
    "propObject",
    "propArray",
    "propFunction",
    "onMyEvent",
  ],
  attributes: ["my-first-attribute", "my-second-attribute"],
});

customElements.define("custom-element", element);
```
