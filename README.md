# react-to-custom-element

Converts your React component into a custom element that you can register using `customElements.define`.

This library leverages the parsing capability in React 19.

## Install

```bash
npm i react-to-custom-element
```

## Usage

```js
const element = reactToCustomElement(CustomElement, {
  properties: {
    propString: "string",
    propNumber: "number",
    propBoolean: "boolean",
    propObject: "object",
    propArray: "array",
    propFunction: "function",
    onMyEvent: "function",
  },
  attributes: ["my-first-attribute", "my-second-attribute"],
});

customElements.define("custom-element", element);
```
