export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

export class TraceLogger {
  private static level: LogLevel = LogLevel.DEBUG; // 默认开发阶段全开
  private static indentLevel = 0;

  // 用于对接 VS Code 的 Connection Console (如果在 LSP 环境下)
  private static remoteConsole: { log: (msg: string) => void } | null = null;

  // 绑定 LSP 的 Console
  public static setRemoteConsole(console: any) {
    this.remoteConsole = console;
  }

  public static setLevel(level: LogLevel) {
    this.level = level;
  }

  private static getIndent(): string {
    return "  ".repeat(this.indentLevel);
  }

  private static write(prefix: string, message: string) {
    const output = `${this.getIndent()}${prefix} ${message}`;

    // 测试环境下输出到终端
    console.log(output);

    // LSP 插件环境下输出到 VS Code 的 Output 面板
    if (this.remoteConsole) {
      this.remoteConsole.log(output);
    }
  }

  // 🚀 核心追踪 API
  public static enterRule(ruleName: string) {
    if (this.level <= LogLevel.DEBUG) {
      this.write("➡️", `[Enter] ${ruleName}`);
      this.indentLevel++;
    }
  }

  public static exitRule(ruleName: string) {
    if (this.level <= LogLevel.DEBUG) {
      this.indentLevel = Math.max(0, this.indentLevel - 1);
      this.write("⬅️", `[Exit]  ${ruleName}`);
    }
  }

  public static consume(tokenName: string, image: string) {
    if (this.level <= LogLevel.DEBUG) {
      this.write("✅", `[Consume] ${tokenName} ("${image}")`);
    }
  }

  public static fail(message: string) {
    if (this.level <= LogLevel.ERROR) {
      this.write("❌", `[ERROR] ${message}`);
    }
  }
}