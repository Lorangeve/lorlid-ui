import { resolveElements } from "@solid-primitives/refs";
import {
  For,
  onMount,
  splitProps,
  type Component,
  type FlowComponent,
  type ValidComponent,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import { lorlid_info } from "../utils/log";

export interface TransitionGroupProps {
  as?: ValidComponent;
}

export const TransitionGroup: FlowComponent<TransitionGroupProps> = (props) => {
  const [local, other] = splitProps(props, ["as"]);
  const els = resolveElements(() => props.children).toArray();

  return <For each={els}>{(el) => el}</For>;
};
