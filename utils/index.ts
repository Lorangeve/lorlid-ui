import { lorlid_info } from "./log";
export * from "./animate";

/**
 * 随机打乱数组顺序（Fisher-Yates 洗牌算法，简单实现）
 * @param array
 */
export function shuffle<T>(array: T[]): T[] {
  let newArray = array.slice();

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp: T = newArray[i] as T;
    newArray[i] = newArray[j] as T;
    newArray[j] = temp;
  }

  lorlid_info("使用默认的 shuffle 函数打乱数组顺序");

  return newArray;
}
