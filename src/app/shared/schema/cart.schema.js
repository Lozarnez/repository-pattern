const joi = require('joi');

const productInCartSchema = joi
  .object({
    instanceId: joi.number().required(),
    code: joi.string().required(),
    size: joi.string().required(),
    sku: joi.string().required(),
    quantity: joi.number().required(),
  })
  .strict();

const historyCartSchema = joi.object({
  action: joi.string().required(),
  product: productInCartSchema,
  date: joi.date().required(),
});

const cartSchema = joi.object({
  userId: joi.number().required(),
  products: joi.array().items(productInCartSchema).required(),
  history: joi.array().items(historyCartSchema).required(),
  status: joi.boolean().required(),
});

module.exports = {
  productInCartSchema,
  historyCartSchema,
  cartSchema,
};
