import type { IConfig, Message, MessageHandler } from "./message";
export declare const parentTaskMap: Map<string, MessageHandler<any>>;
/**
 * connect iframe window config
 */
export interface IConnectIframeConfig extends IConfig {
    /**
     * iframe dom element
     */
    iframe?: HTMLIFrameElement;
    /**
     * callback
     */
    callback?: (message: MessageEvent<Message>) => void;
}
/**
 * connect iframe to post message
 * @param c iframe config
 */
export declare const useConnectIframe: (c: IConnectIframeConfig) => {
    postMessage: <T = any>(type: string, data?: T | undefined) => void;
    listenMessage: () => void;
    unListenMessage: () => void;
    replyPromiseMessage: <T_1 = any>(message: Message<T_1>) => void;
};
