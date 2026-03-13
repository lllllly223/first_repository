<template>
  <div class="sidebar-left" :style="styles.sidebar">
    <div class="sidebar-section">
      <div class="sidebar-title">检测设置</div>

      <div class="control-group">
        <label for="modelSelect" class="control-label">选择YOLO模型</label>
        <select
          id="modelSelect"
          v-model="config.model"
          @change="onConfigChange"
          class="control-select"
        >
          <option value="yolov8n">YOLOv8n</option>
        </select>
      </div>

      <div class="control-group">
        <label class="control-label">
          置信度阈值: <span>{{ config.confidence }}</span>
        </label>
        <input
          type="range"
          v-model="config.confidence"
          @input="onConfigChange"
          min="0.1"
          max="0.9"
          step="0.1"
          class="control-range"
        >
      </div>

      <div class="control-group">
        <label class="control-label">
          目标FPS: <span>{{ config.targetFps }}</span>
        </label>
        <input
          type="range"
          v-model="config.targetFps"
          @input="onConfigChange"
          min="5"
          max="30"
          step="5"
          class="control-range"
        >
      </div>
    </div>

    <div class="sidebar-section">
      <div class="sidebar-title">显示选项</div>
      <div class="checkbox-group">
        <div class="checkbox-item" v-for="option in displayOptions" :key="option.id">
          <input
            type="checkbox"
            :id="option.id"
            v-model="config[option.id]"
            @change="onDisplayChange(option.id)"
          >
          <label :for="option.id">{{ option.label }}</label>
        </div>
      </div>
    </div>

    <div class="btn-group">
      <button
        @click="$emit('start')"
        :disabled="isConnected"
        class="btn btn-primary"
      >
        开始监控
      </button>
      <button
        @click="$emit('stop')"
        :disabled="!isConnected"
        class="btn btn-danger"
      >
        停止监控
      </button>
      <button
        @click="$emit('dataPage')"
        :disabled="isConnected"
        class="btn btn-dataPage"
      >
        查看数据历史
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits } from 'vue'

const props = defineProps({
  isConnected: Boolean
})

const emit = defineEmits(['start', 'stop', 'config-change'])

// 配置对象
const config = reactive({
  model: 'yolov8n',
  confidence: 0.5,
  targetFps: 15,
  showBBox: true,
  showLabels: true,
  showConfidence: true,
  showFPS: false
})

// 显示选项
const displayOptions = [
  { id: 'showBBox', label: '显示检测框' },
  { id: 'showLabels', label: '显示标签' },
  { id: 'showConfidence', label: '显示置信度' },
  { id: 'showFPS', label: '显示FPS计数' }
]

// 样式
const styles = {
  sidebar: {
    width: '250px',
    background: 'linear-gradient(to bottom, #2c3e50, #34495e)',
    color: 'white',
    padding: '20px',
    overflowY: 'auto',
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
  }
}

// 配置改变事件
const onConfigChange = () => {
  emit('config-change', {
    type: 'config',
    ...config
  })
}

// 显示选项改变
const onDisplayChange = (option) => {
  emit('config-change', {
    type: 'display',
    [option]: config[option]
  })
}
</script>