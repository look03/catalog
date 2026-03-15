<template>
  <div class="ui-field">
    <UiFieldLabel v-if="label" :label="label" :required="required" />
    <UPopover
      v-model:open="isOpen"
      mode="click"
      :dismissible="false"
      :content="{ align: 'start' }"
      :ui="{ content: 'w-[var(--reka-popper-anchor-width)]' }"
    >
      <UButton
        variant="outline"
        block
        :class="{ 'text-left justify-start': true }"
        color="neutral"
        trailing-icon="i-lucide-chevron-down"
      >
        {{ displayText }}
      </UButton>
      <template #content>
        <div class="w-full max-h-80 overflow-y-auto p-1">
          <UTree
            v-model:expanded="expandedKeys"
            :items="treeItems"
            :multiple="props.multiple"
            :get-key="(item: TreeItemWithId) => String(item.id)"
          />
        </div>
        <div v-if="props.multiple" class="mt-2 pt-2 border-t border-default">
          <UButton
            variant="soft"
            block
            size="sm"
            label="Готово"
            @click="isOpen = false"
          />
        </div>
      </template>
    </UPopover>
  </div>
</template>

<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui';

type TreeItemWithId = TreeItem & { id: number };

defineOptions({ name: 'UiSectionTreeSelect', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    modelValue?: number | number[];
    label?: string;
    required?: boolean;
    placeholder?: string;
    multiple?: boolean;
    items?: { id: number; name: string; title?: string; parentSectionId?: number | null }[];
    excludeId?: number;
    /** Показывать пункт «Без родителя» (только для формы раздела) */
    showNoParent?: boolean;
  }>(),
  {
    label: undefined,
    required: false,
    placeholder: 'Выберите раздел',
    multiple: false,
    items: () => [],
    excludeId: undefined,
    showNoParent: true
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | number[]): void;
}>();

const isOpen = ref(false);
const toggleJustFired = ref(false);
const expandedKeys = ref<string[]>([]);

function collectExpandableKeys(items: TreeItemWithId[]): string[] {
  const keys: string[] = [];
  for (const item of items) {
    if (item.children?.length) {
      keys.push(String(item.id));
      keys.push(...collectExpandableKeys(item.children as TreeItemWithId[]));
    }
  }
  return keys;
}

function hasChildren(id: number): boolean {
  return props.items?.some((i) => i.parentSectionId === id) ?? false;
}

const displayText = computed(() => {
  if (props.multiple) {
    const ids = props.modelValue as number[] | undefined;
    if (!ids?.length) return props.placeholder;
    return ids
      .map((id) => {
        if (id === 0) return '— Без родителя';
        const item = props.items?.find((i) => i.id === id);
        return item?.title ?? item?.name ?? String(id);
      })
      .join(', ');
  }
  if (props.modelValue === undefined || props.modelValue === null) {
    return props.placeholder;
  }
  if (props.modelValue === 0) {
    return '— Без родителя';
  }
  const item = props.items.find((i) => i.id === props.modelValue);
  return item?.title ?? item?.name ?? props.placeholder;
});

function buildTree(
  items: typeof props.items,
  parentId: number | null,
  excludeId: number | undefined,
  selectHandler: (id: number) => void
): TreeItemWithId[] {
  const filtered = items.filter(
    (s) =>
      (s.parentSectionId ?? null) === parentId &&
      (excludeId === undefined || s.id !== excludeId)
  );
  filtered.sort((a, b) => (a.title ?? a.name).localeCompare(b.title ?? b.name));

  const result: TreeItemWithId[] = [];
  for (const s of filtered) {
    const children = buildTree(items, s.id, excludeId, selectHandler);
    const hasChildren = children.length > 0;
    result.push({
      id: s.id,
      label: s.title ?? s.name,
      defaultExpanded: true,
      onToggle: () => {
        toggleJustFired.value = true;
        nextTick(() => {
          toggleJustFired.value = false;
        });
      },
      onSelect: () => {
        if (toggleJustFired.value) return;
        selectHandler(s.id);
      },
      ...(hasChildren ? { children } : {})
    });
  }
  return result;
}

function handleSelect(id: number) {
  if (props.multiple) {
    const current = (props.modelValue as number[]) ?? [];
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    emit('update:modelValue', next);
  } else {
    emit('update:modelValue', id);
    isOpen.value = false;
  }
}

/** Обёртка: при клике по метке (не по стрелке) восстанавливаем раскрытие узла с потомками */
function createSelectHandler(): (id: number) => void {
  return (id: number) => {
    if (!toggleJustFired.value && hasChildren(id)) {
      nextTick(() => {
        expandedKeys.value = [...new Set([...expandedKeys.value, String(id)])];
      });
    }
    handleSelect(id);
  };
}

const treeItems = computed(() => {
  const sections = buildTree(props.items, null, props.excludeId, createSelectHandler());
  if (!props.showNoParent) return sections;
  const noParent: TreeItemWithId = {
    id: 0,
    label: '— Без родителя',
    onToggle: () => {
      toggleJustFired.value = true;
      nextTick(() => {
        toggleJustFired.value = false;
      });
    },
    onSelect: () => {
      if (toggleJustFired.value) return;
      handleSelect(0);
    }
  };
  return [noParent, ...sections];
});

watch(
  () => [isOpen.value, treeItems.value] as const,
  () => {
    if (isOpen.value && treeItems.value.length) {
      expandedKeys.value = collectExpandableKeys(treeItems.value);
      if (props.showNoParent) {
        expandedKeys.value = ['0', ...expandedKeys.value];
      }
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.ui-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
