import { useRef } from "react";
import reactToCustomElement from "../../src";

export interface CustomElementProps {
  propString?: string | undefined;
  propNumber?: number | undefined;
  propBoolean?: boolean | undefined;
  propObject?: Record<string, unknown> | undefined;
  propArray?: unknown[] | undefined;
  propFunction?: (args: unknown) => void | undefined;
  onMyEvent?: ((event: Event) => void) | undefined;
}

function CustomElement({
  propString,
  propNumber,
  propBoolean,
  propObject,
  propArray,
  propFunction,
  onMyEvent,
  ...props
}: CustomElementProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMyEventCallback() {
    const event = new CustomEvent("MyEvent", { detail: "event" });
    ref.current!.parentNode!.dispatchEvent(event);
  }

  function handlePropFunctionCallback() {
    propFunction?.({ a: "b" });
  }

  return (
    <div ref={ref}>
      <pre>
        {JSON.stringify(
          {
            propString,
            propNumber,
            propBoolean,
            propObject,
            propArray,
            propFunction: propFunction ? "function" : undefined,
            onEvent: onMyEvent ? "function" : undefined,
            spreadProps: {
              ...props,
            },
          },
          null,
          2,
        )}
      </pre>
      <button onClick={handleMyEventCallback}>Trigger onEvent</button>
      <button onClick={handlePropFunctionCallback}>Trigger propFunction</button>
    </div>
  );
}

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
