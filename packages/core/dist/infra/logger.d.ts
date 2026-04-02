export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4
}
export declare class TraceLogger {
    private static level;
    private static indentLevel;
    private static remoteConsole;
    static setRemoteConsole(console: any): void;
    static setLevel(level: LogLevel): void;
    private static getIndent;
    private static write;
    static enterRule(ruleName: string): void;
    static exitRule(ruleName: string): void;
    static consume(tokenName: string, image: string): void;
    static fail(message: string): void;
}
//# sourceMappingURL=logger.d.ts.map