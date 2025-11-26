import { resolveElements } from "@solid-primitives/refs";
import {
  createContext,
  createEffect,
  createSignal,
  For,
  on,
  onMount,
  splitProps,
  useContext,
  type Accessor,
  type FlowComponent,
  type JSX,
  type Setter,
  type ValidComponent,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { animateFlipping } from "../utils";

// - Root
export interface FlipGroupProps {}

const FlipGroupContext = createContext<FlipGroupContextValue>();

type FlipGroupItemRefs = Record<number | string, HTMLElement | null>;

const FlipGroupRoot: FlowComponent<FlipGroupProps> = (props) => {
  const [local, other] = splitProps(props, []);
  const [itemRefs, setItemRefs] = createSignal<FlipGroupItemRefs>({});

  const context: FlipGroupContextValue = {
    itemRefs,
    setItemRefs,
  };

  return (
    <FlipGroupContext.Provider value={context}>
      {props.children}
    </FlipGroupContext.Provider>
  );
};

// - Context
export interface FlipGroupContextValue {
  itemRefs: Accessor<FlipGroupItemRefs>;
  setItemRefs: Setter<FlipGroupItemRefs>;
}

export function useFlipGroupContext() {
  const context = useContext(FlipGroupContext);

  if (!context)
    throw new Error(
      "useFlipGroupContext must be used within a FlipGroupProvider",
    );

  return context;
}

// - Content
export interface FlipGroupContentProps {
  as?: ValidComponent;
}

const FlipGroupContent: FlowComponent<FlipGroupContentProps> = (props) => {
  const [, other] = splitProps(props, ["as"]);
  const { setItemRefs } = useFlipGroupContext();
  const els = resolveElements(() => props.children);

  // FLIP 动画效果
  createEffect(
    on(els.toArray, (els) => {
      const lastRefs: FlipGroupItemRefs = {};
      els.forEach((el, idx) => {
        const key = el.id ?? idx;
        if (el instanceof HTMLElement) lastRefs[key] = el;
      });

      let firstRefs;
      setItemRefs((preItemRefs) => {
        firstRefs = preItemRefs;
        return lastRefs;
      });

      if (firstRefs) animateFlipping(firstRefs, lastRefs);
    }),
  );

  return (
    <Dynamic
      component={props.as ?? "div"}
      class="lo-flip-group__content"
      {...other}
    >
      <For each={els.toArray()}>{(el) => el}</For>
    </Dynamic>
  );
};

// - Item
export interface FlipGroupItemProps {
  as?: ValidComponent;
  id?: string | number;
}

const FlipGroupItem: FlowComponent<FlipGroupItemProps> = (props) => {
  const [local, other] = splitProps(props, ["as"]);

  return <Dynamic component={local.as ?? "li"} {...other} />;
};

// - Button
export interface FlipGroupButtonProps {
  as?: ValidComponent;
  onClick?: () => void;
}

const FlipGroupButton: FlowComponent<FlipGroupButtonProps> = (props) => {
  const [local, other] = splitProps(props, ["as", "onClick"]);

  const { itemRefs } = useFlipGroupContext();

  const clickHandler: JSX.EventHandler<HTMLElement, MouseEvent> = (e) => {
    local.onClick?.();
  };

  return (
    <Dynamic
      component={props.as ?? "button"}
      class="lo-flip-group__button"
      onClick={clickHandler}
      {...other}
    />
  );
};

export const FlipGroup = Object.assign(FlipGroupRoot, {
  Button: FlipGroupButton,
  Content: FlipGroupContent,
  Item: FlipGroupItem,
});
