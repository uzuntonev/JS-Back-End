const uuid = require('uuid');
const fs = require('fs');
const path = require('path');

class CubeModel {
  constructor() {
    this.data = require('../config/database.json');
  }

  _write(newData, resolveData) {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        path.resolve('config/database.json'),
        JSON.stringify(newData, null, 2),
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          this.data = newData;
          resolve(resolveData);
        }
      );
    });
  }

  get(id) {
    const cube = this.data.entities.find((c) => c.id === id);
    if (!cube) {
      return;
    }
    return Promise.resolve(cube);
  }
  getAll() {
    return Promise.resolve(this.data.entities);
  }
  create(newCube) {
    const id = uuid.v4();
    Object.assign(newCube, { id });
    const newData = {
      entities: this.data.entities.concat(newCube),
    };

    return this._write(newData, newCube);
  }

  update(id, updates) {
    const updatedCube = this.data.entities.find(({ id: i }) => i === id);
    if (updatedCube) {
      Object.assign(updatedCube, updates);
      const idx = this.data.entities.findIndex(({ id: i }) => i === id);
      const newData = {
        entities: [
          ...this.data.entities.slice(0, idx),
          updatedCube,
          ...this.data.entities.slice(idx + 1),
        ],
      };
      return this._write(newData, updatedCube);
    }
  }

  delete(id) {
    const deletedCube = this.get(id);
    const newData = {
      entities: this.data.entities.filter(({ id: i }) => i !== id),
    };

    return this._write(newData, deletedCube);
  }

  find(pred) {
    return Promise.resolve(this.data.entities.filter(pred));
  }
}

module.exports = new CubeModel();
