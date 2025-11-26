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

// - Root

function FlipGroupRoot(props: { children: JSX.Element }): JSX.Element {
  const [list, setList] = createSignal<any[]>([]);
  const [contentItemRefs, setContentItemRefs] = createSignal<
    Record<number, HTMLElement | null>
  >({});
  const [shuffle, setShuffle] = createSignal(() => {});

  const context: FlipGroupContextValue = {
    list,
    setList,
    contentItemRefs,
    setContentItemRefs,
    shuffle,
    setShuffle,
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
  shuffle?: Accessor<() => void>;
  setShuffle?: Setter<() => void>;
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
  const { list, setList, contentItemRefs } = useFlipGroupContext();

  function clickHandler() {
    if (props.onClick) props.onClick();
    animateFlipping(contentItemRefs(), () => {
      if (setList && list) {
        const newList = [...list()]; // 创建副本以触发更新
        shuffle(newList);
        setList(newList);
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
  shuffle?: () => void;
  children?: JSX.Element;
}

function FlipGroupContent(props: FlipGroupContentProps): JSX.Element {
  let refs: Record<number, HTMLElement | null> = {};

  const { list, setList, setContentItemRefs, setShuffle } =
    useFlipGroupContext();

  onMount(() => {
    setList?.(props.list);
    setContentItemRefs(refs);
    if (props.shuffle) setShuffle?.(() => props.shuffle!);
  });

  return (
    <Dynamic
      class="flip-group__content"
      component={props.as ?? "ul"}
      list={props.list}
    >
      <For each={list?.()}>
        {(itm, idx) => (
          <Dynamic
            class="flip-group__item"
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
