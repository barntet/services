const { Router } = require("express");
const bodyParser = require('body-parser');
const ShopService = require("../services/shop");
const { createShopFormSchema } = require('../moulds/ShopForm');
const callbackcatch = require('../utils/CallbackCatch');
const CallbackCatch = require("../utils/CallbackCatch");

class ShopController {
  ShopService;

  async init() {
    this.ShopService = await ShopService();

    const router = Router();
    router.get("/", this.getAll);
    router.get("/:shopId", this.getOne);
    router.put("/:shopId", this.put);
    router.delete("/:shopId", this.delete);
    router.post('/', bodyParser.urlencoded({ extended: false }), this.post);
    return router;
  }

  getAll = callbackcatch(async (req, res) => {
    const { pageIndex, pageSize } = req.query;
    const shopList = await this.ShopService.find({ pageIndex, pageSize });

    res.send({ success: true, data: shopList });
  });

  getOne = callbackcatch(async (req, res) => {
    const { shopId } = req.params;
    const shopList = await this.ShopService.find({ id: shopId });

    if (shopList.length) {
      res.send({ success: true, data: shopList[0] });
    } else {
      res.status(404).send({ success: false, data: null });
    }
  });

  put = callbackcatch(async (req, res) => {
    const { shopId } = req.params;
    const { name } = req.query;

    try {
      await createShopFormSchema().validate({ name });
    } catch (e) {
      res.status(400).send({ success: false, message: e.message });
      return;
    }
    const shopInfo = await this.ShopService.modify({
      id: shopId,
      values: { name },
    });

    if (shopInfo) {
      res.send({ success: true, data: shopInfo });
    } else {
      res.status(404).send({ success: false, data: null });
    }
  });

  delete = callbackcatch(async (req, res) => {
    const { shopId } = req.params;
    const success = await this.ShopService.remove({ id: shopId });

    if (!success) {
      res.status(404);
    }
    res.send({ success });
  });

  post = callbackcatch(async (req, res) => {
    const { name } = req.body;

    try {
      await createShopFormSchema().validate({ name });
    } catch (e) {
      res.status(400).send({ success: false, message: e.message });
      return;
    }

    const shopInfo = await this.ShopService.create({ values: { name } });

    res.send({ success: true, data: shopInfo })
  })
}

module.exports = async () => {
  const control = new ShopController();
  return await control.init();
};
