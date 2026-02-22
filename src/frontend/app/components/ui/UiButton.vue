<template>
  <UButton
    class="ui-button"
    :color="props.color"
    :icon="props.icon"
    :label="props.name"
    :size="props.size"
    :variant="props.variant"
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
    name: string;
    icon?: string;
    color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'link' | 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost';
  }>(),
  {
    name: '',
    color: 'primary'
  }
);
</script>

<style scoped lang="scss">
.ui-button {
  &:hover {
    cursor: pointer;
  }
}
</style>
