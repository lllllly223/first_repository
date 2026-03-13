import { ref } from 'vue'

let ws = null
const isConnected = ref(false)

export const useWebSocket = () => {
  // 获取WebSocket地址
  const getWebSocketUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${window.location.host}/ws`
  }

  // 连接WebSocket
  const connect = (callbacks = {}) => {
    return new Promise((resolve, reject) => {
      try {
        ws = new WebSocket(getWebSocketUrl())

        ws.onopen = () => {
          isConnected.value = true
          callbacks.onOpen?.()
          resolve()
        }

        ws.onmessage = (event) => {
          callbacks.onMessage?.(event.data)
        }

        ws.onerror = (error) => {
          callbacks.onError?.(error)
          reject(error)
        }

        ws.onclose = () => {
          isConnected.value = false
          callbacks.onClose?.()
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  // 断开连接
  const disconnect = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close()
    }
    ws = null
    isConnected.value = false
  }

  // 发送消息
  const sendMessage = (data) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      if (typeof data === 'object') {
        ws.send(JSON.stringify(data))
      } else {
        ws.send(data)
      }
      return true
    }
    return false
  }

  // 检查是否连接
  const isOpen = () => {
    return ws && ws.readyState === WebSocket.OPEN
  }

  return {
    connect,
    disconnect,
    sendMessage,
    isOpen,
    isConnected
  }
}