<template>
  <div class="app-container">
    <SidebarLeft
      :is-connected="isConnected"
      @start="startConnection"
      @stop="stopConnection"
      @config-change="handleConfigChange"
    />

    <VideoContainer
      :video-src="videoSrc"
      :status-text="statusText"
    />

    <SidebarRight
      :status="statusText"
      :fps="fps"
      :latency="latency"
      :model="model"
      :detection-count="detectionCount"
      :last-classes="lastClasses"
      :avg-confidence="avgConfidence"
      :logs="logs"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import SidebarLeft from './components/SidebarLeft.vue'
import SidebarRight from './components/SidebarRight.vue'
import VideoContainer from './components/VideoContainer.vue'
import { useWebSocket } from './utils/websocket.js'

// 响应式数据
const isConnected = ref(false)
const videoSrc = ref('')
const statusText = ref('未连接')
const fps = ref(0)
const latency = ref(0)
const model = ref('YOLOv8n')
const detectionCount = ref(0)
const lastClasses = ref('无')
const avgConfidence = ref(0)
const logs = ref([])

// WebSocket工具
const { connect, disconnect, sendMessage, isOpen } = useWebSocket()

// 帧率计算
let frameCount = 0
let lastFpsUpdate = Date.now()

// 添加日志
const addLog = (type, message) => {
  const timestamp = new Date().toLocaleTimeString()
  logs.value.push({
    timestamp,
    type,
    message
  })

  // 限制日志数量
  if (logs.value.length > 20) {
    logs.value.shift()
  }
}

// 开始连接
const startConnection = async () => {
  try {
    statusText.value = '连接中...'
    addLog('连接', '正在连接到服务器...')

    await connect({
      onOpen: () => {
        isConnected.value = true
        statusText.value = '已连接'
        addLog('连接', 'WebSocket连接成功')
      },
      onMessage: handleWebSocketMessage,
      onError: (error) => {
        statusText.value = '连接错误'
        addLog('错误', `WebSocket错误: ${error}`)
        isConnected.value = false
      },
      onClose: () => {
        statusText.value = '连接已断开'
        addLog('连接', 'WebSocket连接已关闭')
        isConnected.value = false
        cleanupVideoSrc()
      }
    })
  } catch (error) {
    addLog('错误', `连接失败: ${error.message}`)
    statusText.value = '连接失败'
  }
}

// 停止连接
const stopConnection = () => {
  disconnect()
  cleanupVideoSrc()
  isConnected.value = false
  statusText.value = '已停止'
  addLog('连接', '用户手动停止监控')
}

// 处理WebSocket消息
const handleWebSocketMessage = (data) => {
  // 处理JSON消息
  if (typeof data === 'string') {
    try {
      const jsonData = JSON.parse(data)
      if (jsonData.type === 'detection_result') {
        updateDetectionData(jsonData)
      } else if (jsonData.message === 'SERVER_READY') {
        addLog('服务器', '服务器就绪，开始传输画面')
      }
      return
    } catch (e) {
      // 不是JSON，继续处理
    }
  }

  // 处理图像数据
  processImageData(data)

  // 更新FPS
  updateFps()
}

// 更新检测数据
const updateDetectionData = (data) => {
  detectionCount.value = data.objects || 0
  lastClasses.value = data.classes || '无'
  avgConfidence.value = data.avg_confidence || 0
  latency.value = data.latency || 0
}

// 处理图像数据
const processImageData = (imageData) => {
  const blob = new Blob([imageData], { type: 'image/jpeg' })
  const blobUrl = URL.createObjectURL(blob)

  // 清理之前的Blob URL
  cleanupVideoSrc()

  videoSrc.value = blobUrl
}

// 清理视频源
const cleanupVideoSrc = () => {
  if (videoSrc.value && videoSrc.value.startsWith('blob:')) {
    URL.revokeObjectURL(videoSrc.value)
  }
  videoSrc.value = ''
}

// 更新FPS
const updateFps = () => {
  frameCount++
  const now = Date.now()
  if (now - lastFpsUpdate >= 1000) {
    fps.value = Math.round((frameCount * 1000) / (now - lastFpsUpdate))
    frameCount = 0
    lastFpsUpdate = now
  }
}

// 处理配置变更
const handleConfigChange = (config) => {
  if (isOpen()) {
    sendMessage(config)
    addLog('设置', `配置更新: ${JSON.stringify(config)}`)
  }
}

// 页面加载完成
onMounted(() => {
  addLog('系统', '监控控制台加载完成')
})

// 页面卸载前清理
onBeforeUnmount(() => {
  cleanupVideoSrc()
  if (isOpen()) {
    disconnect()
  }
})
</script>