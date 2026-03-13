<template>
  <div class="video-container" :style="styles.container">
    <div class="header">
      <h2>抽烟行为检测系统</h2>
      <div class="status">状态: {{ statusText }}</div>
    </div>

    <div class="video-wrapper" :style="styles.videoWrapper">
      <img
        v-if="videoSrc"
        :src="videoSrc"
        alt="屏幕流将显示在这里"
        class="video-stream"
        :style="styles.video"
      />
      <div v-else class="no-video">
        等待视频流...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onBeforeUnmount } from 'vue'

const props = defineProps({
  videoSrc: String,
  statusText: {
    type: String,
    default: '未连接'
  }
})

// 样式
const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    backgroundColor: '#ecf0f1',
    overflowY: 'auto'
  },
  videoWrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    borderRadius: '8px',
    padding: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  },
  video: {
    maxWidth: '100%',
    maxHeight: '70vh',
    borderRadius: '6px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.3)'
  }
}

// 清理Blob URL
onBeforeUnmount(() => {
  if (props.videoSrc && props.videoSrc.startsWith('blob:')) {
    URL.revokeObjectURL(props.videoSrc)
  }
})
</script>

<style scoped>
.no-video {
  color: #95a5a6;
  font-size: 18px;
  text-align: center;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h2 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.status {
  color: #7f8c8d;
  font-size: 14px;
}
</style>