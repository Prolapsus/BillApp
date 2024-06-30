<template>
  <tr>
    <td class="align-middle">{{ client.firstName }} {{ client.lastName }}</td>
    <td class="align-middle">{{ client.companyName }}</td>
    <td class="align-middle text-end">{{ client.createdAt }}</td>
    <td class="align-middle d-flex gap-2 justify-content-end align-items-center">
      <button @click="onDelete" class="btn btn-outline-danger">
        <i class="fa-solid fa-trash me-2"></i>Supprimer
      </button>
      <button @click="onEdit" class="btn btn-outline-info">
        <i class="fa-solid fa-pen me-2"></i>Editer
      </button>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    client: {
      type: Object,
      required: true
    }
  },
  emits: ['edit', 'delete'],
  methods: {
    onEdit() {
      this.$emit('edit', this.client)
    },
    onDelete() {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
        this.$emit('delete', this.client);
      }
    }
  }
}
</script>

<style scoped></style>
