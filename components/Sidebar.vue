<template>
  <!-- BEGIN: Main Menu-->
  <div
    class="main-menu menu-fixed menu-light menu-accordion menu-shadow"
    :class="{ 'menu-collapsed': menuCollapsed }"
    data-scroll-to-active="true"
  >
    <div class="navbar-header mb-2">
      <ul class="nav navbar-nav flex-row">
        <li class="nav-item mr-auto">
          <a class="navbar-brand" href="#">
            <img 
              src="/app-assets/images/logo/logo.svg" 
              style="width: 45px;" 
              srcset=""
              loading="lazy"
              alt="Logo"
            >
            <h2 class="brand-text mb-0" v-if="!menuCollapsed">WSA PAY</h2>
          </a>
        </li>
        <!-- Toggle Button -->
        <li class="nav-item nav-toggle" style="display: flex !important;">
          <a class="nav-link modern-nav-toggle pr-0" @click.stop="toggleSidebar" style="cursor: pointer;">
            <i
              class="toggle-icon feather font-medium-4 d-none d-xl-block collapse-toggle-icon primary"
              :class="menuCollapsed ? 'icon-circle' : 'icon-disc'"
            ></i>
          </a>
        </li>
      </ul>
    </div>

    <div class="shadow-bottom" v-if="!menuCollapsed"></div>
    <div class="main-menu-content">
      <ul class="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">
        <li class="navigation-header mt-0" v-if="!menuCollapsed">
          <span>Analytics</span>
        </li>

        <!-- Dashboard -->
        <li class="nav-item" :class="{ active: isDashboardActive }">
          <NuxtLink to="/dashboard" @click.stop="handleLinkClick">
            <i class="feather icon-home"></i>
            <span class="menu-item" v-if="!menuCollapsed">Dashboard</span>
          </NuxtLink>
        </li>

        <!-- Members -->
        <li class="nav-item" :class="{ open: openMenu === 'members' && !menuCollapsed }">
          <a href="#" @click.stop.prevent="handleMenuClick('members')" class="menu-toggle">
            <i class="feather icon-users"></i>
            <span class="menu-title" v-if="!menuCollapsed">Members</span>
            <i
              v-if="!menuCollapsed"
              class="feather float-right mr-0 menu-chevron"
              :class="getChevronClass('members')"
            ></i>
          </a>
          <ul class="menu-content" v-if="openMenu === 'members' && !menuCollapsed">
            <li :class="{ active: isMembersListActive }">
              <NuxtLink to="/dashboard/members" @click.stop="handleLinkClick">
                <i class="feather icon-circle"></i>
                <span class="menu-item">List</span>
              </NuxtLink>
            </li>
          </ul>
        </li>

        <!-- Reports -->
        <li class="nav-item" :class="{ open: openMenu === 'reports' && !menuCollapsed }">
          <a href="#" @click.stop.prevent="handleMenuClick('reports')" class="menu-toggle">
            <i class="feather icon-file"></i>
            <span class="menu-title" v-if="!menuCollapsed">Reports</span>
            <i
              v-if="!menuCollapsed"
              class="feather float-right mr-0 menu-chevron"
              :class="getChevronClass('reports')"
            ></i>
          </a>
          <ul class="menu-content" v-if="openMenu === 'reports' && !menuCollapsed">
            <li :class="{ active: isTransactionsActive }">
              <NuxtLink to="/dashboard/transactions" @click.stop="handleLinkClick">
                <i class="feather icon-circle"></i>
                <span class="menu-item">Transactions</span>
              </NuxtLink>
            </li>
          </ul>
        </li>

        <!-- Settings -->
        <li class="nav-item" :class="{ open: openMenu === 'settings' && !menuCollapsed }">
          <a href="#" @click.stop.prevent="handleMenuClick('settings')" class="menu-toggle">
            <i class="feather icon-settings"></i>
            <span class="menu-title" v-if="!menuCollapsed">Settings</span>
            <i
              v-if="!menuCollapsed"
              class="feather float-right mr-0 menu-chevron"
              :class="getChevronClass('settings')"
            ></i>
          </a>
          <ul class="menu-content" v-if="openMenu === 'settings' && !menuCollapsed">
            <li :class="{ active: isAdminsActive }">
              <NuxtLink to="/dashboard/admins" @click.stop="handleLinkClick">
                <i class="feather icon-users"></i>
                <span class="menu-item">Admins</span>
              </NuxtLink>
            </li>
            <li :class="{ active: isRolesActive }">
              <NuxtLink to="/dashboard/roles" @click.stop="handleLinkClick">
                <i class="feather icon-lock"></i>
                <span class="menu-item">Roles</span>
              </NuxtLink>
            </li>
            <li :class="{ active: isCountriesActive }">
              <NuxtLink to="/dashboard/countries" @click.stop="handleLinkClick">
                <i class="feather icon-globe"></i>
                <span class="menu-item">Countries</span>
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const menuCollapsed = ref(false)
const openMenu = ref(null)

// Computed properties for active states
const isDashboardActive = computed(() => route.path === '/dashboard')

const isMembersListActive = computed(() => 
  route.path === '/dashboard/members' || 
  route.path.startsWith('/dashboard/members/') && 
  !route.path.includes('/pending')
)

const isMembersPendingActive = computed(() => 
  route.path.startsWith('/dashboard/members/pending')
)

const isTransactionsActive = computed(() => 
  route.path === '/dashboard/transactions'
)

const isAdminsActive = computed(() => 
  route.path === '/dashboard/admins'
)

const isRolesActive = computed(() => 
  route.path === '/dashboard/roles'
)

const isCountriesActive = computed(() => 
  route.path === '/dashboard/countries'
)

// Simple route watcher
watch(() => route.path, (newPath) => {
  if (newPath.includes('/dashboard/members')) {
    openMenu.value = 'members'
  } else if (newPath.includes('/dashboard/transactions')) {
    openMenu.value = 'reports'
  } else if (newPath.includes('/dashboard/admins') ||
             newPath.includes('/dashboard/roles') ||
             newPath.includes('/dashboard/countries')) {
    openMenu.value = 'settings'
  } else if (newPath === '/dashboard') {
    openMenu.value = null
  }
}, { immediate: true })

function toggleSidebar() {
  menuCollapsed.value = !menuCollapsed.value
  
  // Close all dropdown menus when collapsing sidebar
  if (menuCollapsed.value) {
    openMenu.value = null
  }
  
  // Update body classes
  document.body.classList.toggle('menu-collapsed', menuCollapsed.value)
  document.body.classList.toggle('menu-expanded', !menuCollapsed.value)
}

function handleMenuClick(menuName) {
  if (menuCollapsed.value) {
    // If sidebar is collapsed, expand it first
    toggleSidebar()
    // Then open the menu after a small delay
    setTimeout(() => {
      openMenu.value = menuName
    }, 300)
    return
  }
  
  // If clicking the same menu, close it
  if (openMenu.value === menuName) {
    openMenu.value = null
  } else {
    // Otherwise open the new menu
    openMenu.value = menuName
  }
}

function getChevronClass(menuName) {
  return openMenu.value === menuName ? 'icon-chevron-down' : 'icon-chevron-right'
}

function handleLinkClick(event) {
  // Prevent event bubbling
  event.stopPropagation()
  
  // Close menus on mobile
  if (window.innerWidth < 1200) {
    openMenu.value = null
  }
}

onMounted(() => {
  document.body.classList.add('menu-expanded')
  
  // Initialize menu state based on current route
  const currentPath = route.path
  if (currentPath.includes('/dashboard/members')) {
    openMenu.value = 'members'
  } else if (currentPath.includes('/dashboard/transactions')) {
    openMenu.value = 'reports'
  } else if (currentPath.includes('/dashboard/admins') || 
             currentPath.includes('/dashboard/roles') || 
             currentPath.includes('/dashboard/countries')) {
    openMenu.value = 'settings'
  }
  
  // Check if sidebar should start collapsed
  const savedState = localStorage.getItem('sidebarCollapsed')
  if (savedState === 'true') {
    menuCollapsed.value = true
    document.body.classList.add('menu-collapsed')
    document.body.classList.remove('menu-expanded')
  }
})

// Save collapsed state to localStorage
watch(() => menuCollapsed.value, (collapsed) => {
  localStorage.setItem('sidebarCollapsed', collapsed.toString())
})
</script>

<style scoped>
/* Base styles */
.main-menu {
  transition: width 0.3s ease;
  width: 260px; /* Default expanded width */
}

.main-menu.menu-collapsed {
  width: 80px !important; /* Collapsed width */
}

/* Navbar header - keep toggle button visible */
.navbar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 15px;
}

.navbar-nav {
  display: flex;
  align-items: center;
  width: 100%;
}

.nav-item.mr-auto {
  flex: 1;
}

/* Toggle button - ALWAYS VISIBLE */
.nav-item.nav-toggle {
  display: flex !important;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.nav-link.modern-nav-toggle {
  display: flex !important;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 10px !important;
  color: #6e6b7b;
}

.nav-link.modern-nav-toggle:hover {
  color: #7367f0;
}

/* Menu items - hide text when collapsed */
.menu-collapsed .brand-text,
.menu-collapsed .navigation-header,
.menu-collapsed .menu-item,
.menu-collapsed .menu-title,
.menu-collapsed .menu-chevron,
.menu-collapsed .shadow-bottom,
.menu-collapsed .menu-content {
  display: none !important;
}

/* Logo styling in collapsed state */
.menu-collapsed .navbar-brand {
  display: flex !important;
  justify-content: center !important;
  padding: 0 !important;
  width: 100%;
}

.menu-collapsed .navbar-brand img {
  margin: 0 auto !important;
}

/* Menu items in collapsed state */
.menu-collapsed .nav-item > a:not(.modern-nav-toggle) {
  display: flex !important;
  justify-content: center !important;
  padding: 12px 0 !important;
  text-align: center;
}

.menu-collapsed .nav-item > a:not(.modern-nav-toggle) i:first-child {
  margin: 0 !important;
}

/* Menu content */
.menu-content {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.menu-content li {
  padding-left: 2rem;
}

/* General menu item styling */
.menu-toggle, .nav-item > a:not(.modern-nav-toggle) {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  padding: 12px 20px;
  white-space: nowrap;
  color: #6e6b7b;
}

.menu-toggle:hover, .nav-item > a:not(.modern-nav-toggle):hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #7367f0;
}

/* Active state */
.nav-item.active > a:not(.menu-toggle):not(.modern-nav-toggle) {
  font-weight: bold;
  color: #7367f0 !important;
  background-color: rgba(115, 103, 240, 0.05);
}

.menu-content li.active a {
  font-weight: bold;
  color: #7367f0 !important;
}

/* Icons */
.menu-collapsed .nav-item i:not(.toggle-icon) {
  font-size: 1.2rem;
  margin: 0;
}

/* Mobile responsive */
@media (max-width: 1199px) {
  .main-menu {
    width: 260px !important;
  }
  
  .main-menu.menu-collapsed {
    transform: translateX(-260px);
    width: 260px !important;
  }
  
  .nav-link.modern-nav-toggle {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .menu-collapsed .nav-link.modern-nav-toggle {
    right: 10px;
  }
}

/* Ensure toggle button is always visible */
.toggle-icon {
  display: block !important;
  font-size: 1.3rem;
}

/* Force show the toggle container */
.nav-toggle {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
}
</style>