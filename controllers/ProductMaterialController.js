const {
  ProductMaterial, ProductOrder, Material, Brand, Shopping, Admin, sequelize
} = require('../models');
const formatNumberInput = require('../helpers/formatNumberInput');
const {
  getValue, chainOrderUpdate, findByPk, patchProperty, changeOrderIndex, error404
} = require('../helpers/controllerHelpers');
const materialCostQuery = '"unitCost" * "quantity"';

class ProductMaterialController {
  static async register(req, res, next) {
    try {
      let data;
      await sequelize.transaction(async (t) => {
        const ProductOrderId = formatNumberInput(req.body.ProductOrderId);
        const OrderId = formatNumberInput(req.body.OrderId);
        const newProductMaterial = {
          size: req.body.size,
          thickness: req.body.thickness,
          unitCost: formatNumberInput(req.body.unitCost),
          quantity: formatNumberInput(req.body.quantity),
          ProductOrderId,
          MaterialId: formatNumberInput(req.body.MaterialId),
          BrandId: formatNumberInput(req.body.BrandId),
          AdminId: req.loggedInUser.id
        };
        data = await ProductMaterial.create(newProductMaterial, { transaction: t });
        const materialCostQueryObj = {
          query: materialCostQuery,
          tableName: 'ProductMaterials',
          idname: 'ProductOrderId',
          id: ProductOrderId
        };
        const materialCost = await getValue(materialCostQueryObj, t);
        await patchProperty({ materialCost }, ProductOrderId, ProductOrder, t);
        await chainOrderUpdate(OrderId, 'ProductMaterial', null, t);
        await patchProperty({ orderIndex: data.id }, data.id, ProductMaterial, t);
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
        data = await ProductMaterial.findByPk(id, {
          attributes: [
            'id', 'size', 'thickness', 'unitCost',
            'quantity', 'orderIndex', 'createdAt', 'updatedAt'
          ],
          include: [
            {
              model: Material,
              attributes: ['id', 'name']
            },
            {
              model: Brand,
              attributes: ['id', 'name']
            },
            {
              model: ProductOrder,
              attributes: ['id']
            },
            {
              model: Shopping,
              attributes: ['id', 'title']
            },
            {
              model: Admin,
              attributes: ['id', 'firstName', 'lastName']
            }
          ],
          transaction: t
        });
        if (!data) {
          throw error404('ProductMaterial');
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
        const ProductOrderId = formatNumberInput(req.body.ProductOrderId);
        const OrderId = formatNumberInput(req.body.OrderId);
        const unitCost =  formatNumberInput(req.body.unitCost);
        const quantity =  formatNumberInput(req.body.quantity);
        const {
          unitCost: prevUnitCost, quantity: prevQuantity
        } = await findByPk(ProductMaterial, id, ['unitCost', 'quantity'], t);
        const prevMaterialCost = prevUnitCost * prevQuantity;
        const currentMaterialCost = unitCost * quantity ;
        const updatedProductMaterial = {
          size: req.body.size,
          thickness: req.body.thickness,
          unitCost,
          quantity,
          ProductOrderId,
          MaterialId: formatNumberInput(req.body.MaterialId),
          BrandId: formatNumberInput(req.body.BrandId),
          ShoppingId: formatNumberInput(req.body.ShoppingId),
          orderIndex: formatNumberInput(req.body.orderIndex),
          AdminId: req.loggedInUser.id
        };
        const data = await ProductMaterial.update(updatedProductMaterial, {
          where: {
            id
          },
          returning: true,
          transaction: t
        });
        if (prevMaterialCost !== currentMaterialCost) {
          const materialCostQueryObj = {
            query: materialCostQuery,
            tableName: 'ProductMaterials',
            idname: 'ProductOrderId',
            id: ProductOrderId
          }
          const materialCost = await getValue(materialCostQueryObj, t);
          await patchProperty({ materialCost }, ProductOrderId, ProductOrder, t);
          await chainOrderUpdate(OrderId, 'ProductMaterial', null, t);
        }
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
          idname: 'ProductOrderId',
          id: formatNumberInput(req.body.id)
        }
        patchedData = await changeOrderIndex(dataObj, ProductMaterial, t);
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
        const productMaterial = await ProductMaterial.findByPk(id, {
          attributes: ['ProductOrderId'],
          include: {
            model: ProductOrder,
            attributes:['OrderId']
          },
          transaction: t
        });
        if (!productMaterial) {
          throw error404('ProductMaterial');
        }
        const ProductOrderId = productMaterial.ProductOrderId;
        const OrderId = productMaterial.ProductOrder.OrderId;
        await ProductMaterial.destroy({
          where: {
            id
          },
          transaction: t
        });
        const materialCostQueryObj = {
          query: materialCostQuery,
          tableName: 'ProductMaterials',
          idname: 'ProductOrderId',
          id: ProductOrderId
        }
        const materialCost = await getValue(materialCostQueryObj, t);
        await patchProperty({ materialCost }, ProductOrderId, ProductOrder, t);
        await chainOrderUpdate(OrderId, 'ProductMaterial', null, t);
      });
      res.status(200).json({ message: 'Deleted from database' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProductMaterialController;
