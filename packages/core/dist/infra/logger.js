export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["NONE"] = 4] = "NONE";
})(LogLevel || (LogLevel = {}));
export class TraceLogger {
    static level = LogLevel.DEBUG; // 默认开发阶段全开
    static indentLevel = 0;
    // 用于对接 VS Code 的 Connection Console (如果在 LSP 环境下)
    static remoteConsole = null;
    // 绑定 LSP 的 Console
    static setRemoteConsole(console) {
        this.remoteConsole = console;
    }
    static setLevel(level) {
        this.level = level;
    }
    static getIndent() {
        return "  ".repeat(this.indentLevel);
    }
    static write(prefix, message) {
        const output = `${this.getIndent()}${prefix} ${message}`;
        // 测试环境下输出到终端
        console.log(output);
        // LSP 插件环境下输出到 VS Code 的 Output 面板
        if (this.remoteConsole) {
            this.remoteConsole.log(output);
        }
    }
    // 🚀 核心追踪 API
    static enterRule(ruleName) {
        if (this.level <= LogLevel.DEBUG) {
            this.write("➡️", `[Enter] ${ruleName}`);
            this.indentLevel++;
        }
    }
    static exitRule(ruleName) {
        if (this.level <= LogLevel.DEBUG) {
            this.indentLevel = Math.max(0, this.indentLevel - 1);
            this.write("⬅️", `[Exit]  ${ruleName}`);
        }
    }
    static consume(tokenName, image) {
        if (this.level <= LogLevel.DEBUG) {
            this.write("✅", `[Consume] ${tokenName} ("${image}")`);
        }
    }
    static fail(message) {
        if (this.level <= LogLevel.ERROR) {
            this.write("❌", `[ERROR] ${message}`);
        }
    }
}
//# sourceMappingURL=logger.js.map