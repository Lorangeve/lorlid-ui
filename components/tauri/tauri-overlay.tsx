import {
  onCleanup,
  onMount,
  splitProps,
  createSignal,
  type Component,
} from "solid-js";
import { Dynamic } from "solid-js/web";
import {
  createTauriDragEventListener,
  DRAG_EVENTS,
  isPointInRect,
  type TauriDragEvent,
  type TauriDragEventProps,
  type DragOnElementStatus,
} from "./utils/dragevent";

export interface TauriOverlayProps extends TauriDragEventProps {}

export const TauriOverlay: Component<TauriOverlayProps> = (props) => {
  let ref: HTMLDivElement | undefined;
  const [local, other] = splitProps(props, [
    "onDragEnter",
    "onDragDrop",
    "onDragLeave",
    "onDragOver",
  ]);

  const [isInRect, setIsInRect] = createSignal(false);
  createSignal<DragOnElementStatus>();

  function dragHandler(e: Event) {
    const dragEvent = e as unknown as TauriDragEvent;
    switch (dragEvent.type) {
      case "tauri://drag-enter":
        if (!ref) local.onDragEnter?.(dragEvent as any);
        break;
      case "tauri://drag-drop":
        if (!ref) local.onDragDrop?.(dragEvent as any);
        else if (isInRect()) local.onDragDrop?.(dragEvent as any);
        break;
      case "tauri://drag-leave":
        if (ref) local.onDragLeave?.(dragEvent as any);
        break;
      case "tauri://drag-over":
        const position = dragEvent?.payload?.position ?? { x: -1, y: -1 };
        if (ref)
          setIsInRect((prev) => {
            const now = isPointInRect(position, ref!.getBoundingClientRect());

            if (!prev && now) local.onDragEnter?.(dragEvent as any);
            else if (prev && !now) local.onDragOver?.(dragEvent as any);
            else if (prev && now) local.onDragLeave?.(dragEvent as any);

            return now;
          });
        else local.onDragOver?.(dragEvent as any);
        break;
    }
  }

  let unlistens: Array<() => void> = [];
  onMount(async () => {
    for (const event_name of DRAG_EVENTS) {
      await createTauriDragEventListener(event_name, local, ref);
      ref?.addEventListener(event_name, dragHandler as EventListener);
    }
  });
  onCleanup(() => {
    for (const unlisten of unlistens) unlisten();
    for (const event_name of DRAG_EVENTS)
      ref?.removeEventListener(event_name, dragHandler as EventListener);
  });

  return (
    <Dynamic
      class="lo-tauri-overlay"
      ref={(el) => (ref = el as HTMLDivElement)}
      component={"div"}
      {...other}
    ></Dynamic>
  );
};
