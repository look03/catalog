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
        v-if="sections.length"
        class="catalog-site-header__nav-desktop"
        :aria-label="$t('catalogNav.sectionsTitle')"
      >
        <NuxtLink
          v-for="item in sections.slice(0, 6)"
          :key="item.id"
          :to="item.path"
          class="catalog-site-header__nav-link"
        >
          {{ item.title }}
        </NuxtLink>
      </nav>

      <div class="catalog-site-header__actions">
        <NuxtLink to="/auth/" class="catalog-site-header__login">
          {{ $t('catalogNav.login') }}
        </NuxtLink>

        <UiPopover
          v-model:open="menuOpen"
          mode="click"
          :content="{ align: 'end', side: 'bottom', sideOffset: 6 }"
          class="catalog-site-header__menu-popover"
        >
          <UiButton
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-lucide-menu"
            class="catalog-site-header__burger"
            :title="$t('catalogNav.burgerLabel')"
            :aria-label="$t('catalogNav.burgerLabel')"
            :aria-expanded="menuOpen"
            aria-haspopup="true"
          />
          <template #content="{ close }">
            <nav class="catalog-site-header__dropdown" :aria-label="$t('catalogNav.sectionsTitle')">
              <p class="catalog-site-header__dropdown-title">
                {{ $t('catalogNav.sectionsTitle') }}
              </p>
              <ul class="catalog-site-header__dropdown-list">
                <li v-for="item in sections" :key="item.id">
                  <NuxtLink
                    :to="item.path"
                    class="catalog-site-header__dropdown-link"
                    @click="close?.()"
                  >
                    {{ item.title }}
                  </NuxtLink>
                </li>
                <li v-if="!sections.length" class="catalog-site-header__dropdown-empty">
                  {{ $t('catalogNav.emptySectionsHint') }}
                </li>
              </ul>
              <NuxtLink to="/catalog/" class="catalog-site-header__dropdown-all" @click="close?.()">
                {{ $t('catalogNav.allCatalog') }}
              </NuxtLink>
            </nav>
          </template>
        </UiPopover>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { CatalogNavSection } from '../types';

defineOptions({ name: 'WgCatalogSiteHeader' });

const { getCatalogRootSections } = useCatalogModule();

const menuOpen = ref(false);

const { data: sectionsData } = await useAsyncData<CatalogNavSection[]>(
  'catalog-root-sections',
  () => getCatalogRootSections(),
  { default: () => [] }
);

const sections = computed(() => sectionsData.value ?? []);
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
    gap: 0.35rem 1rem;
    flex-wrap: wrap;
    justify-content: center;
    flex: 1;

    @media (min-width: 900px) {
      display: flex;
    }
  }

  &__nav-link {
    padding: 0.35rem 0.6rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #475569;
    text-decoration: none;
    transition:
      background 0.15s ease,
      color 0.15s ease;

    &:hover {
      background: #f1f5f9;
      color: #0ea5e9;
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

  &__dropdown {
    padding: 0.25rem;
    min-width: 14rem;
    max-height: min(70vh, 22rem);
    overflow-y: auto;
  }

  &__dropdown-title {
    margin: 0 0 0.35rem;
    padding: 0.35rem 0.65rem 0.25rem;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #94a3b8;
  }

  &__dropdown-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__dropdown-link {
    display: block;
    padding: 0.55rem 0.65rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    color: #334155;
    text-decoration: none;
    transition:
      background 0.15s ease,
      color 0.15s ease;

    &:hover {
      background: #f1f5f9;
      color: #0284c7;
    }
  }

  &__dropdown-empty {
    padding: 0.45rem 0.65rem;
    font-size: 0.85rem;
    color: #94a3b8;
  }

  &__dropdown-all {
    display: block;
    margin-top: 0.35rem;
    padding: 0.55rem 0.65rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #0284c7;
    text-decoration: none;
    border-top: 1px solid #f1f5f9;

    &:hover {
      background: #f0f9ff;
    }
  }
}
</style>
