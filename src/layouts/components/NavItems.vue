<script lang="ts" setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
import path from 'path';
</script>

<template>
  <!-- 👉 Dashboards -->
  <!-- <VerticalNavGroup
    :item="{
      title: 'Dashboards',
      badgeContent: '5',
      badgeClass: 'bg-error',
      icon: 'ri-home-smile-line',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'Analytics',
        to: '/dashboard',
      }"
    />
  </VerticalNavGroup> -->

  <!-- 👉 Apps & Pages -->
  <VerticalNavSectionTitle
    :item="{
      heading: 'Pages',
    }"
  />

  <!-- <VerticalNavLink
    :item="{
      title: 'Account Settings',
      icon: 'ri-user-settings-line',
      to: '/account-settings',
    }"
  />

  <VerticalNavLink
    :item="{
      title: 'Login',
      icon: 'ri-login-box-line',
      to: '/login',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Register',
      icon: 'ri-user-add-line',
      to: '/register',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Error',
      icon: 'ri-information-line',
      to: '/no-existence',
    }"
  /> -->
  <VerticalNavGroup
    :item="{
      title: 'Test',
      badgeContent: '5',
      badgeClass: 'bg-success',
      icon: 'ri-file-list-3-line',
    }"
  >
    <VerticalNavLink
      :item="{
        title: 'N1',
        icon: 'ri-number-1',
        to: '/test/n1',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'N2',
        icon: 'ri-number-2',
        to: '/test/n2',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'N3',
        icon: 'ri-number-3',
        to: '/test/n3',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'N4',
        icon: 'ri-number-4',
        to: '/test/n4',
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'N5',
        icon: 'ri-number-5',
        to: '/test/n5',
      }"
    />
  </VerticalNavGroup>

  <!-- 👉 User Interface -->
  <!-- <VerticalNavSectionTitle
    :item="{
      heading: 'User Interface',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Typography',
      icon: 'ri-text',
      to: '/typography',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Icons',
      icon: 'ri-remixicon-line',
      to: '/icons',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Cards',
      icon: 'ri-bar-chart-box-line',
      to: '/cards',
    }"
  /> -->

  <!-- 👉 Forms & Tables -->
  <!-- <VerticalNavSectionTitle
    :item="{
      heading: 'Forms & Tables',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Form Layouts',
      icon: 'ri-layout-4-line',
      to: '/form-layouts',
    }"
  />
  <VerticalNavLink
    :item="{
      title: 'Tables',
      icon: 'ri-table-alt-line',
      to: '/tables',
    }"
  /> -->
</template>
