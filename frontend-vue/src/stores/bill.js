import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useBillStore = defineStore('bill', {
  state: () => ({
    bills: [],
    bill: null,
    recentBills: [],
    lastBillNumber: 0
  }),
  getters: {},
  actions: {
    async getAllBills() {
      try {
        const response = await this.$http.get('/bills');
        this.bills = response.data;
        this.recentBills = this.bills.slice(-5);
        this.updateLastBillNumber();
      } catch (error) {
        console.error("Failed to fetch bills:", error);
      }
    },
    async setBill(id) {
      if (id == '-1') {
        this.bill = {
          id: uuidv4(),
          billnum: this.generateNewBillNumber(),
          description: '',
          date: new Date().toISOString().substr(0, 10), // Date du jour
          client: {},
          prestations: [
            {
              description: '',
              qty: 1,
              price: 600.0
            }
          ],
          discount: 0,
          paid: 0,
          totalHT: 0,
          tva: 20,
          totalTTC: 0
        };
      } else {
        const response = await this.$http.get('/bills/' + id);
        this.bill = response.data;
      }
    },
    async onUpdateBill(bill) {
      const response = await this.$http.patch('/bills/' + bill.id, bill);
      console.log(response.data);
      this.bill = null;
      await this.getAllBills();
    },
    async onCreateBill(bill) {
      const response = await this.$http.post('/bills', bill);
      console.log(response.data);
      this.bill = null;
      await this.getAllBills();
    },
    async onDeleteBill(bill) {
      const response = await this.$http.delete('/bills/' + bill.id);
      console.log(response.data);
      await this.getAllBills();
    },
    generateNewBillNumber() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      this.lastBillNumber++;
      return `${year}-${month}-${String(this.lastBillNumber).padStart(5, '0')}`;
    },
    updateLastBillNumber() {
      if (this.bills.length > 0) {
        const lastBill = this.bills[this.bills.length - 1];
        const lastBillNum = parseInt(lastBill.billnum.split('-')[2], 10);
        this.lastBillNumber = lastBillNum;
      }
    },
    checkBillnumExists(billnum) {
      return this.bills.some(b => b.billnum === billnum);
    }
  }
});
