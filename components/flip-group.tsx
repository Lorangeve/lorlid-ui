import {
  createContext,
  createSignal,
  onMount,
  useContext,
  type Accessor,
  type JSX,
  type Setter,
  type ValidComponent,
} from "solid-js";
import { Dynamic, For } from "solid-js/web";

import { animateFlipping, shuffle } from "../utils";

const FlipContext = createContext<FlipGroupContextValue>();

type ShuffleFn = (list: any[]) => any[];

// - Root

export interface FlipGroupRootProps {
  shuffle?: ShuffleFn;
  children?: JSX.Element;
}

function FlipGroupRoot(props: FlipGroupRootProps): JSX.Element {
  const [list, setList] = createSignal<any[]>([]);
  const [contentItemRefs, setContentItemRefs] = createSignal<
    Record<number, HTMLElement | null>
  >({});

  const context: FlipGroupContextValue = {
    list,
    setList,
    contentItemRefs,
    setContentItemRefs,
    shuffle: props.shuffle ?? shuffle,
  };

  return (
    <FlipContext.Provider value={context}>
      {props.children}
    </FlipContext.Provider>
  );
}

export interface FlipGroupContextProps {
  children?: JSX.Element;
}

// - Context

export interface FlipGroupContextValue {
  list?: Accessor<any[]>;
  setList?: Setter<any[]>;
  shuffle?: ShuffleFn;
  contentItemRefs: Accessor<Record<number, HTMLElement | null>>;
  setContentItemRefs: Setter<Record<number, HTMLElement | null>>;
}

function useFlipGroupContext() {
  const context = useContext(FlipContext);

  if (!context)
    throw new Error("FlipGroupContext must be used within a FlipGroupRoot");

  return context;
}

// - Button

export interface FlipGroupButtonProps {
  onClick?: () => void;
  as?: ValidComponent;
  children?: JSX.Element;
}

function FlipGroupButton(props: FlipGroupButtonProps): JSX.Element {
  const { list, setList, contentItemRefs, shuffle } = useFlipGroupContext();

  function clickHandler() {
    if (props.onClick) props.onClick();
    animateFlipping(contentItemRefs(), () => {
      if (setList && list && shuffle) {
        setList(shuffle(list()));
      }
    });
  }

  return (
    <Dynamic component={props.as ?? "button"} onClick={clickHandler}>
      {props.children}
    </Dynamic>
  );
}

// - Content

export interface FlipGroupContentProps {
  as?: ValidComponent;
  list: any[];
  children?: JSX.Element;
}

function FlipGroupContent(props: FlipGroupContentProps): JSX.Element {
  let refs: Record<number, HTMLElement | null> = {};

  const { list, setList, setContentItemRefs } = useFlipGroupContext();

  onMount(() => {
    setList?.(props.list);
    setContentItemRefs(refs);
  });

  return (
    <Dynamic
      class="lo-flip-group__content"
      component={props.as ?? "ul"}
      list={props.list}
    >
      <For each={list?.()}>
        {(itm, idx) => (
          <Dynamic
            class="lo-flip-group__item"
            component={props.as ?? "li"}
            ref={(el: HTMLElement) => {
              refs[idx()] = el;
            }}
          >
            {itm}
          </Dynamic>
        )}
      </For>
    </Dynamic>
  );
}

export const FlipGroup = Object.assign(FlipGroupRoot, {
  Button: FlipGroupButton,
  Content: FlipGroupContent,
});
