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
  properties?: string[] | undefined;

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
    properties = [],
    attributes = [],
  }: Options<P>,
) {
  // https://react.dev/blog/2024/04/25/react-19#support-for-custom-elements
  class CustomElement extends HTMLElement {
    static observedAttributes = [...attributes];

    private container: HTMLElement | ShadowRoot;
    private root: Root;
    private connected = false;
    private _componentProps = {} as P;
    private _componentAttributes: Record<string, string> = {};
    private _componentEventHandlers = {};

    constructor() {
      super();

      this.container = shadowMode
        ? this.attachShadow({ mode: shadowMode })
        : this;
      this.root = createRoot(this.container);

      // React detects if the node has the corresponding properties otherwise
      // props gets set as attributes.
      for (const propertyName of properties) {
        Object.defineProperty(this, propertyName, {
          enumerable: true,
          get() {
            return this._componentProps[propertyName];
          },
          set(value) {
            this._componentProps[propertyName] = value;
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
      this._componentAttributes[attribute] = value;
      this.render();
    }

    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions | undefined,
    ): void {
      for (const propName of properties) {
        // Ignore setting custom event handlers for props named `on***`. Store the callback and pass it directly to the component.
        // https://github.com/facebook/react/blob/9d4fba078812de0363fe9514b943650fa479e8af/packages/react-dom-bindings/src/client/DOMPropertyOperations.js#L189-L231
        if (propName[0] === "o" && propName[1] === "n") {
          const useCapture = propName.endsWith("Capture");
          const eventName = propName.slice(
            2,
            useCapture ? propName.length - 7 : undefined,
          );

          if (eventName === type) {
            // This is an event handler that user passed in.
            // @ts-expect-error - TODO
            this._componentEventHandlers[propName] = listener;
            return;
          }
        }
      }

      super.addEventListener(type, listener, options);
    }

    private render() {
      if (!this.connected) {
        return;
      }

      const Wrapper = strictMode ? StrictMode : Fragment;

      this.root.render(
        <Wrapper>
          <Component
            {...this._componentAttributes}
            {...this._componentProps}
            {...this._componentEventHandlers}
          />
        </Wrapper>,
      );
    }
  }

  return CustomElement;
}
