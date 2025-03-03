<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { SplitService } from "@/services/SplitService";

export default defineComponent({
  setup() {
    const featureFlags = ref<
      { name: string; status: string; tags: string[]; creationDate: string }[]
    >([]);
    const sortField = ref<"name" | "status" | "tags" | "creationDate">("name");
    const sortOrder = ref<"asc" | "desc">("asc");

    onMounted(async () => {
      await SplitService.ready();
      featureFlags.value = SplitService.getSplits();
    });

    const sortedFlags = computed(() => {
      return [...featureFlags.value].sort((a, b) => {
        const fieldA = a[sortField.value];
        const fieldB = b[sortField.value];
        if (fieldA < fieldB) return sortOrder.value === "asc" ? -1 : 1;
        if (fieldA > fieldB) return sortOrder.value === "asc" ? 1 : -1;
        return 0;
      });
    });

    const sortBy = (field: "name" | "status" | "tags" | "creationDate") => {
      if (sortField.value === field) {
        sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
      } else {
        sortField.value = field;
        sortOrder.value = "asc";
      }
    };

    return { sortedFlags, sortBy };
  },
});
</script>

<template>
  <div class="feature-flags">
    <h1>Feature Flags</h1>
    <table>
      <thead>
        <tr>
          <th @click="sortBy('name')">Feature Flag Name</th>
          <th @click="sortBy('status')">Status</th>
          <th @click="sortBy('tags')">Tags</th>
          <th @click="sortBy('creationDate')">Creation Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="flag in sortedFlags" :key="flag.name">
          <td>{{ flag.name }}</td>
          <td>{{ flag.status }}</td>
          <td>{{ flag.tags.join(", ") }}</td>
          <td>{{ flag.creationDate }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.feature-flags {
  max-width: 800px;
  margin: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  border: 1px solid #ddd;
}

th {
  cursor: pointer;
  background-color: #f4f4f4;
}
</style>
