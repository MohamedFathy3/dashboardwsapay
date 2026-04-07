<template>
  <section class="dashboard">
    <div class="row">
      <div class="col-lg-3 col-md-6 col-12">
        <Card :total="statusMap.pending" label="Pending" />
      </div>

      <div class="col-lg-3 col-md-6 col-12">
        <Card :total="statusMap.approved" label="Approved" />
      </div>

      <div class="col-lg-3 col-md-6 col-12">
        <Card :total="statusMap.suspended" label="Suspended" />
      </div>

      <div class="col-lg-3 col-md-6 col-12">
        <Card :total="statusMap.deactivate" label="Deactivate" />
      </div>
    </div>

    <div class="row mt-2">
      <div class="col-12">
        <div class="card p-2">
          <BarChart :data="approvedChartData" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import Card from "@/components/theme/Card.vue";
import BarChart from "@/components/theme/BarChart.vue";

type StatusItem = {
  status: string;
  total: number | string;
  month_number?: number | string;
};

const statuses = ref<StatusItem[]>([]);

const statusMap = computed(() => {
  const map: Record<string, number> = {
    pending: 0,
    approved: 0,
    suspended: 0,
    deactivate: 0,
  };

  statuses.value.forEach((item) => {
    const key = String(item.status).trim().toLowerCase();
    const value = Number(item.total) || 0;

    if (key && key in map) {
      map[key] += value;
    }
  });

  return map;
});

const approvedChartData = computed(() => {
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const monthMap: Record<number, number> = {};

  months.forEach((month) => {
    monthMap[month] = 0;
  });

  statuses.value.forEach((item) => {
    const status = String(item.status).trim().toLowerCase();

    if (status === "approved") {
      const month = Number(item.month_number);
      const total = Number(item.total);

      if (!Number.isNaN(month)) {
        monthMap[month] = total || 0;
      }
    }
  });

  return months.map((month) => ({
    date: `2024-${String(month).padStart(2, "0")}-01`,
    value: monthMap[month],
  }));
});

const fetchAdminDashboard = async () => {
  try {
    const response = await useApiFetch<{ data?: StatusItem[] }>(`/users/statuses`, {
      method: "POST",
      body: {},
    });

    statuses.value = response?.data || [];
  } catch (error) {
    console.error("Admin dashboard fetch failed:", error);
  }
};

onMounted(async () => {
  await fetchAdminDashboard();
});

definePageMeta({
  layout: "default",
  middleware: "auth",
  title: "Dashboard",
});
</script>
