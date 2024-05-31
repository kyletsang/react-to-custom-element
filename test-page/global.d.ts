import type { CustomElementProps } from "./src/CustomElement";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "custom-element": CustomElementProps;
    }
  }
}
