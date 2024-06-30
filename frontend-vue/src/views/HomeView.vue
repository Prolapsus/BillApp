<template>
  <div>
    <!-- Titre et boutons ajouter -->
    <div class="row border-bottom pb-3 mb-3">
      <div class="col">
        <h1 class="h3">
          <i class="fa-solid fa-angle-down me-2"></i>Dashboard
        </h1>
      </div>
      <div class="col text-end">
        <router-link to="/edit-client/-1" class="btn btn-outline-primary me-2">
          <i class="fa-solid fa-plus-circle me-2"></i>Ajouter un Client
        </router-link>
        <router-link to="/edit-bill/-1" class="btn btn-outline-primary">
          <i class="fa-solid fa-plus-circle me-2"></i>Ajouter une facture
        </router-link>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4">
        <div class="card mb-3">
          <div class="card-body">
            <h2>{{ stats.totalBills }} Factures en 2024</h2>
            <canvas id="billsChart"></canvas>
            <h4 class="text-end mt-3">{{ formatCurrency(stats.totalPaid) }}</h4>
            <div class="mt-3">
              <p class="mb-1 d-flex justify-content-between align-items-center">
                <span><span class="dot blue"></span> Total Encaissé TTC  -  {{ getPercentageChange(stats.totalPaidChange) }}%</span>
                <i :class="getChangeIcon(stats.totalPaidChange)"></i>
              </p>
              <p class="mb-1 d-flex justify-content-between align-items-center">
                <span><span class="dot orange"></span> Total Facturé TTC  -  {{ getPercentageChange(stats.totalRevenueChange) }}%</span>
                <i :class="getChangeIcon(stats.totalRevenueChange)"></i>
              </p>
              <p class="mb-1 d-flex justify-content-between align-items-center">
                <span><span class="dot red"></span> Total Dû TTC  -  {{ getPercentageChange(stats.totalDueChange) }}%</span>
                <i :class="getChangeIcon(stats.totalDueChange)"></i>
              </p>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <h2>Revenu par mois</h2>
            <canvas id="revenueChart"></canvas>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="card mb-3">
          <div class="card-body">
            <h2>Factures en cours</h2>
            <table class="table table-striped">
              <thead>
              <tr>
                <th>N°</th>
                <th>Client</th>
                <th class="text-end">Montant HT</th>
                <th class="text-end">Montant TTC</th>
                <th class="text-end">Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="bill in recentBills" :key="bill.id">
                <td class="align-middle">{{ bill.billnum }}</td>
                <td class="align-middle">{{ bill.client.firstName }} {{ bill.client.lastName }}</td>
                <td class="align-middle text-end">{{ formatCurrency(bill.totalHT) }} HT</td>
                <td class="align-middle text-end">{{ formatCurrency(bill.totalTTC) }} TTC</td>
                <td class="align-middle text-end">
                  <button @click="editBill(bill)" class="btn btn-outline-info">
                    <i class="fa-solid fa-pen"></i>Éditer
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <h2>Clients</h2>
            <table class="table table-striped">
              <thead>
              <tr>
                <th>Nom du contact</th>
                <th>Entreprise</th>
                <th class="text-center">Date d'ajout</th>
                <th class="text-end">Actions</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="client in recentClients" :key="client.id">
                <td class="align-middle">{{ client.firstName }} {{ client.lastName }}</td>
                <td class="align-middle">{{ client.companyName }}</td>
                <td class="align-middle text-center">{{ client.createdAt }}</td>
                <td class="align-middle text-end">
                  <button @click="editClient(client)" class="btn btn-outline-info">
                    <i class="fa-solid fa-pen"></i>Éditer
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import { useBillStore } from '@/stores/bill';
import { useClientStore } from '@/stores/clients';
import Chart from 'chart.js/auto';

export default {
  data() {
    return {
      stats: {
        totalBills: 0,
        totalClients: 0,
        totalRevenue: 0,
        totalPaid: 0,
        totalDue: 0,
        totalPaidChange: 0,
        totalRevenueChange: 0,
        totalDueChange: 0
      },
      recentBills: [],
      recentClients: []
    };
  },
  computed: {
    ...mapState(useBillStore, ['bills']),
    ...mapState(useClientStore, ['clients'])
  },
  methods: {
    ...mapActions(useBillStore, ['getAllBills']),
    ...mapActions(useClientStore, ['getAllClients']),
    async fetchDashboardData() {
      await this.getAllBills();
      await this.getAllClients();

      const currentYear = new Date().getFullYear();
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      this.stats.totalBills = this.bills.filter(bill => new Date(bill.date).getFullYear() === currentYear).length;
      this.stats.totalRevenue = this.bills.reduce((total, bill) => total + bill.totalTTC, 0);
      this.stats.totalPaid = this.bills.reduce((total, bill) => total + bill.paid, 0);
      this.stats.totalDue = this.bills.reduce((total, bill) => total + (bill.totalTTC - bill.paid), 0);

      const lastMonthTotalPaid = this.bills
        .filter(bill => new Date(bill.date).getMonth() === lastMonth.getMonth() && new Date(bill.date).getFullYear() === currentYear)
        .reduce((total, bill) => total + bill.paid, 0);
      const lastMonthTotalRevenue = this.bills
        .filter(bill => new Date(bill.date).getMonth() === lastMonth.getMonth() && new Date(bill.date).getFullYear() === currentYear)
        .reduce((total, bill) => total + bill.totalTTC, 0);
      const lastMonthTotalDue = this.bills
        .filter(bill => new Date(bill.date).getMonth() === lastMonth.getMonth() && new Date(bill.date).getFullYear() === currentYear)
        .reduce((total, bill) => total + (bill.totalTTC - bill.paid), 0);

      this.stats.totalPaidChange = this.calculateChange(lastMonthTotalPaid, this.stats.totalPaid);
      this.stats.totalRevenueChange = this.calculateChange(lastMonthTotalRevenue, this.stats.totalRevenue);
      this.stats.totalDueChange = this.calculateChange(lastMonthTotalDue, this.stats.totalDue);

      this.recentBills = this.bills.sort((a, b) => b.billnum.localeCompare(a.billnum)).slice(0, 5);
      this.stats.totalClients = this.clients.length;
      this.recentClients = this.clients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

      this.createCharts();
    },
    createCharts() {
      const billsChartCtx = document.getElementById('billsChart').getContext('2d');
      new Chart(billsChartCtx, {
        type: 'doughnut',
        data: {
          labels: ['Total Encaissé TTC', 'Total Facturé TTC', 'Total Dû TTC'],
          datasets: [{
            label: 'Factures en 2024',
            data: [this.stats.totalPaid, this.stats.totalRevenue, this.stats.totalDue],
            backgroundColor: ['blue', 'orange', 'red']
          }]
        }
      });

      const revenueChartCtx = document.getElementById('revenueChart').getContext('2d');
      new Chart(revenueChartCtx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Revenu par mois',
            data: this.getMonthlyRevenue(),
            backgroundColor: 'green'
          }]
        }
      });
    },
    getMonthlyRevenue() {
      const monthlyRevenue = new Array(12).fill(0);
      this.bills.forEach(bill => {
        const month = new Date(bill.date).getMonth();
        monthlyRevenue[month] += bill.totalTTC;
      });
      return monthlyRevenue;
    },
    calculateChange(lastMonthValue, currentValue) {
      if (lastMonthValue === 0) return 0;
      return ((currentValue - lastMonthValue) / lastMonthValue) * 100;
    },
    getPercentageChange(value) {
      return value.toFixed(2);
    },
    getChangeIcon(change) {
      return change >= 0 ? 'fa-solid fa-arrow-up text-success' : 'fa-solid fa-arrow-down text-danger';
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
    },
    editBill(bill) {
      this.$router.push({ path: `/edit-bill/${bill.id}` });
    },
    editClient(client) {
      this.$router.push({ path: `/edit-client/${client.id}` });
    }
  },
  async mounted() {
    await this.fetchDashboardData();
  }
};
</script>

<style scoped>
.card {
  margin-bottom: 1rem;
}
.text-success {
  color: green;
}
.text-danger {
  color: red;
}
.d-flex {
  display: flex;
}
.justify-content-between {
  justify-content: space-between;
}
.align-items-center {
  align-items: center;
}
.dot {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}
.dot.blue {
  background-color: blue;
}
.dot.orange {
  background-color: orange;
}
.dot.red {
  background-color: red;
}
</style>
