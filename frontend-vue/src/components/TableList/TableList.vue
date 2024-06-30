<template>
  <div>
    <div v-if="showSearchBar" class="filters mb-3">
      <div class="input-group w-100">
        <span class="input-group-text" id="search-addon"><i class="fas fa-search"></i></span>
        <input type="text" id="search" v-model="searchQuery" placeholder="Rechercher..." class="form-control" aria-label="Recherche" aria-describedby="search-addon" />
      </div>
    </div>

    <table class="table table-striped">
      <thead>
      <tr>
        <th v-if="showSearchBar" @click="sort('date')" class="sortable">Date <i :class="getSortClass('date')"></i></th>
        <th v-if="showSearchBar" @click="sort('description')" class="sortable">Description <i :class="getSortClass('description')"></i></th>
        <th v-if="showSearchBar" @click="sort('billnum')" class="sortable">N° de Facture <i :class="getSortClass('billnum')"></i></th>
        <th @click="sort('client')" class="sortable">Client <i :class="getSortClass('client')"></i></th>
        <th class="text-end sortable" @click="sort('totalHT')">Prix HT <i :class="getSortClass('totalHT')"></i></th>
        <th class="text-end sortable" @click="sort('totalTTC')">Prix TTC <i :class="getSortClass('totalTTC')"></i></th>
        <th class="text-end">Actions</th>
      </tr>
      </thead>
      <tbody>
      <slot :bills="filteredAndSortedBills"/>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    bills: {
      type: Array,
      required: true,
    },
    showSearchBar: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      sortOrder: 'desc',  // Default to descending order
      sortField: 'billnum',  // Default sort field
      searchQuery: '',
    };
  },
  computed: {
    filteredAndSortedBills() {
      let sortedArray = this.bills;

      if (this.searchQuery) {
        const lowerQuery = this.searchQuery.toLowerCase();
        sortedArray = sortedArray.filter(
          (bill) =>
            bill.description.toLowerCase().includes(lowerQuery) ||
            bill.date.toLowerCase().includes(lowerQuery) ||
            bill.billnum.toLowerCase().includes(lowerQuery) ||
            bill.client.firstName.toLowerCase().includes(lowerQuery) ||
            bill.client.lastName.toLowerCase().includes(lowerQuery)
        );
      }

      if (this.sortField) {
        sortedArray = sortedArray.sort((a, b) => {
          let fieldA, fieldB;
          if (this.sortField === 'client') {
            fieldA = a.client.firstName + ' ' + a.client.lastName;
            fieldB = b.client.firstName + ' ' + b.client.lastName;
          } else {
            fieldA = a[this.sortField];
            fieldB = b[this.sortField];
          }

          if (fieldA < fieldB) return this.sortOrder === 'asc' ? -1 : 1;
          if (fieldA > fieldB) return this.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return sortedArray;
    },
  },
  methods: {
    sort(field) {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortOrder = 'asc';
      }
    },
    getSortClass(field) {
      if (this.sortField === field) {
        return this.sortOrder === 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down';
      }
      return 'fa fa-sort';
    }
  },
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
