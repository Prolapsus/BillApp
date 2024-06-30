<template>
  <div v-if="client">
    <div class="row border-bottom pb-3 mb-3">
      <div class="col">
        <h1 v-if="isNewClient" class="h3">
          <i class="fa-solid fa-angle-down me-2"></i>Créer un client
        </h1>
        <h1 v-else class="h3">
          <i class="fa-solid fa-angle-down me-2"></i>Éditer un client
        </h1>
      </div>
      <div class="col text-end">
        <button v-if="!isNewClient" @click="confirmDelete" class="btn btn-outline-danger me-2">
          <i class="fa-solid fa-trash me-2"></i>Supprimer
        </button>
        <button @click="goBack" class="btn btn-outline-secondary">
          <i class="fa-solid fa-arrow-left me-2"></i>Revenir à la liste
        </button>
      </div>
    </div>

    <form @submit.prevent="submitForm" novalidate>
      <fieldset class="mb-4">
        <legend class="col-form-label-lg">Contact</legend>
        <div class="row">
          <div class="col-md-4">
            <div class="form-floating mb-3">
              <input
                type="text"
                name="firstName"
                id="firstName"
                v-model="client.firstName"
                class="form-control"
                placeholder="Prénom"
                required
                @input="checkField('firstName', /.+/)"
                :class="{ 'is-invalid': !isValid(client.firstName, /.+/) && submitted || !isValid(client.firstName, /.+/) && touched.firstName, 'is-valid': isValid(client.firstName, /.+/) && touched.firstName }"
              />
              <label for="firstName" class="form-label">Prénom</label>
              <div v-if="(!isValid(client.firstName, /.+/) && submitted) || (!isValid(client.firstName, /.+/) && touched.firstName)" class="invalid-feedback">
                Le prénom est requis.
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-floating mb-3">
              <input
                type="text"
                name="lastName"
                id="lastName"
                v-model="client.lastName"
                class="form-control"
                placeholder="Nom"
                required
                @input="checkField('lastName', /.+/)"
                :class="{ 'is-invalid': !isValid(client.lastName, /.+/) && submitted || !isValid(client.lastName, /.+/) && touched.lastName, 'is-valid': isValid(client.lastName, /.+/) && touched.lastName }"
              />
              <label for="lastName" class="form-label">Nom</label>
              <div v-if="(!isValid(client.lastName, /.+/) && submitted) || (!isValid(client.lastName, /.+/) && touched.lastName)" class="invalid-feedback">
                Le nom est requis.
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-floating mb-3">
              <input
                type="date"
                name="createdAt"
                id="createdAt"
                v-model="client.createdAt"
                class="form-control"
                placeholder="Date d'ajout"
                required
                @input="checkField('createdAt', /.+/)"
                :class="{ 'is-invalid': !isValid(client.createdAt, /.+/) && submitted || !isValid(client.createdAt, /.+/) && touched.createdAt, 'is-valid': isValid(client.createdAt, /.+/) && touched.createdAt }"
              />
              <label for="createdAt" class="form-label">Date d'ajout</label>
              <div v-if="(!isValid(client.createdAt, /.+/) && submitted) || (!isValid(client.createdAt, /.+/) && touched.createdAt)" class="invalid-feedback">
                La date d'ajout est requise.
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="form-floating mb-3">
              <input
                type="text"
                name="function"
                id="function"
                v-model="client.function"
                class="form-control"
                placeholder="Fonction"
                required
                @input="checkField('function', /.+/)"
                :class="{ 'is-invalid': !isValid(client.function, /.+/) && submitted || !isValid(client.function, /.+/) && touched.function, 'is-valid': isValid(client.function, /.+/) && touched.function }"
              />
              <label for="function" class="form-label">Fonction</label>
              <div v-if="(!isValid(client.function, /.+/) && submitted) || (!isValid(client.function, /.+/) && touched.function)" class="invalid-feedback">
                La fonction est requise.
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-floating mb-3">
              <input
                type="tel"
                name="phone"
                id="phone"
                v-model="client.phone"
                class="form-control"
                placeholder="Téléphone"
                pattern="^\d{10}$"
                required
                @input="checkField('phone', /^\d{10}$/)"
                :class="{ 'is-invalid': !isValid(client.phone, /^\d{10}$/) && submitted || !isValid(client.phone, /^\d{10}$/) && touched.phone, 'is-valid': isValid(client.phone, /^\d{10}$/) && touched.phone }"
              />
              <label for="phone" class="form-label">Téléphone</label>
              <div v-if="(!isValid(client.phone, /^\d{10}$/) && submitted) || (!isValid(client.phone, /^\d{10}$/) && touched.phone)" class="invalid-feedback">
                Le téléphone est requis et doit contenir 10 chiffres.
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <div class="form-floating mb-3">
              <input
                type="email"
                name="email"
                id="email"
                v-model="client.email"
                class="form-control"
                placeholder="Email"
                required
                @input="checkField('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/)"
                :class="{ 'is-invalid': !isValid(client.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/) && submitted || !isValid(client.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/) && touched.email, 'is-valid': isValid(client.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/) && touched.email }"
              />
              <label for="email" class="form-label">Email</label>
              <div v-if="(!isValid(client.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/) && submitted) || (!isValid(client.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/) && touched.email)" class="invalid-feedback">
                L'email est requis et doit être valide.
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-8">
            <div class="form-floating mb-3">
              <input
                type="text"
                name="companyName"
                id="companyName"
                v-model="client.companyName"
                class="form-control"
                placeholder="Entreprise"
                required
                @input="checkField('companyName', /.+/)"
                :class="{ 'is-invalid': !isValid(client.companyName, /.+/) && submitted || !isValid(client.companyName, /.+/) && touched.companyName, 'is-valid': isValid(client.companyName, /.+/) && touched.companyName }"
              />
              <label for="companyName" class="form-label">Entreprise</label>
              <div v-if="(!isValid(client.companyName, /.+/) && submitted) || (!isValid(client.companyName, /.+/) && touched.companyName)" class="invalid-feedback">
                Le nom de l'entreprise est requis.
              </div>
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend class="col-form-label-lg">Coordonnées</legend>
        <div class="row">
          <div class="col-md-8">
            <div class="form-floating mb-3">
              <input
                type="text"
                name="address1"
                id="address1"
                v-model="client.address1"
                class="form-control"
                placeholder="Adresse 1"
                required
                @input="checkField('address1', /.+/)"
                :class="{ 'is-invalid': !isValid(client.address1, /.+/) && submitted || !isValid(client.address1, /.+/) && touched.address1, 'is-valid': isValid(client.address1, /.+/) && touched.address1 }"
              />
              <label for="address1" class="form-label">Adresse 1</label>
              <div v-if="(!isValid(client.address1, /.+/) && submitted) || (!isValid(client.address1, /.+/) && touched.address1)" class="invalid-feedback">
                L'adresse 1 est requise.
              </div>
            </div>
          </div>
          <div class="col-md-8">
            <div class="form-floating mb-3">
              <input
                type="text"
                name="address2"
                id="address2"
                v-model="client.address2"
                class="form-control"
                placeholder="Adresse 2"
              />
              <label for="address2" class="form-label">Adresse 2</label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="form-floating mb-3">
              <input
                type="text"
                name="zipcode"
                id="zipcode"
                v-model="client.zipcode"
                class="form-control"
                placeholder="Code Postal"
                pattern="^\d{5}$"
                required
                @input="checkField('zipcode', /^\d{5}$/)"
                :class="{ 'is-invalid': !isValid(client.zipcode, /^\d{5}$/) && submitted || !isValid(client.zipcode, /^\d{5}$/) && touched.zipcode, 'is-valid': isValid(client.zipcode, /^\d{5}$/) && touched.zipcode }"
              />
              <label for="zipcode" class="form-label">Code Postal</label>
              <div v-if="(!isValid(client.zipcode, /^\d{5}$/) && submitted) || (!isValid(client.zipcode, /^\d{5}$/) && touched.zipcode)" class="invalid-feedback">
                Le code postal est requis et doit contenir 5 chiffres.
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-floating mb-3">
              <input
                type="text"
                name="city"
                id="city"
                v-model="client.city"
                class="form-control"
                placeholder="Ville"
                required
                @input="checkField('city', /.+/)"
                :class="{ 'is-invalid': !isValid(client.city, /.+/) && submitted || !isValid(client.city, /.+/) && touched.city, 'is-valid': isValid(client.city, /.+/) && touched.city }"
              />
              <label for="city" class="form-label">Ville</label>
              <div v-if="(!isValid(client.city, /.+/) && submitted) || (!isValid(client.city, /.+/) && touched.city)" class="invalid-feedback">
                La ville est requise.
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-4">
            <div class="form-floating mb-3">
              <select
                name="country"
                id="country"
                v-model="client.country"
                class="form-control"
                required
                @input="checkField('country', /.+/)"
                :class="{ 'is-invalid': !isValid(client.country, /.+/) && submitted || !isValid(client.country, /.+/) && touched.country, 'is-valid': isValid(client.country, /.+/) && touched.country }"
              >
                <option value="" disabled>Sélectionnez un pays</option>
                <option value="FRANCE">FRANCE</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="GERMANY">GERMANY</option>
              </select>
              <label for="country" class="form-label">Pays</label>
              <div v-if="(!isValid(client.country, /.+/) && submitted) || (!isValid(client.country, /.+/) && touched.country)" class="invalid-feedback">
                Le pays est requis.
              </div>
            </div>
          </div>
        </div>
      </fieldset>

      <div class="row">
        <div class="col text-end">
          <button type="submit" class="btn btn-outline-primary btn-lg px-5">
            <i class="fa-solid fa-save me-2"></i>Enregistrer
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { useClientStore } from '@/stores/clients.js';
import { mapActions, mapWritableState } from 'pinia';

export default {
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      isNewClient: this.id === '-1',
      submitted: false,
      touched: {
        firstName: false,
        lastName: false,
        createdAt: false,
        function: false,
        phone: false,
        email: false,
        companyName: false,
        address1: false,
        address2: false,
        zipcode: false,
        city: false,
        country: false
      }
    };
  },
  computed: {
    ...mapWritableState(useClientStore, ['client'])
  },
  async mounted() {
    if (!this.isNewClient) {
      await this.getClient(this.id);
    } else {
      this.client = {
        firstName: '',
        lastName: '',
        companyName: '',
        function: '',
        phone: '',
        email: '',
        address1: '',
        address2: '',
        zipcode: '',
        city: '',
        country: '',
        createdAt: this.getCurrentDate()
      };
    }
  },
  methods: {
    ...mapActions(useClientStore, ['getClient', 'addClient', 'updateClient', 'deleteClient']),
    isValid(value, regex) {
      return regex.test(value);
    },
    getCurrentDate() {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
      const yyyy = today.getFullYear();
      return yyyy + '-' + mm + '-' + dd;
    },
    checkField(field, regex) {
      this.touched[field] = true;
      this.isValid(this.client[field], regex);
    },
    async submitForm() {
      this.submitted = true;
      if (
        this.isValid(this.client.firstName, /.+/) &&
        this.isValid(this.client.lastName, /.+/) &&
        this.isValid(this.client.createdAt, /.+/) &&
        this.isValid(this.client.function, /.+/) &&
        this.isValid(this.client.phone, /^\d{10}$/) &&
        this.isValid(this.client.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
        this.isValid(this.client.companyName, /.+/) &&
        this.isValid(this.client.address1, /.+/) &&
        this.isValid(this.client.zipcode, /^\d{5}$/) &&
        this.isValid(this.client.city, /.+/) &&
        this.isValid(this.client.country, /.+/)
      ) {
        if (this.isNewClient) {
          await this.addClient(this.client);
        } else {
          await this.updateClient(this.client);
        }
        this.$router.push({ path: '/clients' });
      }
    },
    goBack() {
      this.$router.push({ path: '/clients' });
    },
    async confirmDelete() {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
        await this.deleteClient(this.client.id);
        this.$router.push({ path: '/clients' });
      }
    }
  }
};
</script>

<style scoped>
fieldset {
  border: none;
  padding: 0;
  margin: 0;
}

legend {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
</style>
