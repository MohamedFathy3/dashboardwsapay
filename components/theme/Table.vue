<template>
  <section id="basic-datatable">
    <div class="row">
      <div class="col-12">
        <!-- Top Controls -->
        <div class="d-flex justify-content-between mb-1">
          <div class="gap-2">
            <label>
              Show
              <select
                v-model="localPerPage"
                @change="$emit('change-per-page', localPerPage)"
                class="form-control"
              >
                <option
                  v-for="option in pageOptions"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
            </label>

            <button
              v-if="deleteBtns"
              class="btn btn-danger btnOut ml-1"
              :readonly="selectedIds.length === 0"
              @click="deleteSelected"
            >
              <i class="feather icon-trash"></i>
              multiple
            </button>
            <button
              v-if="!showDeletedItems && deleteBtns"
              class="btn btn-outline-danger btnOut ml-1"
              @click="deletedItems"
            >
              <i class="feather icon-delete"></i>
              deleted items
            </button>
            <button
              v-if="showDeletedItems && deleteBtns"
              class="btn btn-outline-success btnOut ml-1"
              @click="getItems"
            >
              <i class="feather icon-check"></i>
              items
            </button>
          </div>
          <div>
            <label>
              Search:
              <input
                v-model="localSearchQuery"
                @input="$emit('change-search', localSearchQuery)"
                type="search"
                class="form-control"
                placeholder="Search..."
              />
            </label>
          </div>
        </div>

        <!-- Table -->
        <div class="table-responsive">
          <table
            class="table data-list-view dataTable no-footer dt-checkboxes-select spaced-table p-0"
          >
            <thead>
              <tr>
                <th v-if="!showDeletedItems" @change="toggleSelectAll">
                  <fieldset class="checkbox">
                    <div class="vs-checkbox-con vs-checkbox-primary">
                      <input type="checkbox" :checked="isAllSelected" />
                      <span class="vs-checkbox ml-1">
                        <span class="vs-checkbox--check">
                          <i class="vs-icon feather icon-check"></i>
                        </span>
                      </span>
                    </div>
                  </fieldset>
                </th>
                <th v-for="(col, index) in columns" :key="index">
                  <span>
                    {{ col.label }}
                  </span>
                  <span>
                    <a
                      href="javascript:void(0)"
                      class="ml-1"
                      @click="sortData(col.key, 'asc')"
                    >
                      <i class="feather icon-arrow-up"></i>
                    </a>
                    <a
                      href="javascript:void(0)"
                      class=""
                      @click="sortData(col.key, 'desc')"
                    >
                      <i class="feather icon-arrow-down"></i>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, rowIndex) in filteredData"
                :key="rowIndex"
                :class="{ selected: selectedIds.includes(item.id) }"
              >
                <td v-if="!showDeletedItems">
                  <fieldset class="checkbox">
                    <div class="vs-checkbox-con vs-checkbox-primary">
                      <input
                        type="checkbox"
                        :value="item.id"
                        :checked="selectedIds.includes(item.id)"
                        @change="toggleSingleSelect(item.id)"
                      />
                      <span class="vs-checkbox">
                        <span class="vs-checkbox--check">
                          <i class="vs-icon feather icon-check"></i>
                        </span>
                      </span>
                    </div>
                  </fieldset>
                </td>
                <td
                  v-for="(col, colIndex) in columns"
                  :key="colIndex"
                  class="p-0"
                >
                  <!-- Custom user info for first column on members page -->
                  <ThemeUserInfo
                    v-if="
                      colIndex === 0 &&
                      (route.path === '/dashboard/members' ||
                        route.path === '/dashboard/members/pending')
                    "
                    :name="item.name"
                    :logo="item.logo"
                    :countryName="item.country?.name || 'N/A'"
                    :city="item.city || 'N/A'"
                    :countryFlag="item.country?.flag"
                    :email="item.email"
                  />

                  <div
                    v-else-if="tableTitle == 'countries' && col.key === 'name'"
                  >
                    <ThemeCardImage
                      :name="item.name"
                      :code="item.code"
                      :flag="item.flag"
                    />
                  </div>
                  <!-- Status column chip -->
                  <div v-else-if="col.key === 'status'">
                    <div
                      :class="[
                        'text-bold-600',
                        'chip',
                        {
                          'chip-semi-dark': item[col.key] === 'pending',
                          'chip-success': item[col.key] === 'approved',
                          'chip-warning': item[col.key] === 'suspended',
                          'chip-danger': item[col.key] === 'deactivate',
                        },
                      ]"
                    >
                      <div class="chip-body">
                        <div class="chip-text capitalize">
                          {{ item[col.key] }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <span v-else-if="col.key === 'type'">
                    <div v-if="item[col.key] == 'add'">
                      <i
                        class="feather icon-corner-right-down text-success"
                      ></i>
                      deposit
                    </div>
                    <div v-if="item[col.key] == 'withdraw'">
                      <i class="feather icon-corner-right-up text-danger"></i>
                      withdraw
                    </div>
                  </span>
                  <!-- Default display -->

                  <span v-else-if="col.key === 'actions'">
                    <button
                      class="btn btn-primary btn-icon rounded-circle"
                      @click="editItem(item)"
                    >
                      <i class="feather icon-edit"></i>
                    </button>
                    <button
                      class="btn btn-danger btn-icon rounded-circle"
                      @click="confirmDelete(item.id)"
                    >
                      <i class="feather icon-trash"></i>
                    </button>
                    <button 
                      class="btn btn-light btn-icon rounded-circle"
                      @click="viewItem(item.id)"
                      v-if="tableTitle !== 'admins' && tableTitle !== 'roles'">
                      <i class="feather icon-eye"></i>
                    </button>
                  </span>

                  <span
                    v-else-if="
                      tableTitle === 'transactions' && col.key === 'created_at'
                    "
                  >
                    {{ formatDate(item[col.key]) }}
                  </span>

                  <span v-else-if="col.key === 'active'">
                    <div
                      class="custom-control custom-switch custom-switch-dark"
                    >
                      <input
                        :checked="item[col.key]"
                        type="checkbox"
                        class="custom-control-input"
                        :id="`switch-${item.id}`"
                        @change="
                          $emit('change-status', {
                            id: item.id,
                            value: $event.target.checked,
                          })
                        "
                      />
                      <label
                        class="custom-control-label"
                        :for="`switch-${item.id}`"
                      ></label>
                    </div>
                  </span>

                  <span v-else>
                    {{ item[col.key] }}
                  </span>
                </td>
              </tr>
              <tr v-if="filteredData.length === 0">
                <td :colspan="columns.length + 1">No data available</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="d-flex justify-content-between">
          <div>
            <div role="status" aria-live="polite">
              Showing {{ meta.from }} to {{ meta.to }} of
              {{ meta.total }} entries
            </div>
          </div>
          <div>
            <div class="paging_simple_numbers">
              <ul class="pagination">
                <li
                  v-for="link in meta.links"
                  :key="link.label"
                  :class="['page-item', { active: link.active }]"
                >
                  <a
                    v-if="link.url"
                    @click.prevent="$emit('change-page', link.url)"
                    href="#"
                    class="page-link"
                  >
                    <span v-html="link.label" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
const { formatDate } = useFormatDate();

const route = useRoute();
const props = defineProps({
  data: {
    type: Array, // Define the type of items in the data array
    required: true,
  },
  meta: {
    type: Object,
    required: true,
  },
  deleteBtns: {
    type: Boolean,
  },
  tableTitle: {
    type: String,
  },
  columns: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits([
  "change-per-page",
  "change-search",
  "change-page",
  "update-selected",
  "sort-data",
  "view-item",
  "edit-item",
]);

const localPerPage = ref(10);
const localSearchQuery = ref("");
const pageOptions = [5, 10, 25, 50, 100, 500];

const showDeletedItems = ref(false);

watch(
  () => props.meta,
  () => {
    localPerPage.value = Number(props.meta.per_page) || 10;
  },
  { immediate: true }
);

// Filtered data based on search query
const filteredData = computed(() => {
  if (!localSearchQuery.value) return props.data;

  const query = localSearchQuery.value.toLowerCase();
  return props.data.filter((item) =>
    Object.values(item).some((val) => String(val).toLowerCase().includes(query))
  );
});

// Checkbox selection
const selectedIds = ref([]);

// Emit selected IDs to parent
watch(selectedIds, () => {
  emit("update-selected", selectedIds.value);
});

// Select All checkbox logic
const isAllSelected = computed(() => {
  return (
    filteredData.value.length > 0 &&
    filteredData.value.every((item) => selectedIds.value.includes(item.id))
  );
});

const toggleSelectAll = (event) => {
  const checked = event.target.checked;
  const currentPageIds = filteredData.value.map((item) => item.id);

  if (checked) {
    // Add all current page IDs to selectedIds
    selectedIds.value = Array.from(
      new Set([...selectedIds.value, ...currentPageIds])
    );
  } else {
    // Remove all current page IDs
    selectedIds.value = selectedIds.value.filter(
      (id) => !currentPageIds.includes(id)
    );
  }
};

const toggleSingleSelect = (id) => {
  if (selectedIds.value.includes(id)) {
    selectedIds.value = selectedIds.value.filter((i) => i !== id);
  } else {
    selectedIds.value.push(id);
  }
};
// Sort data based on column key
const sortData = (key, sort) => {
  emit("sort-data", { key, sort });
};
// Handle Edit Button Click
const editItem = (item) => {
  emit("edit-item", item);
};

// Confirm Delete for selected Item
const confirmDelete = (id) => {
  emit("delete-item", id); // Emit the ID for deletion
};

// Confirm Delete for selected Item
const viewItem = (id) => {
  emit("view-item", id); // Emit the ID for deletion
};

// Handle Deleting Selected Items
const deleteSelected = () => {
  if (selectedIds.value.length === 0) return;
  emit("delete-selected", selectedIds.value); // Emit selected IDs to delete
};

// Handle Deleted Items
const deletedItems = () => {
  showDeletedItems.value = true; // Toggle deleted items view
  emit("deleted-items"); // Emit to show deleted items
};

// Handle Deleted Items
const getItems = () => {
  showDeletedItems.value = false;
  emit("get-items");
};

// Handle Sorting
</script>

