import { listen, type EventName } from "@tauri-apps/api/event";
import type { JSX } from "solid-js";
import { lorlid_info } from "../../../utils/log";

export type DragPayload = {
  readonly paths: string[];
  readonly position: { x: number; y: number };
};

export interface TauriEvent extends Event {
  readonly id: number;
  readonly payload: DragPayload | null;
}

export interface TauriDragEventProps {
  onDragEnter?: JSX.EventHandler<HTMLElement, TauriEvent>;
  onDragDrop?: JSX.EventHandler<HTMLElement, TauriEvent>;
  onDragLeave?: JSX.EventHandler<HTMLElement, TauriEvent>;
  onDragOver?: JSX.EventHandler<HTMLElement, TauriEvent>;
}

export async function createTauriDragEventListener<
  T extends TauriDragEventProps,
>(tauriEvent: EventName, props: T, ref: HTMLElement | undefined) {
  return await listen<DragPayload>(tauriEvent, (event) => {
    // 合成事件以匹配预期的签名
    let target: TauriEvent = Object.assign(new CustomEvent(tauriEvent), {
      id: event.id,
      payload: event.payload,
    });

    // Patch currentTarget and target to satisfy Solid's JSX.EventHandler signature
    Object.defineProperty(target, "currentTarget", {
      value: ref,
      writable: false,
      configurable: true,
      enumerable: true,
    });
    Object.defineProperty(target, "target", {
      value: ref,
      writable: false,
      configurable: true,
      enumerable: true,
    });

    ref?.dispatchEvent(target);
    switch (tauriEvent) {
      case "tauri://drag-enter":
        lorlid_info(target);
        props.onDragEnter?.(target as any);
        break;
      case "tauri://drag-over":
        props.onDragOver?.(target as any);
        break;
      case "tauri://drag-leave":
        props.onDragLeave?.(target as any);
        break;
      case "tauri://drag-drop":
        props.onDragDrop?.(target as any);
        break;
    }
  });
}
