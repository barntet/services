const { Router } = require("express");
const shopController = require("./shop");
const ChaosController = require('./chaos');
const HealthController = require('./health');

module.exports = async function initControllers() {
  const router = Router();
  router.use("/api/shop", await shopController());
  router.use('/api/chaos', await ChaosController());
  router.use('/api/health', await HealthController());
  return router;
};
