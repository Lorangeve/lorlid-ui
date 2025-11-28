import { listen, type EventName } from "@tauri-apps/api/event";
import type { JSX } from "solid-js";
import { lorlid_info } from "../../../utils/log";

export const DRAG_EVENTS: EventName[] = [
  "tauri://drag-enter",
  "tauri://drag-drop",
  "tauri://drag-leave",
  "tauri://drag-over",
];

export type DragPayload = {
  readonly paths: string[];
  readonly position: { x: number; y: number };
};

export type DragOnElementStatus = "enter" | "over" | "leave" | "drop";

export interface TauriDragEvent extends Event {
  readonly id: number;
  readonly payload: DragPayload | null;
}

export interface TauriDragEventProps {
  onDragEnter?: JSX.EventHandler<HTMLElement, TauriDragEvent>;
  onDragDrop?: JSX.EventHandler<HTMLElement, TauriDragEvent>;
  onDragLeave?: JSX.EventHandler<HTMLElement, TauriDragEvent>;
  onDragOver?: JSX.EventHandler<HTMLElement, TauriDragEvent>;
}

export async function createTauriDragEventListener<
  T extends TauriDragEventProps,
>(
  tauriEvent: EventName,
  props: T,
  ref: HTMLElement | undefined,
  callback?: () => void,
) {
  return await listen<DragPayload>(tauriEvent, (event) => {
    // 合成事件以匹配预期的签名
    let targetEvt: TauriDragEvent = Object.assign(new CustomEvent(tauriEvent), {
      id: event.id,
      payload: event.payload,
    });

    // 保护 currentTarget 和 target 不被修改
    Object.defineProperty(targetEvt, "currentTarget", {
      value: ref,
      writable: false,
      configurable: true,
      enumerable: true,
    });
    Object.defineProperty(targetEvt, "target", {
      value: ref,
      writable: false,
      configurable: true,
      enumerable: true,
    });

    // 将事件分发到 ref 元素上
    ref?.dispatchEvent(targetEvt);
  });
}

/**
 * 计算两个矩形是否重叠
 */
export function isOverlap(
  rectA: { x: number; y: number; width: number; height: number },
  rectB: { x: number; y: number; width: number; height: number },
): boolean {
  return !(
    rectA.x + rectA.width < rectB.x ||
    rectB.x + rectB.width < rectA.x ||
    rectA.y + rectA.height < rectB.y ||
    rectB.y + rectB.height < rectA.y
  );
}

/**
 * 判断点是否在矩形内
 */
export function isPointInRect(
  point: { x: number; y: number },
  rect: { x: number; y: number; width: number; height: number },
): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}
