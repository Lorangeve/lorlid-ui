import { onCleanup, onMount, splitProps, type Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import {
  createTauriDragEventListener,
  type TauriDragEventProps,
} from "./utils/dragevent";

export interface TauriOverlayProps extends TauriDragEventProps {}

export const TauriOverlay: Component<TauriOverlayProps> = (props) => {
  let ref;
  const [local, other] = splitProps(props, [
    "onDragEnter",
    "onDragDrop",
    "onDragLeave",
    "onDragOver",
  ]);

  let unlistens: Array<() => void> = [];
  onMount(async () => {
    unlistens.push(
      await createTauriDragEventListener("tauri://drag-enter", local, ref),
    );
    unlistens.push(
      await createTauriDragEventListener("tauri://drag-drop", local, ref),
    );
    unlistens.push(
      await createTauriDragEventListener("tauri://drag-leave", local, ref),
    );
    unlistens.push(
      await createTauriDragEventListener("tauri://drag-over", local, ref),
    );
  });
  onCleanup(() => {
    for (const unlisten of unlistens) unlisten();
  });

  return <Dynamic ref={ref} component={"div"} {...other}></Dynamic>;
};
