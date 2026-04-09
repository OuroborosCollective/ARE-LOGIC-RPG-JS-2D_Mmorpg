<template>
  <div class="mobile-actions" v-if="isMobile">
    <div class="action-bar">
      <button @click="action('combat')" class="action-btn"><span class="btn-icon">&#x2694;&#xFE0F;</span><span class="btn-label">Fight</span></button>
      <button @click="action('craft')" class="action-btn"><span class="btn-icon">&#x1F6E0;&#xFE0F;</span><span class="btn-label">Craft</span></button>
      <button @click="action('trade')" class="action-btn"><span class="btn-icon">&#x1F4B0;</span><span class="btn-label">Trade</span></button>
      <button @click="action('skill')" class="action-btn"><span class="btn-icon">&#x1F9EC;</span><span class="btn-label">Skill</span></button>
      <button @click="action('build')" class="action-btn"><span class="btn-icon">&#x1F3D7;&#xFE0F;</span><span class="btn-label">Build</span></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'rpg-mobile-actions',
  inject: ['rpgSocket'],
  data() {
    return {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || ('ontouchstart' in window)
        || (navigator.maxTouchPoints > 0)
    }
  },
  methods: {
    action(type) {
      this.rpgSocket().emit('player.input', { action: type });
    }
  }
}
</script>

<style scoped>
.mobile-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 900;
  pointer-events: none;
  padding: 0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}

.action-bar {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.0));
  pointer-events: auto;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 56px;
  padding: 8px 6px 6px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(20, 20, 40, 0.75);
  color: white;
  cursor: pointer;
  backdrop-filter: blur(4px);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.action-btn:active {
  transform: scale(0.92);
  background: rgba(255, 215, 0, 0.2);
  border-color: rgba(255, 215, 0, 0.4);
}

.btn-icon {
  font-size: 22px;
  line-height: 1;
}

.btn-label {
  font-size: 9px;
  opacity: 0.7;
  font-family: "Fredoka", sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (min-width: 1024px) {
  .mobile-actions { display: none; }
}

@media (max-width: 380px) {
  .action-btn { min-width: 48px; padding: 6px 4px 4px; }
  .btn-icon { font-size: 18px; }
}
</style>
