<template>
  <div class="mega-menu">
    <div class="mega-menu__cols">
      <aside class="mega-menu__left" aria-label="Разделы">
        <button
          v-for="root in tree"
          :key="root.id"
          type="button"
          class="mega-menu__parent"
          :class="{ 'mega-menu__parent--active': root.id === selectedId }"
          @click="selectedId = root.id"
          @mouseenter="onParentEnter(root.id)"
        >
          <span class="mega-menu__parent-label">{{ root.title }}</span>
          <UIcon
            name="i-lucide-chevron-right"
            class="mega-menu__parent-chevron"
            aria-hidden="true"
          />
        </button>
      </aside>

      <div class="mega-menu__right">
        <template v-if="activeRoot">
          <NuxtLink
            :to="safePath(activeRoot.path)"
            class="mega-menu__all-link"
            @click="onNavigate"
          >
            <span class="mega-menu__all-text">{{ t('catalogNav.allProductsInSection') }}</span>
            <UIcon name="i-lucide-arrow-right" class="mega-menu__all-icon" aria-hidden="true" />
          </NuxtLink>

          <template v-if="activeRoot.children.length">
            <div
              v-for="child in activeRoot.children"
              :key="child.id"
              class="mega-menu__sub-block"
            >
              <div class="mega-menu__sub-row">
                <NuxtLink
                  :to="safePath(child.path)"
                  class="mega-menu__sub-link"
                  @click="onNavigate"
                >
                  {{ child.title }}
                </NuxtLink>
                <button
                  v-if="child.children.length"
                  type="button"
                  class="mega-menu__plus"
                  :aria-expanded="expandedIds.has(child.id)"
                  :aria-label="t('catalogNav.expandSub')"
                  @click.stop="toggleExpand(child.id)"
                >
                  <UIcon name="i-lucide-plus" class="mega-menu__plus-icon" />
                </button>
              </div>
              <ul v-if="child.children.length && expandedIds.has(child.id)" class="mega-menu__grand">
                <li v-for="grand in child.children" :key="grand.id">
                  <NuxtLink
                    :to="safePath(grand.path)"
                    class="mega-menu__grand-link"
                    @click="onNavigate"
                  >
                    {{ grand.title }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </template>
          <p v-else class="mega-menu__empty">{{ t('catalogNav.noSubsections') }}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CatalogNavSectionTree } from '../types';

defineOptions({ name: 'WgCatalogMegaMenu' });

const props = withDefaults(
  defineProps<{
    tree: CatalogNavSectionTree[];
    open?: boolean;
  }>(),
  { open: false }
);

const emit = defineEmits<{ navigate: [] }>();

const { t } = useI18n();

const selectedId = ref<number | null>(null);
const expandedIds = ref<Set<number>>(new Set());

const activeRoot = computed(() => {
  if (!props.tree.length) {
    return null;
  }
  const id = selectedId.value;
  const found = id != null ? props.tree.find((r) => r.id === id) : undefined;
  return found ?? props.tree[0];
});

function safePath(path: string | undefined): string {
  return path?.trim() ? path : '/catalog/';
}

/** Закрытие панели при любом переходе по ссылке каталога */
function onNavigate(): void {
  emit('navigate');
}

function onParentEnter(id: number): void {
  if (typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches) {
    selectedId.value = id;
  }
}

function toggleExpand(id: number): void {
  const next = new Set(expandedIds.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  expandedIds.value = next;
}

function syncSelection(): void {
  expandedIds.value = new Set();
  if (!props.tree.length) {
    selectedId.value = null;
    return;
  }
  const keep =
    selectedId.value != null && props.tree.some((r) => r.id === selectedId.value);
  const firstId = props.tree[0]?.id;
  selectedId.value = keep ? selectedId.value : (firstId ?? null);
}

watch(
  () => props.tree,
  () => syncSelection(),
  { deep: true }
);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      syncSelection();
    }
  }
);

onMounted(() => syncSelection());

watch(selectedId, () => {
  expandedIds.value = new Set();
});
</script>

<style lang="scss">
/* Цвета и hover как у .catalog-site-header__nav-link */
.mega-menu {
  color: #0f172a;
  background: transparent;
}

.mega-menu__cols {
  display: grid;
  grid-template-columns: minmax(11rem, 34%) 1fr;
  min-height: 15rem;
  max-height: min(calc(100vh - 9rem), 38rem);
  overflow: hidden;
}

.mega-menu__left {
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.5rem 0;
}

.mega-menu__parent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  padding: 0.45rem 0.75rem;
  margin: 0;
  border: none;
  border-radius: 999px;
  background: transparent;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: normal;
  color: #475569;
  text-align: left;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: #f1f5f9;
    color: #0284c7;
  }
}

.mega-menu__parent--active {
  font-weight: 600;
  background: #f1f5f9;
  color: #0284c7;

  .mega-menu__parent-chevron {
    opacity: 1;
    color: inherit;
  }
}

.mega-menu__parent-label {
  flex: 1;
  min-width: 0;
  line-height: 1.4;
}

.mega-menu__parent-chevron {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  opacity: 0.55;
  color: inherit;
}

.mega-menu__right {
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem 1.25rem 1.25rem;
}

.mega-menu__all-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  text-decoration: none;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: #f1f5f9;
    color: #0284c7;
  }
}

.mega-menu__all-text {
  flex: 1;
  min-width: 0;
}

.mega-menu__all-icon {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  opacity: 0.65;
  color: inherit;
}

.mega-menu__sub-block + .mega-menu__sub-block {
  margin-top: 0.25rem;
}

.mega-menu__sub-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.mega-menu__sub-link {
  flex: 1;
  min-width: 0;
  padding: 0.45rem 0.75rem;
  margin-left: -0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  text-decoration: none;
  line-height: 1.4;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: #f1f5f9;
    color: #0284c7;
  }
}

.mega-menu__plus {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: #475569;
  cursor: pointer;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: #f1f5f9;
    color: #0284c7;
  }
}

.mega-menu__plus-icon {
  width: 1rem;
  height: 1rem;
}

.mega-menu__grand {
  margin: 0.25rem 0 0.5rem;
  padding: 0 0 0 0.85rem;
  list-style: none;
}

.mega-menu__grand-link {
  display: inline-block;
  max-width: 100%;
  padding: 0.35rem 0.75rem;
  margin-left: -0.75rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #475569;
  text-decoration: none;
  transition:
    background 0.15s ease,
    color 0.15s ease;

  &:hover {
    background: #f1f5f9;
    color: #0284c7;
  }
}

.mega-menu__empty {
  margin: 0;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  line-height: 1.45;
  color: #64748b;
  font-style: italic;
}
</style>
