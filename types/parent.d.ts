import { IConfig, Message, MessageHandler } from "./message";
export declare const parentTaskMap: Map<string, MessageHandler<string, any>>;
/**
 * connect iframe window config
 */
export interface IConnectIframeConfig<T> extends IConfig {
    /**
     * iframe dom element
     */
    iframe?: HTMLIFrameElement;
    /**
     * callback
     */
    callback?: (message: Message<T>) => void;
}
/**
 * connect iframe to post message
 * @param c iframe config
 */
export declare const useConnectIframe: <T = string>(c: IConnectIframeConfig<T>) => {
    postMessage: <T_1 = Record<string, any>>(type: string, data?: T_1 | undefined) => void;
    listenMessage: () => void;
    unListenMessage: () => void;
    reply: <T_2 = Record<string, any>>(uid: string, data?: T_2 | undefined) => void;
};
