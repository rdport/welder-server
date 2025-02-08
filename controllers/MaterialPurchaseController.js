const {
  MaterialPurchase, Material, Brand, Stock, Purchase, Supplier, Admin, sequelize
} = require('../models');
const {
  getValue, findByPk, patchProperty, changeOrderIndex, error404
} = require('../helpers/controllerHelpers');
const formatNumberInput = require('../helpers/formatNumberInput');
const purchaseValueQuery = '"unitPrice" * "quantity"';

class MaterialPurchaseController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const size = req.body.size;
        const thickness = req.body.thickness;
        const quantity = formatNumberInput(req.body.quantity);
        const MaterialId = formatNumberInput(req.body.MaterialId);
        const BrandId = formatNumberInput(req.body.BrandId);
        const PurchaseId = formatNumberInput(req.body.PurchaseId);
        const [stock, created] = await Stock.findOrCreate({
          where: {
            MaterialId,
            BrandId,
            size,
            thickness,
          },
          defaults: { quantity, notes: '' },
          transaction: t
        });
        const StockId = stock.id;
        if (!created) {
          await patchProperty({ quantity: stock.quantity + quantity }, StockId, Stock, t);
        }
        const newMaterialPurchase = {
          size,
          correctedSize: req.body.correctedSize,
          thickness,
          correctedThickness: req.body.correctedThickness,
          unitPrice: formatNumberInput(req.body.unitPrice),
          quantity,
          MaterialId,
          BrandId,
          PurchaseId,
          StockId,
          AdminId: req.loggedInUser.id
        };
        data = await MaterialPurchase.create(newMaterialPurchase, { transaction: t });
        const queryObj = {
          query: purchaseValueQuery,
          tableName: 'MaterialPurchases',
          idname: 'PurchaseId',
          id: PurchaseId
        };
        const purchaseValue = await getValue(queryObj, t);
        await patchProperty({ purchaseValue }, PurchaseId, Purchase, t);
        await patchProperty({ orderIndex: data.id }, data.id, MaterialPurchase, t);
      });
      res.status(201).json({ id: data.id, MaterialId: data.MaterialId });
    } catch (err) {
      next(err);
    }
  }

  static showAll(req, res, next) {
    res.status(200).json(res.results);
  }

  static async findByPk(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        data = await MaterialPurchase.findByPk(id, {
          attributes: [
            'id', 'size', 'correctedSize',
            'thickness', 'correctedThickness', 'unitPrice',
            'quantity', 'orderIndex', 'createdAt', 'updatedAt'
          ],
          include: [
            {
              model: Purchase,
              attributes: ['id', 'date'],
              include: [
                {
                  model: Supplier,
                  attributes: ['id', 'name']
                }
              ]
            },
            {
              model: Material,
              attributes: ['id', 'name']
            },
            {
              model: Brand,
              attributes: ['id', 'name']
            },
            {
              model: Stock,
              attributes: ['id', 'quantity']
            },
            {
              model: Admin,
              attributes: ['id', 'firstName', 'lastName']
            }
          ],
          transaction: t
        });
        if (!data) {
          throw error404('MaterialPurchase');
        }
      });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  static async edit(req, res, next) {
    try {
      let editedData;
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        const PurchaseId = formatNumberInput(req.body.PurchaseId);
        const unitPrice = formatNumberInput(req.body.unitPrice);
        const quantity = formatNumberInput(req.body.quantity);
        const MaterialId = formatNumberInput(req.body.MaterialId);
        const BrandId = formatNumberInput(req.body.BrandId);
        const size = req.body.size;
        const thickness = req.body.thickness;
        const {
          unitPrice: prevUnitPrice,
          quantity: prevQuantity,
          MaterialId: prevMaterialId,
          BrandId: prevBrandId,
          size: prevSize,
          thickness: prevThickness,
          StockId
        } = await findByPk(
          MaterialPurchase, id,
          ['unitPrice', 'quantity', 'MaterialId', 'BrandId','size', 'thickness', 'StockId'],t
        );
        const prevMaterialValue = prevUnitPrice * prevQuantity;
        const currentMaterialValue = unitPrice * quantity;
        const updatedMaterialPurchase = {
          size,
          correctedSize: req.body.correctedSize,
          thickness,
          correctedThickness: req.body.correctedThickness,
          unitPrice,
          quantity,
          MaterialId,
          BrandId,
          PurchaseId,
          StockId,
          orderIndex: formatNumberInput(req.body.orderIndex),
          AdminId: req.loggedInUser.id
        };
        console.log(updatedMaterialPurchase, '<<<<<<<<<<<<<<<<<<<<<');
        console.log({
          prevMaterialId,
          prevBrandId,
          prevSize,
          prevThickness,
          prevQuantity
        })

        if (prevMaterialValue !== currentMaterialValue) {
          const queryObj = {
            query: purchaseValueQuery,
            tableName: 'MaterialPurchases',
            idname: 'PurchaseId',
            id: PurchaseId
          }
          const purchaseValue = await getValue(queryObj, t);
          await patchProperty({ purchaseValue }, PurchaseId, Purchase, t);
        }
        if (
          prevMaterialId !== MaterialId
          || prevBrandId !== BrandId
          || prevSize !== size
          || prevThickness !== thickness
          || prevQuantity !== quantity
        ) {
          const { quantity: prevStockQuantity } = await findByPk(Stock, StockId, ['quantity'], t);
          if (
            prevMaterialId !== MaterialId
            || prevBrandId !== BrandId
            || prevSize !== size
            || prevThickness !== thickness
          ) {
            const [stock, created] = await Stock.findOrCreate({
              where: {
                MaterialId,
                BrandId,
                size,
                thickness
              },
              defaults: { quantity, notes: '' },
              transaction: t
            });
            updatedMaterialPurchase.StockId = stock.id;
            if (!created) {
              await patchProperty({ quantity: stock.quantity + quantity }, stock.id, Stock, t);
            }
            await patchProperty({ quantity: prevStockQuantity - prevQuantity }, StockId, Stock, t);
          }
          if (
            prevQuantity !== quantity
            && prevMaterialId === MaterialId
            && prevBrandId === BrandId
            && prevSize === size
            && prevThickness === thickness
          ) {
            await patchProperty(
              { quantity: prevStockQuantity - prevQuantity + quantity }, StockId, Stock, t
            );
          }
        }

        const data = await MaterialPurchase.update(updatedMaterialPurchase, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        editedData = data[1][0];
      });
      res.status(200).json({ id: editedData.id, MaterialId: editedData.MaterialId });
    } catch (err) {
      next(err);
    }
  }

  static async rearrange(req, res, next) {
    try {
      let patchedData;
      await sequelize.transaction(async (t) => {
        const dataObj = {
          pk: +req.params.id,
          sourceIndex: formatNumberInput(req.body.sourceIndex),
          destinationIndex: formatNumberInput(req.body.destinationIndex),
          idname: 'PurchaseId',
          id: formatNumberInput(req.body.id)
        }
        patchedData = await changeOrderIndex(dataObj, MaterialPurchase, t);
      });
      res.status(200).json({ id: patchedData.id, MaterialId: patchedData.MaterialId });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await sequelize.transaction(async (t) => {
        const id = +req.params.id;
        const materialPurchase = await findByPk(
          MaterialPurchase, id, ['PurchaseId', 'StockId', 'quantity'], t
        );
        const StockId = materialPurchase.StockId;
        const quantity = materialPurchase.quantity;
        const PurchaseId = materialPurchase.PurchaseId;
        const stock = await findByPk(Stock, StockId, ['id', 'quantity'], t);
        await MaterialPurchase.destroy({
          where: {
            id
          },
          transaction: t
        });
        const queryObj = {
          query: purchaseValueQuery,
          tableName: 'MaterialPurchases',
          idname: 'PurchaseId',
          id: PurchaseId
        };
        const purchaseValue = await getValue(queryObj, t);
        await patchProperty({ purchaseValue }, PurchaseId, Purchase, t);
        await patchProperty({ quantity: stock.quantity - quantity }, StockId, Stock, t);
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = MaterialPurchaseController;
