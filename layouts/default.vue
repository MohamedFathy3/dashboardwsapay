<template>
  <div id="app">
    <!-- Sidebar and Navbar components -->
    <Sidebar v-if="authStore.isAdmin" />
    <Navbar />

    <!-- Main Content Section -->
    <div class="app-content content" :class="{ 'member-content': authStore.isMember }">
      <div class="content-overlay"></div>
      <div class="header-navbar-shadow"></div>
      <div class="content-wrapper">
        <div class="content-header row"></div>

        <!-- Transition wrapper around NuxtPage -->
        <transition name="fade" mode="out-in">
          <div class="page-wrapper">
            <!-- NuxtPage renders the current page content -->
            <NuxtPage />
          </div>
        </transition>
      </div>
    </div>

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<script setup>
// Import components
import Sidebar from "@/components/Sidebar.vue";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";

// Layout lifecycle hooks
import { onMounted } from "vue";

const authStore = useUserStore();

onMounted(() => {
  document.body.classList.add(
    "vertical-layout",
    "vertical-menu-modern",
    "2-columns",
    "navbar-floating",
    "footer-static"
  );
  document.body.setAttribute("data-open", "click");
  document.body.setAttribute("data-menu", "vertical-menu-modern");
  document.body.setAttribute("data-col", "2-columns");
});
</script>

<style scoped>
/* Fade transition styles */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.member-content {
  margin-left: 0 !important;
  width: 100%;
}

</style>
