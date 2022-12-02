export interface Message<T = any> {
    /**
     * message type
     */
    type: string;
    /**
     * message data
     */
    data: T,
    /**
     * message id
     */
    uid: string;
    /**
     * is promise message
     */
    isPromise?: boolean;
}

export interface MessageHandler<T = any> {
    (message: Message<T>['data']): void
}

/**
 * iframe config
 */
 export interface IConfig {
    /**
     * timeout for message unit second
     * @default 5
     */
    timeout?: number
}