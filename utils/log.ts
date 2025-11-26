// 信息型（你提供的基础款）
const infoStyle = "background:#41b883;color:#fff;border-radius: 3px";

// 成功型
const successStyle = "background:#52c41a;color:#fff;border-radius: 3px";

// 警告型
const warningStyle = "background:#faad14;color:#fff;border-radius: 3px";

// 错误/危险型
const errorStyle = "background:#f5222d;color:#fff;border-radius: 3px";

// 次要/默认型
const defaultStyle = "background:#8c8c8c;color:#fff;border-radius: 3px";

// 链接/强调型
const linkStyle = "background:#1890ff;color:#fff;border-radius: 3px";

type MsgType = "info" | "success" | "warning" | "error" | "default" | "link";

export function lorlid_log(msgType: MsgType, ...msg: string[]) {
  switch (msgType) {
    case "info":
      console.log("%c[lorlid]", infoStyle, ...msg);
      break;
    case "success":
      console.log("%c[lorlid]", successStyle, ...msg);
      break;
    case "warning":
      console.log("%c[lorlid]", warningStyle, ...msg);
      break;
    case "error":
      console.log("%c[lorlid]", errorStyle, ...msg);
      break;
    case "default":
      console.log("%c[lorlid]", defaultStyle, ...msg);
      break;
    case "link":
      console.log("%c[lorlid]", linkStyle, ...msg);
      break;
  }
}

export function lorlid_info(...msg: string[]) {
  lorlid_log("info", ...msg);
}

export function lorlid_warning(...msg: string[]) {
  lorlid_log("warning", ...msg);
}

export function lorlid_error(...msg: string[]) {
  lorlid_log("error", ...msg);
}
