<template>
  <header class="catalog-site-header">
    <div class="catalog-site-header__inner">
      <NuxtLink to="/catalog/" class="catalog-site-header__brand">
        <span class="catalog-site-header__brand-mark" aria-hidden="true" />
        <span class="catalog-site-header__brand-text">
          <span class="catalog-site-header__title">{{ $t('catalogNav.brandName') }}</span>
          <span class="catalog-site-header__subtitle">{{ $t('catalogNav.tagline') }}</span>
        </span>
      </NuxtLink>

      <nav
        v-if="sectionTree.length"
        class="catalog-site-header__nav-desktop"
        :aria-label="$t('catalogNav.sectionsTitle')"
      >
        <NuxtLink
          v-for="root in sectionTree"
          :key="root.id"
          :to="root.path"
          class="catalog-site-header__nav-link"
        >
          {{ root.title }}
        </NuxtLink>
      </nav>

      <div class="catalog-site-header__actions">
        <NuxtLink to="/auth/" class="catalog-site-header__login">
          {{ $t('catalogNav.login') }}
        </NuxtLink>

        <USlideover v-model:open="menuOpen" side="right" :close="false" :ui="slideoverUi">
          <UiButton
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-lucide-menu"
            class="catalog-site-header__burger"
            :title="$t('catalogNav.burgerLabel')"
            :aria-label="$t('catalogNav.burgerLabel')"
            :aria-expanded="menuOpen"
          />

          <template #header>
            <div class="catalog-site-header__mega-bar">
              <div class="catalog-site-header__mega-bar-start">
                <button
                  type="button"
                  class="catalog-site-header__mega-close"
                  :aria-label="$t('catalogNav.closeMenu')"
                  @click="closeCatalogMenu"
                >
                  <UIcon name="i-lucide-x" class="catalog-site-header__mega-close-icon" />
                </button>
                <span class="catalog-site-header__mega-title">{{ $t('catalogNav.menuTitle') }}</span>
              </div>
              <nav
                v-if="sectionTree.length"
                class="catalog-site-header__mega-quick"
                :aria-label="$t('catalogNav.quickSections')"
              >
                <NuxtLink
                  v-for="r in sectionTree.slice(0, 3)"
                  :key="r.id"
                  :to="r.path"
                  class="catalog-site-header__mega-quick-link"
                  @click="closeCatalogMenu"
                >
                  {{ r.title }}
                </NuxtLink>
              </nav>
            </div>
          </template>

          <template #body>
            <div class="catalog-site-header__drawer-body">
              <div v-if="sectionTree.length" class="catalog-site-header__drawer-inner">
                <WgCatalogMegaMenu
                  :tree="sectionTree"
                  :open="menuOpen"
                  @navigate="closeCatalogMenu"
                />
              </div>
              <p v-else class="catalog-site-header__drawer-empty">
                {{ $t('catalogNav.emptySectionsHint') }}
              </p>
            </div>
          </template>
        </USlideover>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { CatalogNavSectionTree } from '../types';

defineOptions({ name: 'WgCatalogSiteHeader' });

const { getCatalogSectionTree } = useCatalogModule();

const menuOpen = ref(false);

const slideoverUi = {
  content:
    'w-[min(100vw-10px,min(92vw,38rem))] sm:max-w-xl md:max-w-2xl flex flex-col bg-white shadow-lg ring-1 ring-stone-200',
  header: 'flex-shrink-0 px-4 py-3 bg-white',
  body: 'flex min-h-0 flex-1 flex-col overflow-hidden p-0 bg-white'
};

const { data: treeData } = await useAsyncData<CatalogNavSectionTree[]>(
  'catalog-section-tree',
  () => getCatalogSectionTree(),
  { default: () => [] }
);

const sectionTree = computed(() => treeData.value ?? []);

function closeCatalogMenu(): void {
  menuOpen.value = false;
}
</script>

<style scoped lang="scss">
.catalog-site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-bottom: 1px solid #e2e8f0;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.06),
    0 4px 16px rgba(15, 23, 42, 0.04);

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0.85rem 1.25rem;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: #0f172a;
    min-width: 0;

    &:hover .catalog-site-header__title {
      color: #0ea5e9;
    }
  }

  &__brand-mark {
    flex-shrink: 0;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 10px;
    background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #a855f7 100%);
    box-shadow: 0 2px 8px rgba(14, 165, 233, 0.35);
  }

  &__brand-text {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
  }

  &__title {
    font-weight: 700;
    font-size: 1.05rem;
    letter-spacing: -0.02em;
    transition: color 0.2s ease;
  }

  &__subtitle {
    font-size: 0.75rem;
    color: #64748b;
    line-height: 1.2;
  }

  &__nav-desktop {
    display: none;
    align-items: center;
    gap: 0.25rem;
    flex: 1;
    justify-content: center;
    flex-wrap: wrap;
    overflow-x: auto;
    scrollbar-width: thin;

    @media (min-width: 900px) {
      display: flex;
    }
  }

  &__nav-link {
    padding: 0.45rem 0.75rem;
    border-radius: 999px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #475569;
    text-decoration: none;
    white-space: nowrap;
    transition:
      background 0.15s ease,
      color 0.15s ease;

    &:hover {
      background: #f1f5f9;
      color: #0284c7;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    flex-shrink: 0;
  }

  &__login {
    display: none;
    padding: 0.45rem 0.85rem;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #475569;
    text-decoration: none;
    border: 1px solid #e2e8f0;
    background: #fff;
    transition:
      border-color 0.15s ease,
      color 0.15s ease,
      box-shadow 0.15s ease;

    @media (min-width: 480px) {
      display: inline-flex;
      align-items: center;
    }

    &:hover {
      border-color: #0ea5e9;
      color: #0284c7;
      box-shadow: 0 2px 8px rgba(14, 165, 233, 0.15);
    }
  }

  &__burger {
    border-radius: 10px;
    padding: 0.45rem !important;
  }

  &__mega-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    width: 100%;
    max-width: 100%;
  }

  &__mega-bar-start {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    min-width: 0;
  }

  &__mega-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: #44403c;
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }

  &__mega-close-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  &__mega-title {
    font-family: Georgia, 'Times New Roman', Times, serif;
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: #1c1917;
  }

  &__mega-quick {
    display: none;
    align-items: center;
    gap: 0.35rem 0.85rem;
    flex-wrap: wrap;
    justify-content: flex-end;

    @media (min-width: 380px) {
      display: flex;
    }
  }

  &__mega-quick-link {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: #78716c;
    text-decoration: none;
    white-space: nowrap;
    padding: 0.2rem 0;
    transition: color 0.15s ease;

    &:hover {
      color: #44403c;
    }
  }

  &__drawer-body {
    display: flex;
    min-height: 0;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
  }

  &__drawer-inner {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  &__drawer-empty {
    margin: 0;
    padding: 1rem 1.25rem;
    font-size: 0.875rem;
    line-height: 1.5;
    color: #78716c;
  }
}
</style>
