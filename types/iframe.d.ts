import type { IConfig, Message } from "./message";
export interface IConnectParentConfig<T> extends IConfig {
    /**
     * callback
     */
    callback?: <D>(message: Message<T, D>) => void;
}
/**
 * connect parent window
 * @param c iframe config
 * @returns
 */
export declare const useConnectParent: <T = string>(c?: IConnectParentConfig<T> | undefined) => {
    addlistenerMessage: () => void;
    removeListenerMessage: () => void;
    udpRequest: (params?: Record<string, any>) => void;
    reqeust: <D = any, K = any>(type: T, data?: D | undefined) => Promise<K>;
    listenMessage: (type: string, callback?: ((message: Message) => void) | undefined) => void;
    unlistenMessage: (uid: string) => void;
};
