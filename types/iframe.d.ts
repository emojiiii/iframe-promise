import type { IConfig } from "./message";
/**
 * connect parent window
 * @param c iframe config
 * @returns
 */
export declare const useConnectParent: (c: IConfig) => {
    addlistenerMessage: () => void;
    removeListenerMessage: () => void;
    postMessage: (type: string, ...args: any[]) => {
        uid: string;
        type: string;
    };
    postPromiseMessage: <T = any>(type: string, data?: T | undefined) => Promise<unknown>;
};
