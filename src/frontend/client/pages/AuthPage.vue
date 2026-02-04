<template>
  <div class="auth-container">
    <div class="tabs">
      <UiButton :class="{ active: tab === 'login' }" :name="'login'" @click="tab = 'login'" />
      <LazyUiButton
        :class="{ active: tab === 'register' }"
        :name="`Регистрация`"
        @click="tab = 'register'"
      />
    </div>
    <WgAuth v-if="tab === 'login'" />
    <WgRegister v-if="tab === 'register'" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tab = ref<'login' | 'register'>('login');
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.tabs button {
  flex: 1;
}

.tabs button.active {
  background: #0070f3;
  color: white;
}
</style>
