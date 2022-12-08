import { IConfig, Message, MessageHandler } from "./message"

export const parentTaskMap = new Map<string, MessageHandler>()

/**
 * connect iframe window config
 */
export interface IConnectIframeConfig<T> extends IConfig {
    /**
     * iframe dom element
     */
    iframe?: HTMLIFrameElement
    /**
     * callback 
     */
    callback?: (message: Message<T>) => void
}

/**
 * connect iframe to post message
 * @param c iframe config
 */
export const useConnectIframe = <T = string>(c?: IConnectIframeConfig<T>) => {

    const config: IConnectIframeConfig<T> = {
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
    const postMessage = <T = Record<string, any>>(type: string, data?: T) => {
        parent.postMessage({
            type,
            ...data,
        }, "*")
    }

    /**
     * reply promise message to iframe
     * @param type 
     * @param data 
     * @returns 
     */
    const reply = <T = Record<string, any>>(uid: string, data?: T) => {
        parent.postMessage({
            uid,
            ...data
        })
    }

    /**
     * 收到消息后，根据消息类型区分要做的动作
     * 1. 普通消息不管
     * 2. promise消息, reply 需要带上uid 
     */
    const handleMessage = (event: MessageEvent<Message<T>>) => {
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
        reply,
    }
}