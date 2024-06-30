<template>
  <div v-if="bill">
    <!-- Titre et bouton revenir -->
    <div class="row border-bottom pb-3 mb-3">
      <div class="col">
        <h1 v-if="isNewBill" class="h3">
          <i class="fa-solid fa-angle-down me-2"></i>Créer une facture
        </h1>
        <h1 v-else class="h3">
          <i class="fa-solid fa-angle-down me-2"></i>Éditer une facture
        </h1>
      </div>
      <div class="col text-end">
        <button v-if="!isNewBill" @click="confirmDelete" class="btn btn-outline-danger me-2">
          <i class="fa-solid fa-trash me-2"></i>Supprimer
        </button>
        <button @click="goBack" class="btn btn-outline-secondary">
          <i class="fa-solid fa-arrow-left me-2"></i>Revenir à la liste
        </button>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4">
        <div class="form-floating mb-3">
          <input
            type="text"
            name="billnum"
            id="billnum"
            v-model="bill.billnum"
            class="form-control"
            placeholder="Facture N° (AAAA-MM-XXXXX)"
            @input="checkField('billnum', billnumRegex)"
            @blur="checkBillnumExists"
            :class="{ 'is-invalid': (!isValid(bill.billnum, billnumRegex) && submitted) || (!isValid(bill.billnum, billnumRegex) && touched.billnum) || billnumExists, 'is-valid': isValid(bill.billnum, billnumRegex) && touched.billnum && !billnumExists }"
          />
          <label for="billnum" class="form-label">Facture N° (AAAA-MM-XXXXX)</label>
          <div v-if="(!isValid(bill.billnum, billnumRegex) && submitted) || (!isValid(bill.billnum, billnumRegex) && touched.billnum)" class="invalid-feedback">
            Le numéro de facture doit être au format AAAA-MM-XXXXX.
          </div>
          <div v-if="billnumExists && bill.billnum" class="invalid-feedback">
            Le numéro de facture existe déjà.
          </div>
        </div>
        <div class="form-floating mb-3">
          <input
            type="date"
            name="date"
            id="date"
            class="form-control"
            placeholder="Date"
            v-model="bill.date"
            :class="{ 'is-invalid': !bill.date && submitted, 'is-valid': bill.date }"
          />
          <label for="date" class="form-label">Émise le</label>
          <div v-if="!bill.date && submitted" class="invalid-feedback">
            La date de la facture est requise.
          </div>
        </div>
        <div class="form-floating mb-3">
          <select
            name="client"
            id="client"
            class="form-control"
            v-model="bill.clientId"
            :class="{ 'is-invalid': !bill.clientId && submitted, 'is-valid': bill.clientId }"
          >
            <option value="" disabled>Veuillez choisir un client</option>
            <option v-for="client in clients" :value="client.id" :key="client.id">
              {{ client.firstName }} {{ client.lastName }}
            </option>
          </select>
          <label for="client" class="form-label">Client</label>
          <div v-if="!bill.clientId && submitted" class="invalid-feedback">
            Le client est requis.
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="form-floating mb-3">
          <input
            type="text"
            name="description"
            id="description"
            class="form-control"
            placeholder="Description"
            v-model="bill.description"
            :class="{ 'is-invalid': !bill.description && submitted, 'is-valid': bill.description }"
          />
          <label for="description" class="form-label">Description</label>
          <div v-if="!bill.description && submitted" class="invalid-feedback">
            La description est requise.
          </div>
        </div>
      </div>
    </div>
    <table class="table table-striped">
      <thead>
      <tr>
        <th>Actions</th>
        <th class="col-prestation">Prestation</th>
        <th class="col-quantite">Quantité</th>
        <th class="col-montant-ht">Montant Unitaire HT</th>
        <th>Montant Total</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(prestation, index) in bill.prestations" :key="index">
        <td class="align-middle">
          <button @click="onAddPrestation(index)" class="btn text-body-tertiary">
            <i class="fa-solid fa-circle-plus"></i>
            <span class="visually-hidden">Ajouter une prestation</span>
          </button>
          <button
            :disabled="bill.prestations.length === 1"
            @click="onRemovePrestation(index)"
            class="btn text-danger"
          >
            <i class="fa-solid fa-trash"></i>
            <span class="visually-hidden">Supprimer une prestation</span>
          </button>
        </td>
        <td>
          <div class="form-floating">
            <input
              type="text"
              :name="'prestation-' + index"
              :id="'prestation-' + index"
              class="form-control"
              placeholder="Prestation"
              v-model="prestation.description"
              :class="{ 'is-invalid': !prestation.description && submitted, 'is-valid': prestation.description }"
            />
            <label :for="'prestation-' + index" class="form-label">Prestation</label>
            <div v-if="!prestation.description && submitted" class="invalid-feedback">
              La description est requise.
            </div>
          </div>
        </td>
        <td>
          <div class="form-floating">
            <input
              type="number"
              min="0"
              step="1"
              :name="'quantity-' + index"
              :id="'quantity-' + index"
              class="form-control"
              placeholder="Quantité"
              v-model="prestation.qty"
              :class="{ 'is-invalid': !prestation.qty && submitted, 'is-valid': prestation.qty }"
            />
            <label :for="'quantity-' + index" class="form-label">Quantité</label>
            <div v-if="!prestation.qty && submitted" class="invalid-feedback">
              La quantité est requise.
            </div>
          </div>
        </td>
        <td>
          <div class="form-floating">
            <input
              type="number"
              min="0"
              :name="'amount-ht-' + index"
              :id="'amount-ht-' + index"
              class="form-control"
              placeholder="Montant U. HT"
              v-model="prestation.price"
              :class="{ 'is-invalid': !prestation.price && submitted, 'is-valid': prestation.price }"
            />
            <label :for="'amount-ht-' + index" class="form-label">Montant Unitaire HT</label>
            <div v-if="!prestation.price && submitted" class="invalid-feedback">
              Le montant unitaire est requis.
            </div>
          </div>
        </td>
        <td>
          <div class="form-floating">
            <input
              type="number"
              min="0"
              step="1"
              :name="'total-row-' + index"
              :id="'total-row-' + index"
              class="form-control"
              placeholder="Montant Total"
              disabled
              :value="totalRow(index)"
            />
            <label :for="'total-row-' + index" class="form-label">Montant Total</label>
          </div>
        </td>
      </tr>
      <tr>
        <th colspan="4" class="align-middle text-end">Remises</th>
        <td>
          <div class="form-floating">
            <input
              type="number"
              min="0"
              step="1"
              name="discount"
              id="discount"
              class="form-control"
              placeholder="Remise"
              v-model="bill.discount"
            />
            <label for="discount" class="form-label">Remise</label>
          </div>
        </td>
      </tr>
      <tr>
        <th colspan="4" class="align-middle text-end">Déjà payé</th>
        <td>
          <div class="form-floating">
            <input
              type="number"
              min="0"
              step="1"
              name="paid"
              id="paid"
              class="form-control"
              placeholder="Déjà payé"
              v-model="bill.paid"
            />
            <label for="paid" class="form-label">Déjà payé</label>
          </div>
        </td>
      </tr>
      <tr>
        <th colspan="4" class="align-middle text-end">Total HT</th>
        <td>
          <div class="form-floating">
            <input
              type="number"
              min="0"
              step="1"
              disabled
              name="global-total-ht"
              id="global-total-ht"
              class="form-control"
              placeholder="Total HT"
              v-model="bill.totalHT"
            />
            <label for="global-total-ht" class="form-label">Total HT</label>
          </div>
        </td>
      </tr>
      <tr>
        <th colspan="4" class="align-middle text-end">TVA</th>
        <td>
          <div class="form-floating">
            <input
              type="number"
              min="0"
              step="1"
              name="tva"
              id="tva"
              disabled
              class="form-control"
              placeholder="TVA"
              v-model="bill.tva"
            />
            <label for="tva" class="form-label">TVA (20%)</label>
          </div>
        </td>
      </tr>
      <tr>
        <th colspan="4" class="align-middle text-end">Total TTC</th>
        <td>
          <div class="form-floating">
            <input
              type="number"
              min="0"
              step="1"
              name="grand-total-ttc"
              id="grand-total-ttc"
              disabled
              class="form-control"
              v-model="bill.totalTTC"
              placeholder="Total TTC"
            />
            <label for="grand-total-ttc" class="form-label">Total TTC</label>
          </div>
        </td>
      </tr>
      </tbody>
    </table>

    <p class="text-end">
      <button
        @click="submitForm"
        :disabled="formInvalid"
        class="btn btn-outline-primary btn-lg px-5"
      >
        <i class="fa-solid fa-save me-2"></i>Enregistrer
      </button>
    </p>
  </div>
</template>

<script>
import { useBillStore } from '@/stores/bill.js';
import { useClientStore } from '@/stores/clients.js';
import { mapActions, mapWritableState } from 'pinia';

const prestationInterface = {
  description: '',
  price: 0,
  qty: 1
};

export default {
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      submitted: false,
      clients: [],
      billnumExists: false,
      billnumRegex: /^\d{4}-(0[1-9]|1[0-2])-\d{5}$/,
      touched: {
        billnum: false
      }
    };
  },
  computed: {
    ...mapWritableState(useBillStore, ['bill', 'bills']),
    isNewBill() {
      return this.id == '-1';
    },
    formInvalid() {
      return (
        !this.bill ||
        !this.bill.clientId ||
        !this.isValid(this.bill.billnum, this.billnumRegex) ||
        !this.bill.date ||
        !this.bill.description ||
        this.bill.prestations.some(
          prestation => !prestation.description || !prestation.qty || !prestation.price
        ) ||
        this.billnumExists
      );
    },
    totalRow() {
      return index => {
        if (this.bill) {
          const prestation = this.bill.prestations[index];
          return prestation.qty * prestation.price;
        }
      };
    }
  },
  async mounted() {
    await this.setBill(this.id);
    await this.getAllClients();
  },
  methods: {
    ...mapActions(useBillStore, ['onDeleteBill', 'onUpdateBill', 'onCreateBill', 'setBill', 'getAllBills', 'checkBillnumExists']),
    ...mapActions(useClientStore, ['getAllClients']),
    async checkBillnumExists() {
      const exists = this.bills.some(b => b.billnum === this.bill.billnum);
      this.billnumExists = exists && this.isNewBill;
    },
    onAddPrestation(index) {
      this.bill.prestations.splice(index, 0, { ...prestationInterface });
    },
    onRemovePrestation(index) {
      this.bill.prestations.splice(index, 1);
    },
    updateTotal() {
      if (this.bill) {
        this.bill.totalHT = 0;
        for (const prestation of this.bill.prestations) {
          this.bill.totalHT += prestation.qty * prestation.price;
        }
        this.bill.totalTTC =
          this.bill.totalHT +
          (this.bill.totalHT * this.bill.tva) / 100 -
          this.bill.discount -
          this.bill.paid;
      }
    },
    async submitForm() {
      this.submitted = true;
      if (this.formInvalid) return;
      const selectedClient = this.clients.find(client => client.id === this.bill.clientId);
      this.bill.client = selectedClient;
      if (this.isNewBill) {
        await this.onCreateBill(this.bill);
      } else {
        await this.onUpdateBill(this.bill);
      }
      this.$router.push({ path: '/bills' });
    },
    goBack() {
      this.$router.push({ path: '/bills' });
    },
    confirmDelete() {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
        this.deleteBill(this.bill.id);
        this.$router.push({ path: '/bills' });
      }
    },
    async deleteBill(billId) {
      await this.onDeleteBill(billId);
    },
    async getAllClients() {
      const response = await this.$http.get('/clients');
      this.clients = response.data;
    },
    isValid(value, regex) {
      return regex.test(value);
    },
    checkField(field, regex) {
      this.touched[field] = true;
      this.isValid(this.bill[field], regex);
    }
  },
  watch: {
    'bill.prestations': {
      handler() {
        this.updateTotal();
      },
      deep: true
    },
    'bill.discount'() {
      this.updateTotal();
    },
    'bill.paid'() {
      this.updateTotal();
    }
  }
};
</script>

<style scoped>
.table .th-actions {
  width: 10%;
}

.table .col-prestation {
  width: 44%;
}

.table .col-quantite {
  width: 10%;
}

.table .col-montant-ht {
  width: 18%;
}

.table .th-montant-total {
  width: 18%;
}
</style>
