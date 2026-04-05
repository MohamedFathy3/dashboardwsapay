<template>
  <div class="card">
    <div class="card-header d-flex align-items-baseline">
      <div :class="bgClss" class="avatar p-50 m-0">
        <div class="avatar-content">
          <i :class="[iconClass, colorMain]" class="font-medium-5"></i>
        </div>
      </div>

      <div>
        <h2 class="text-bold-700 mt-1 mb-25">
          {{ formattedTotal }}
        </h2>
      </div>
    </div>

    <div class="card-content">
      <div class="p-2">
        <p class="mb-0 text-capitalize">
          {{ label }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  total: number | string;
  label: string;
  iconClass?: string;
  colorMain?: string;
  bgClss?: string;
}

const props = defineProps<Props>();

const formattedTotal = computed(() => {
  if (props.total === undefined || props.total === null) return 0;

  return typeof props.total === "number"
    ? props.total.toLocaleString()
    : props.total;
});
</script>