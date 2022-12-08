export interface Message<T = string, D = any> {
    /**
     * message type
     */
    type: T;
    /**
     * message data
     */
    data: D;
    /**
     * message id
     */
    uid: string;
    /**
     * message action
     */
    action: REQUEST_ACTION;
}
/**
 * request action
 */
export declare enum REQUEST_ACTION {
    NORMAL = "normal",
    PROMISE = "promise",
    LISTEN = "listen",
    UNLISTEN = "unlisten"
}
export interface MessageHandler<T = string, D = any> {
    (message: Message<T>['data']): void;
    action: REQUEST_ACTION;
    type: D;
    uid: string;
}
/**
 * iframe config
 */
export interface IConfig {
    /**
     * timeout for message unit second
     * @default 5
     */
    timeout?: number;
}
