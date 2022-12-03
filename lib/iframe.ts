import type { IConfig, Message, MessageHandler } from "./message";
import { getUID } from "./utils";

const taskMap = new Map<string, MessageHandler>()

/**
 * connect parent window
 * @param c iframe config
 * @returns 
 */
export const useConnectParent = (c: IConfig) => {

    const config: IConfig = {
        timeout: 5000
    }

    Object.assign(config, c)

    /**
     * send message to parent window
     * @param type 
     * @param data 
     */
    const postMessage = (type: string, ...args: any[]) => {
        const uid = getUID()
        window.parent.postMessage({
            type,
            uid,
            ...args
        }, "*")
        return {
            uid,
            type
        }
    }

    /**
     * send promise message to parent window
     * @param type 
     * @param data 
     * @returns 
     */
    const postPromiseMessage = <T = any>(type: string, data?: T) => {
        return new Promise((resolve, reject) => {
            const {uid} = postMessage(type, {
                data,
                isPromise: true
            })
            
            const timeout = setTimeout(() => {
                taskMap.delete(uid)
                reject(new Error('timeout'))
            }, config.timeout)

            /**
             * set message handler by uid
             */
            taskMap.set(uid, (data: any) => {
                clearTimeout(timeout)
                taskMap.delete(uid)
                resolve(data)
            })
        })
    }

    const handleMessage = (evt: MessageEvent<Message>) => {
        const { data, type, uid } = evt.data
        if (taskMap.has(uid)) {
            taskMap.get(uid)?.({
                type,
                data
            })
        } else {
            // handle message
        }
    }

    const addlistenerMessage = () => {
        window.addEventListener('message', handleMessage)
    }

    const removeListenerMessage = () => {
        window.addEventListener('message', handleMessage)
    }

    return {
        addlistenerMessage,
        removeListenerMessage,
        postMessage,
        postPromiseMessage
    }
}