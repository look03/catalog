<template>
  <UButton
    class="ui-button"
    :color="props.color"
    :icon="props.icon"
    :label="props.name"
    :size="props.size"
    :variant="props.variant"
    :title="props.title"
    @click="$emit('click', $event)"
  />
</template>

<script setup lang="ts">
defineOptions({
  name: 'UiButton'
});

defineEmits<{
  click: [event: MouseEvent];
}>();

const props = withDefaults(
  defineProps<{
    name?: string;
    /** Нативная подсказка при наведении */
    title?: string;
    icon?: string;
    color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'link' | 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost';
  }>(),
  {
    name: undefined,
    title: undefined,
    icon: undefined,
    size: undefined,
    color: 'primary',
    variant: undefined
  }
);
</script>

<style scoped lang="scss">
.ui-button {
  cursor: pointer;
  &:hover {
    cursor: pointer;
  }
}
</style>
