<template>
  <div class="feature-flags">
    <h1>Feature Flags</h1>
    <div v-if="!featureFlags || featureFlags.length === 0" class="loading">Loading feature flags...</div>
    <div v-else>
      <div class="controls">
        <label>
          <input type="checkbox" v-model="showObsoleteOnly" /> Show Only Obsolete Flags
        </label>
      </div>
      <p>Showing {{ filteredFlags?.length || 0 }} of {{ featureFlags?.length || 0 }} feature flags</p>
      <p class="obsolete-count">Obsolete Flags: {{ obsoleteCount || 0 }}</p>
      <table>
        <thead>
          <tr>
            <th @click="sortBy('name')">Feature Flag Name</th>
            <th @click="sortBy('status')">Status</th>
            <th @click="sortBy('creationDate')">Creation Date</th>
            <th @click="sortBy('trafficType')">Traffic Type</th>
            <th @click="sortBy('killed')">Killed</th>
            <th @click="sortBy('treatments')">Treatments</th>
            <th @click="sortBy('isObsolete')">Obsolete?</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="flag in paginatedFlags" :key="flag.name">
            <td>{{ flag.name }}</td>
            <td>{{ flag.status }}</td>
            <td>{{ flag.creationDate }}</td>
            <td>{{ flag.trafficType }}</td>
            <td>{{ flag.killed ? "Yes" : "No" }}</td>
            <td>{{ flag.treatments.join(", ") }}</td>
            <td :class="{ 'obsolete': flag.isObsolete }">{{ flag.isObsolete ? "Yes" : "No" }}</td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Prev</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { SplitService } from "@/services/SplitService";

export default defineComponent({
  setup() {
    const featureFlags = ref([]);
    const sortField = ref("name");
    const sortOrder = ref("asc");
    const showObsoleteOnly = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = 15;

    onMounted(async () => {
      await SplitService.ready();
      featureFlags.value = SplitService.getSplits() || [];
    });

    const sortedFlags = computed(() => {
      return [...(featureFlags.value || [])].sort((a, b) => {
        const fieldA = a[sortField.value] || "";
        const fieldB = b[sortField.value] || "";
        return fieldA < fieldB ? -1 : 1;
      });
    });

    const filteredFlags = computed(() => {
      return sortedFlags.value.filter(flag =>
        (!showObsoleteOnly.value || flag.isObsolete)
      );
    });

    const obsoleteCount = computed(() => {
      return featureFlags.value?.filter(flag => flag.isObsolete).length || 0;
    });

    const totalPages = computed(() => Math.ceil((filteredFlags.value.length || 1) / itemsPerPage));

    const paginatedFlags = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return filteredFlags.value.slice(start, start + itemsPerPage);
    });

    const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
    const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };

    const sortBy = (field) => {
      sortField.value = field;
      sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    };

    return { featureFlags, filteredFlags, paginatedFlags, sortBy, showObsoleteOnly, currentPage, totalPages, prevPage, nextPage, obsoleteCount };
  },
});
</script>
<style>
.feature-flags {
  max-width: 1000px;
  margin: auto;
  font-family: Arial, sans-serif;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 5px;
  overflow: hidden;
}

thead {
  background: #007bff;
  color: white;
}

th,
td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

th {
  cursor: pointer;
}

tbody tr:hover {
  background: #f1f1f1;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

button {
  padding: 8px 12px;
  border: none;
  background: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.obsolete {
  color: red;
  font-weight: bold;
}
</style>
