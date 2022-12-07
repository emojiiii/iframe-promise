import type { IConfig, Message, MessageHandler } from "./message";
import { getUID } from "./utils";
import { REQUEST_ACTION } from "./message";

const taskMap = new Map<string, MessageHandler>()

export interface IConnectParentConfig<T> extends IConfig {
    /**
     * callback 
     */
    callback?: <D>(message: Message<T, D>) => void
}

/**
 * connect parent window
 * @param c iframe config
 * @returns 
 */
export const useConnectParent = <T = string>(c: IConnectParentConfig<T>) => {

    const config: IConnectParentConfig<T> = {
        timeout: 5000
    }

    Object.assign(config, c)

    /**
     * send message to parent window
     * @param type 
     * @param data 
     */
    const udpRequest = (params?: Record<string, any>) => {
        const uid = getUID()
        const action = REQUEST_ACTION.NORMAL
        window.parent.postMessage({
            uid,
            action,
            ...params
        }, "*")
    }

    /**
     * send promise message to parent window
     * @param type 
     * @param data 
     * @returns 
     */
    const reqeust = <D = any, K = any>(type: T, data?: D) => {
        return new Promise<K>((resolve, reject) => {
            const uid = getUID()
            const action = REQUEST_ACTION.PROMISE
            udpRequest({
                data,
                type,
                uid,
                action
            })

            const timeout = setTimeout(() => {
                taskMap.delete(uid)
                reject(new Error('timeout'))
            }, config.timeout)

            const handler = (data: any) => {
                clearTimeout(timeout)
                taskMap.delete(uid)
                resolve(data)
            }

            handler.action = action
            handler.uid = uid
            handler.type = type

            /**
             * set message handler by uid
             */
            taskMap.set(uid, handler)
        })
    }

    /**
     * 长链接事件, 用于监听指定类型的消息
     */
    const listenMessage = (type: string, callback?: (message: Message) => void) => {
        const uid = getUID()
        const action = REQUEST_ACTION.LISTEN
        udpRequest({
            type,
            uid,
            action
        })

        const handler = (data: any) => {
            callback?.({
                uid,
                type,
                ...data
            })
        }
        handler.action = action
        handler.uid = uid
        handler.type = type

        /**
         * set message handler by uid
         */
        taskMap.set(uid, handler)
        return uid
    }

    /**
     * 关闭指定的长链接任务
     * @param uid 任务ID
     */
    const unlistenMessage = (uid: string) => {
        const action = REQUEST_ACTION.UNLISTEN
        const handler = taskMap.get(uid)

        if (handler) {
            udpRequest({
                uid,
                type: handler.type,
                action
            })
            taskMap.delete(uid)
        }
        
    }

    const handleMessage = (evt: MessageEvent<Message<T>>) => {
        const { data, uid } = evt.data

        const handler = taskMap.get(uid)

        if (handler) {
            const {action} = handler

            if (action === REQUEST_ACTION.PROMISE || action === REQUEST_ACTION.LISTEN) {
                /**
                 * promise response not need uid and type
                 */
                return handler(data)
            }
        }
        /**
         * if not match any handler, then call callback
         */
        config.callback?.(evt.data)
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
        udpRequest,
        reqeust,
        listenMessage,
        unlistenMessage
    }
}