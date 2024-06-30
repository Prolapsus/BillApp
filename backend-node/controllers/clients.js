const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');

module.exports = {
  getAll: (req, res) => {
    try {
      const data = fs.readFileSync(path.resolve(__dirname, '../db/clients.json'));
      res.send(data);
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  },

  getOne: (req, res) => {
    try {
      const data = fs.readFileSync(path.resolve(__dirname, '../db/clients.json'));
      const clients = JSON.parse(data);
      const id = req.params.id;
      const client = clients.find(client => client.id == id);
      if (client) {
        res.json(client);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  },

  postOne: (req, res) => {
    try {
      const data = fs.readFileSync(path.resolve(__dirname, '../db/clients.json'));
      const clients = JSON.parse(data);
      const newClient = { ...req.body, id: uuid() };
      clients.push(newClient);
      fs.writeFileSync(path.resolve(__dirname, '../db/clients.json'), JSON.stringify(clients));
      res.json(newClient);
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  },

  patchOne: (req, res) => {
    try {
      const data = fs.readFileSync(path.resolve(__dirname, '../db/clients.json'));
      let clients = JSON.parse(data);
      const id = req.params.id;
      let updatedClient = clients.find(client => client.id == id);
      let updatedClientIndex = clients.findIndex(client => client.id == id);
      if (updatedClient) {
        updatedClient = { ...updatedClient, ...req.body };
        clients[updatedClientIndex] = { ...updatedClient };
      } else {
        res.sendStatus(404);
        return;
      }
      fs.writeFileSync(path.resolve(__dirname, '../db/clients.json'), JSON.stringify(clients));
      res.json(updatedClient);
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  },

  deleteOne: (req, res) => {
    try {
      const data = fs.readFileSync(path.resolve(__dirname, '../db/clients.json'));
      let clients = JSON.parse(data);
      const id = req.params.id;
      clients = clients.filter(client => client.id != id);
      fs.writeFileSync(path.resolve(__dirname, '../db/clients.json'), JSON.stringify(clients));
      res.sendStatus(200);
    } catch (err) {
      res.sendStatus(500);
      throw err;
    }
  }
};
