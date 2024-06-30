<template>
  <div>
    <div class="row border-bottom pb-3 mb-3">
      <div class="col">
        <h1 class="h3">
          <i class="fa-solid fa-angle-down me-2"></i>Liste des clients
        </h1>
      </div>
      <div class="col text-end">
        <router-link to="/edit-client/-1" class="btn btn-outline-primary">
          <i class="fa-solid fa-plus-circle me-2"></i>Ajouter un Client
        </router-link>
      </div>
    </div>

    <div class="row mb-3">
      <div class="col">
        <div class="input-group">
          <span class="input-group-text">
            <i class="fa fa-search"></i>
          </span>
          <input
            type="text"
            v-model="searchQuery"
            class="form-control"
            placeholder="Rechercher..."
          />
        </div>
      </div>
    </div>

    <table class="table table-striped">
      <thead>
      <tr>
        <th @click="sortBy('lastName')" class="sortable">
          Nom
          <i :class="getSortIcon('lastName')"></i>
        </th>
        <th @click="sortBy('companyName')" class="sortable">
          Entreprise
          <i :class="getSortIcon('companyName')"></i>
        </th>
        <th @click="sortBy('createdAt')" class="text-end sortable">
          Date d'ajout
          <i :class="getSortIcon('createdAt')"></i>
        </th>
        <th class="text-end">Actions</th>
      </tr>
      </thead>
      <tbody>
      <ClientTableRow
        v-for="client in filteredAndSortedClients"
        :key="client.id"
        :client="client"
        @edit="onEditClient($event)"
        @delete="onDeleteClient($event)"
      />
      </tbody>
    </table>
  </div>
</template>

<script>
import ClientTableRow from '@/components/TableList/ClientTableRow.vue';
import { useClientStore } from '@/stores/clients.js';
import { mapActions, mapState } from 'pinia';

export default {
  components: {
    ClientTableRow
  },
  data() {
    return {
      searchQuery: '',
      sortKey: 'lastName', // Default sort field
      sortOrder: 1 // Default to ascending order
    };
  },
  computed: {
    ...mapState(useClientStore, ['clients']),
    filteredAndSortedClients() {
      let clients = this.clients.filter(client => {
        const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
        return (
          fullName.includes(this.searchQuery.toLowerCase()) ||
          client.companyName.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      });

      if (this.sortKey) {
        clients = clients.slice().sort((a, b) => {
          let fieldA, fieldB;
          if (this.sortKey === 'lastName') {
            fieldA = a[this.sortKey].toLowerCase();
            fieldB = b[this.sortKey].toLowerCase();
          } else {
            fieldA = a[this.sortKey].toLowerCase();
            fieldB = b[this.sortKey].toLowerCase();
          }

          if (fieldA < fieldB) return -1 * this.sortOrder;
          if (fieldA > fieldB) return 1 * this.sortOrder;
          return 0;
        });
      }

      return clients;
    }
  },
  async mounted() {
    await this.getAllClients();
  },
  methods: {
    ...mapActions(useClientStore, ['getAllClients', 'deleteClient']),
    onEditClient(client) {
      this.$router.push({
        name: 'edit-client',
        params: {
          id: client.id
        }
      });
    },
    async onDeleteClient(client) {
      await this.deleteClient(client.id);
    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortOrder *= -1;
      } else {
        this.sortKey = key;
        this.sortOrder = 1;
      }
    },
    getSortIcon(key) {
      if (this.sortKey !== key) return 'fa fa-sort';
      return this.sortOrder === 1 ? 'fa fa-sort-up' : 'fa fa-sort-down';
    }
  }
};
</script>

<style scoped>
.sortable {
  cursor: pointer;
}

.sortable .fa {
  margin-left: 0.5rem;
}
</style>
