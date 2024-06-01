import { useRef } from "react";
import reactToCustomElement from "../../src";

export interface CustomElementProps {
  propString?: string | undefined;
  propNumber?: number | undefined;
  propBoolean?: boolean | undefined;
  propObject?: Record<string, unknown> | undefined;
  propArray?: unknown[] | undefined;
  propFunction?: (args: unknown) => void | undefined;
  onMyEvent?: ((str: string) => void) | undefined;
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
    onMyEvent?.("hello");
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
            onMyEvent: onMyEvent ? "function" : undefined,
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
