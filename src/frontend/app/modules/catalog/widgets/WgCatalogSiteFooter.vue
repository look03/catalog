<template>
  <footer class="catalog-site-footer">
    <div class="catalog-site-footer__glow" aria-hidden="true" />
    <div class="catalog-site-footer__inner">
      <div class="catalog-site-footer__col">
        <h2 class="catalog-site-footer__heading">{{ $t('catalogFooter.aboutTitle') }}</h2>
        <p class="catalog-site-footer__text">{{ $t('catalogFooter.aboutText') }}</p>
      </div>

      <div class="catalog-site-footer__col">
        <h2 class="catalog-site-footer__heading">{{ $t('catalogFooter.buyersTitle') }}</h2>
        <ul class="catalog-site-footer__list">
          <li>
            <NuxtLink to="/catalog/" class="catalog-site-footer__link">{{
              $t('catalogFooter.linkCatalog')
            }}</NuxtLink>
          </li>
          <li>
            <span class="catalog-site-footer__link catalog-site-footer__link--muted">
              {{ $t('catalogFooter.linkDelivery') }}
            </span>
          </li>
          <li>
            <NuxtLink to="/auth/" class="catalog-site-footer__link">{{
              $t('catalogNav.login')
            }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="catalog-site-footer__col">
        <h2 class="catalog-site-footer__heading">{{ $t('catalogFooter.contactsTitle') }}</h2>
        <p class="catalog-site-footer__contact-line">
          <span class="catalog-site-footer__label">{{ $t('catalogFooter.emailLabel') }}</span>
          <a
            class="catalog-site-footer__email"
            :href="`mailto:${contactEmail}`"
            :title="contactEmail"
          >
            {{ contactEmail }}
          </a>
        </p>
      </div>
    </div>

    <div class="catalog-site-footer__bar">
      <p class="catalog-site-footer__copyright">
        {{ $t('catalogFooter.copyright', { year }) }}
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineOptions({ name: 'WgCatalogSiteFooter' });

const contactEmail = 'hello@example.com';

const year = computed(() => new Date().getFullYear());
</script>

<style scoped lang="scss">
.catalog-site-footer {
  position: relative;
  margin-top: auto;
  background: linear-gradient(165deg, #0f172a 0%, #1e293b 45%, #0f172a 100%);
  color: #e2e8f0;
  overflow: hidden;

  &__glow {
    pointer-events: none;
    position: absolute;
    inset: -40% -20% auto;
    height: 70%;
    background: radial-gradient(
      ellipse at 50% 0%,
      rgba(56, 189, 248, 0.18) 0%,
      transparent 55%
    );
  }

  &__inner {
    position: relative;
    display: grid;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2.75rem 1.25rem 2rem;

    @media (min-width: 768px) {
      grid-template-columns: 1.2fr 1fr 1fr;
      gap: 2.5rem;
    }
  }

  &__col {
    min-width: 0;
  }

  &__heading {
    margin: 0 0 0.85rem;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #94a3b8;
  }

  &__text {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.55;
    color: #cbd5e1;
  }

  &__list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  &__link {
    font-size: 0.95rem;
    font-weight: 500;
    color: #f1f5f9;
    text-decoration: none;
    transition: color 0.15s ease;

    &:hover:not(&--muted) {
      color: #38bdf8;
    }

    &--muted {
      color: #94a3b8;
      cursor: default;
    }
  }

  &__contact-line {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__label {
    font-size: 0.75rem;
    color: #94a3b8;
  }

  &__email {
    font-size: 1rem;
    font-weight: 600;
    color: #38bdf8;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__bar {
    position: relative;
    border-top: 1px solid rgba(148, 163, 184, 0.15);
    padding: 1rem 1.25rem 1.5rem;
  }

  &__copyright {
    margin: 0;
    max-width: 1200px;
    margin-inline: auto;
    text-align: center;
    font-size: 0.8rem;
    color: #64748b;
  }
}
</style>
