import type { IConfig, Message, MessageHandler } from "./message"
import { getUID } from "./utils"

export const parentTaskMap = new Map<string, MessageHandler>()

/**
 * connect iframe window config
 */
export interface IConnectIframeConfig extends IConfig {
    /**
     * iframe dom element
     */
    iframe?: HTMLIFrameElement
    /**
     * callback 
     */
     callback?: (message: Message) => void
}

/**
 * connect iframe to post message
 * @param c iframe config
 */
export const useConnectIframe = (c: IConnectIframeConfig) => {

    const config: IConnectIframeConfig = {
        timeout: 5000
    }

    Object.assign(config, c)

    if (!config.iframe) {
        throw new Error('iframe is required')
    }

    /**
     * iframe window
     */
    const parent = config.iframe.contentWindow!

    /**
     * send message to iframe
     * @param type 
     * @param data 
     */
    const postMessage = <T = any>(type: string, data: T) => {
        parent.postMessage({
            type,
            data,
        })
    }

    /**
     * reply message to iframe
     * @param type 
     * @param data 
     * @returns 
     */
    const replyPromiseMessage = <T = any>(message: Message<T>) => {
        window.parent.postMessage(message)
    }

    /**
     * handle message from iframe
     */
    const handleMessage = (event: MessageEvent<Message>) => {
        config.callback?.(event.data)
    }

    /**
     * listen message from parent window
     */
    const listenMessage = () => {
        parent.addEventListener('message', handleMessage)
    }

    const unListenMessage = () => {
        parent.removeEventListener('message', handleMessage)
    }

    return {
        postMessage,
        listenMessage,
        unListenMessage,
        replyPromiseMessage,
    }
}