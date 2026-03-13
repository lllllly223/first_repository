<template>
  <div class="sidebar-right" :style="styles.sidebar">
    <div class="sidebar-section">
      <div class="sidebar-title">系统信息</div>

      <div class="info-item">
        <div class="info-label">连接状态</div>
        <div class="info-value">{{ status }}</div>
      </div>

      <div class="info-item">
        <div class="info-label">当前FPS</div>
        <div class="info-value">{{ fps }}</div>
      </div>

      <div class="info-item">
        <div class="info-label">检测延迟</div>
        <div class="info-value">{{ latency }} ms</div>
      </div>

      <div class="info-item">
        <div class="info-label">当前模型</div>
        <div class="info-value">{{ model }}</div>
      </div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-title">检测统计</div>

      <div class="info-item">
        <div class="info-label">检测到的对象</div>
        <div class="info-value">{{ detectionCount }}</div>
      </div>

      <div class="info-item">
        <div class="info-label">最近检测类别</div>
        <div class="info-value">{{ lastClasses }}</div>
      </div>

      <div class="info-item">
        <div class="info-label">平均置信度</div>
        <div class="info-value">{{ avgConfidence.toFixed(2) }}</div>
      </div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-title">事件日志</div>
      <div class="log-container" :style="styles.logContainer">
        <div
          v-for="(log, index) in logs"
          :key="index"
          class="log-entry"
        >
          <span class="log-timestamp">[{{ log.timestamp }}]</span>
          <span><strong>{{ log.type }}:</strong> {{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: '未连接'
  },
  fps: {
    type: Number,
    default: 0
  },
  latency: {
    type: Number,
    default: 0
  },
  model: {
    type: String,
    default: 'YOLOv8n'
  },
  detectionCount: {
    type: Number,
    default: 0
  },
  lastClasses: {
    type: String,
    default: '无'
  },
  avgConfidence: {
    type: Number,
    default: 0
  },
  logs: {
    type: Array,
    default: () => []
  }
})

// 样式
const styles = {
  sidebar: {
    width: '280px',
    background: 'linear-gradient(to bottom, #34495e, #2c3e50)',
    color: 'white',
    padding: '20px',
    overflowY: 'auto',
    boxShadow: '-2px 0 5px rgba(0,0,0,0.1)'
  },
  logContainer: {
    maxHeight: '200px',
    overflowY: 'auto'
  }
}

// 监听日志变化，自动滚动到底部
watch(() => props.logs.length, () => {
  const container = document.querySelector('.log-container')
  if (container) {
    setTimeout(() => {
      container.scrollTop = container.scrollHeight
    }, 100)
  }
})
</script>