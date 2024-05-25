const db = require("../models");
const Product = db.product;
// const Op = db.Sequelize.Op;

// Add new product
exports.create = (req, res) => {
  console.log("Запрос : ", req.body)
  validateRequest(req);

  const product = {
    name: req.body.name,
    price: req.body.price,
    isDeleted: req.body.isDeleted ? req.body.isDeleted : false
  };

  Product.create(product)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ошибка добавления объекта"
      });
    });
};

// Find all products
exports.findAll = (req, res) => {
  Product.findAll({ where: {isDeleted: false} })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Ошибка получения объектов"
      });
    });
};

// Find product by product id
exports.findOne = (req, res) => {
  console.log("Запрос : ", req.body)
  validateRequest(req);

  const id = req.body.id;
  Product.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: "Объект не найден"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Ошибка получения объекта : " + id
      });
    });
};

// Update product by product id
exports.update = (req, res) => {
  console.log("Request : ", req.body)
  validateRequest(req);

  const id = req.body.id;
  Product.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Объект обновлен."
        });
      } else {
        res.send({
          message: "Ошибка обновление объекта"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Ошибка обновления объекта : " + id
      });
    });
};

// Delete product by product id
exports.delete = (req, res) => {
  console.log("Запрос : ", req.body)
  validateRequest(req);
  
  const id = req.body.id;
  Product.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Успешное удаление"
        });
      } else {
        res.send({
          message: "Ошибка удаления"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Невозможно удалить объект : " + id
      });
    });
};

function validateRequest(req){
  if (!req.body) {
    res.status(400).send({
      message: "Пустой запрос"
    });
    return;
  }
}


