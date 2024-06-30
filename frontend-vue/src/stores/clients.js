import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useClientStore = defineStore('clients', {
  state: () => ({
    clients: [],
    client: null,
    recentClients: []
  }),
  getters: {
    getClientById: (state) => (id) => {
      return state.clients.find(client => client.id === id);
    }
  },
  actions: {
    async getAllClients() {
      try {
        const response = await this.$http.get('/clients');
        this.clients = response.data;
        this.recentClients = this.clients.slice(-5);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      }
    },
    async getClient(id) {
      try {
        const response = await this.$http.get(`/clients/${id}`);
        this.client = response.data;
      } catch (error) {
        console.error(`Failed to fetch client with id ${id}:`, error);
      }
    },
    async addClient(client) {
      try {
        const newClient = {
          ...client,
          id: uuidv4(),
          createdAt: new Date().toISOString().split('T')[0] // Ajouter la date d'ajout
        };
        const response = await this.$http.post('/clients', newClient);
        this.clients.push(response.data);
        this.recentClients = this.clients.slice(-5); // Mettre à jour les clients récents
      } catch (error) {
        console.error("Failed to add client:", error);
      }
    },
    async updateClient(client) {
      try {
        const response = await this.$http.patch(`/clients/${client.id}`, client);
        const index = this.clients.findIndex(c => c.id === client.id);
        if (index !== -1) {
          this.clients.splice(index, 1, response.data);
          this.recentClients = this.clients.slice(-5); // Mettre à jour les clients récents
        }
      } catch (error) {
        console.error(`Failed to update client with id ${client.id}:`, error);
      }
    },
    async deleteClient(id) {
      try {
        await this.$http.delete(`/clients/${id}`);
        this.clients = this.clients.filter(client => client.id !== id);
        this.recentClients = this.clients.slice(-5); // Mettre à jour les clients récents
      } catch (error) {
        console.error(`Failed to delete client with id ${id}:`, error);
      }
    }
  }
});
