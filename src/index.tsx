import { Fragment, StrictMode } from "react";
import { type Root, createRoot } from "react-dom/client";

interface Options<P> {
  /**
   * Use strict mode. Defaults to `true`.
   */
  strictMode?: boolean | undefined;

  /**
   * The mode of the shadow root.
   */
  shadowMode?: ShadowRootMode | undefined;

  /**
   * Properties to be defined on the custom element.
   */
  properties?:
    | Record<
        keyof P,
        "string" | "number" | "boolean" | "array" | "object" | "function"
      >
    | undefined;

  /**
   * Attributes to be defined on the custom element. The names
   * should be lowercase.
   */
  attributes?: string[] | undefined;
}

export default function reactToCustomElement<P>(
  Component: React.ComponentType<P>,
  {
    strictMode = true,
    shadowMode,
    properties = {} as NonNullable<Options<P>["properties"]>,
    attributes = [],
  }: Options<P>,
) {
  const observedAttributes: string[] = [];
  const props: string[] = [];

  for (const key of Object.keys(properties)) {
    props.push(key);
  }

  for (const attributeName of attributes) {
    observedAttributes.push(attributeName);
  }

  // https://react.dev/blog/2024/04/25/react-19#support-for-custom-elements
  // https://github.com/facebook/react/blob/9d4fba078812de0363fe9514b943650fa479e8af/packages/react-dom-bindings/src/client/DOMPropertyOperations.js#L189-L231
  class CustomElement extends HTMLElement {
    static observedAttributes = observedAttributes;

    private container: HTMLElement | ShadowRoot;
    private root: Root;
    private connected = false;
    private componentProps = {} as P;
    private componentAttributes: Record<string, string> = {};

    constructor() {
      super();

      this.container = shadowMode
        ? this.attachShadow({ mode: shadowMode })
        : this;
      this.root = createRoot(this.container);

      // React detects if the node has the corresponding properties otherwise
      // props gets set as attributes.
      for (const propertyName of props) {
        Object.defineProperty(this, propertyName, {
          enumerable: true,
          get() {
            return this.componentProps[propertyName];
          },
          set(value) {
            this.componentProps[propertyName] = value;
            this.render();
          },
        });
      }
    }

    connectedCallback() {
      this.connected = true;
      this.render();
    }

    disconnectedCallback() {
      this.connected = false;
      this.root.unmount();
    }

    attributeChangedCallback(attribute: string, _: string, value: string) {
      this.componentAttributes[attribute] = value;
      this.render();
    }

    private render() {
      if (!this.connected) {
        return;
      }

      const Wrapper = strictMode ? StrictMode : Fragment;

      this.root.render(
        <Wrapper>
          {/* @ts-expect-error - TODO */}
          <Component {...this.componentAttributes} {...this.componentProps} />
        </Wrapper>,
      );
    }
  }

  return CustomElement;
}
