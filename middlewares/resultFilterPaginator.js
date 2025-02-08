const models = require('../models');
const { sequelize, Sequelize } = models;
const Op = models.Sequelize.Op;
const getKeySearchCondition = require('../helpers/getKeySearchCondition');

function resultsFilterPaginator(modelName) {
  return async (req, res, next) => {
    try {
      await sequelize.transaction(async (t) => {
        const exceptions = [
          {
            modelName: 'AccountTransaction',
            keys: ['account_name', 'account_code', 'transaction_title', 'transaction_date']
          },
          {
            modelName: 'Admin',
            keys: ['name']
          },
          {
            modelName: 'Assignment',
            keys: ['employee_name', 'product-order_product_name']
          },
          {
            modelName: 'Brand',
            keys: ['brand-category_category']
          },
          {
            modelName: 'Customer',
            keys: ['name']
          },
          {
            modelName: 'Employee',
            keys: ['name']
          },
          {
            modelName: 'GeneralTransaction',
            keys: ['datebook_date', 'referenceCode']
          },
          {
            modelName: 'InternalTransaction',
            keys: ['employee_name', 'referenceCode']
          },
          {
            modelName: 'MaterialPurchase',
            keys: ['purchase_date', 'purchase_supplier_name', 'material_name', 'brand_name']
          },
          {
            modelName: 'Order',
            keys: ['customer_name', 'referenceCode']
          },
          {
            modelName: 'Payment',
            keys: ['order_customer_name', 'order_referenceCode', 'referenceCode']
          },
          {
            modelName: 'ProductMaterial',
            keys: ['material_name', 'brand_name', 'shopping_title']
          },
          {
            modelName: 'ProductOrder',
            keys: ['order_customer_name', 'product_name']
          },
          {
            modelName: 'Purchase',
            keys: ['division_name', 'referenceCode', 'supplier_name']
          },
          {
            modelName: 'Size',
            keys: ['size-category_category']
          },
          {
            modelName: 'Stock',
            keys: ['material_name', 'brand_name']
          },
          {
            modelName: 'StockEmployee',
            keys: ['stock_size', 'stock_thickness', 'stock_material_name', 'employee_name']
          },
          {
            modelName: 'Token',
            keys: ['admin_name']
          },
          {
            modelName: 'Transaction',
            keys: ['referenceCode', 'reference_category']
          }
        ]
        const queryObj = {};
        queryObj.where = {
          [Op.and]: []
        };
        queryObj.transaction = t;
        const order = req.query.order;
        const orderBy = req.query.orderBy;
        const key = req.query.key;
        const term = req.query.term;
        const dateQuery = {};
        if (req.query.year) {
          dateQuery.year = req.query.year;
        }
        if (req.query.month) {
          dateQuery.month = req.query.month;
        }
        if (req.query.day) {
          dateQuery.day = req.query.day;
        }

        if (key) {
          if (!exceptions.some(e => e.modelName === modelName && e.keys.includes(key))) {
            queryObj.where[Op.and].push(getKeySearchCondition(
              modelName, 'default', key, term, dateQuery
            ));
          }
        }

        switch (modelName) {
          case 'Account':
            queryObj.attributes = ['id', 'name', 'code', 'category', 'normally'];
            queryObj.order = [[orderBy || 'code', order || 'ASC']];
            break;

          case 'AccountTransaction':
            queryObj.attributes = ['id', 'value', 'entry', 'orderIndex'];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            queryObj.include = [
              {
                model: models.Account,
                attributes: ['id', 'name', 'code']
              },
              {
                model: models.Transaction,
                attributes: ['id', 'title', 'date']
              }
            ];
            if (key && !queryObj.where.attribute) {
              if (key === 'account_name' || key === 'account_code') {
                queryObj.include[0].where = getKeySearchCondition('Account', 'default', key, term);
              } else if (key === 'transaction_title' || key === 'transaction_date') {
                queryObj.include[1].where = getKeySearchCondition(
                  'Transaction', 'default', key, term, dateQuery
                );
              }
            }
            break;

          case 'Admin':
            queryObj.attributes = ['id', 'firstName', 'lastName', 'class'];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            if (key && !queryObj.where.attribute) {
              if (key === 'name') {
                queryObj.where[Op.and].push(getKeySearchCondition(
                  modelName, 'fullName', key, term
                ));
              }
            }
            break;

          case 'Assignment':
            queryObj.attributes = ['id', 'notes'];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            queryObj.include = [
              {
                model: models.Employee,
                attributes: ['id', 'firstName', 'lastName']
              },
              {
                model: models.ProductOrder,
                attributes: ['id'],
                include: [
                  {
                    model: models.Product,
                    attributes: ['id', 'name']
                  }
                ],
                required: true
              }
            ];
            if (key && !queryObj.where.attribute) {
              if (key === 'employee_name') {
                queryObj.include[0].where = getKeySearchCondition(
                  'Employee', 'fullName', key, term
                );
              } else if (key === 'product-order_product_name') {
                queryObj.include[1].include[0].where = getKeySearchCondition(
                  '"ProductOrder"."Product"', 'default', key, term
                );
              }
            }
            break;

          case 'Brand':
            queryObj.attributes = ['id', 'name', 'orderIndex'];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            queryObj.include = [
              {
                model: models.BrandCategory,
                attributes: ['id', 'category']
              }
            ];
            if (key && !queryObj.where.attribute) {
              if (key === 'brand-category_category') {
                queryObj.include[0].where = getKeySearchCondition(
                  'BrandCategory', 'default', key, term
                );
              }
            }
            break;
          
          case 'BrandCategory':
            queryObj.attributes = ['id', 'category'];
            queryObj.order = [
              [orderBy || Sequelize.fn('lower', Sequelize.col('category')), order || 'ASC']
            ];
            break;
        
          case 'Customer':
            queryObj.attributes = ['id', 'firstName', 'lastName', 'address'];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            if (key && !queryObj.where.attribute) {
              if (key === 'name') {
                queryObj.where[Op.and].push(getKeySearchCondition(
                  modelName, 'fullName', key, term
                ));
              }
            }
            break;

          case 'Datebook':
            queryObj.attributes = ['id', 'date'];
            queryObj.order = [[orderBy || 'date', order || 'DESC']];
            break;
          
          case 'Division':
            queryObj.attributes = ['id', 'name'];
            queryObj.order = [[orderBy || 'name', order || 'ASC']];
            break;
          
          case 'Employee':
            queryObj.attributes = ['id', 'firstName', 'lastName', 'position'];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            if (key && !queryObj.where.attribute) {
              if (key === 'name') {
                queryObj.where[Op.and].push(getKeySearchCondition(
                  modelName, 'fullName', key, term
                ));
              }
            }
            break;
          
          case 'GeneralTransaction':
            queryObj.attributes = ['id', 'title', 'value', 'reportStatus', 'orderIndex'];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            queryObj.include = [
              {
                model: models.Datebook,
                attributes: ['id', 'date']
              },
              {
                model: models.Reference,
                attributes: ['id', 'code']
              }
            ];
            if (key && !queryObj.where.attribute) {
              if (key === 'datebook_date') {
                queryObj.include[0].where = getKeySearchCondition(
                  'Datebook', 'default', key, term, dateQuery
                );
              } else if (key === 'referenceCode') {
                queryObj.include[1].where = getKeySearchCondition(
                  'Reference', 'default', key, term
                );
              }
            }
            break;
          
          case 'InternalTransaction':
            queryObj.attributes = ['id', 'title', 'date', 'value', 'reportStatus'];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            queryObj.include = [
              {
                model: models.Employee,
                attributes: ['id', 'firstName', 'lastName']
              },
              {
                model: models.Reference,
                attributes: ['id', 'code']
              }
            ];
            if (key && !queryObj.where.attribute) {
              if (key === 'employee_name') {
                queryObj.include[0].where = getKeySearchCondition(
                  'Employee', 'fullName', key, term
                );
              } else if (key === 'referenceCode') {
                queryObj.include[1].where = getKeySearchCondition(
                  'Reference', 'default', key, term
                );
              }
            }
            break;
          
          case 'Material':
            queryObj.attributes = ['id', 'name', 'orderIndex'];
            queryObj.order = [[orderBy || 'name', order || 'ASC']];
            break;
          
          case 'MaterialPurchase':
            queryObj.attributes = [
              'id', 'size', 'correctedSize',
              'thickness', 'correctedThickness', 'unitPrice',
              'quantity', 'orderIndex'
            ];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            queryObj.include = [
              {
                model: models.Purchase,
                attributes: ['id', 'date'],
                include: [
                  {
                    model: models.Supplier,
                    attributes: ['id', 'name'] 
                  }
                ],
                required: true
              },
              {
                model: models.Material,
                attributes: ['id', 'name']
              },
              {
                model: models.Brand,
                attributes: ['id', 'name']
              }
            ];
            if (key && !queryObj.where.attribute) {
              if (key === 'purchase_date') {
                 queryObj.include[0].where = getKeySearchCondition(
                   'Purchase', 'default', key, term, dateQuery
                  );
               } else if (key === 'purchase_supplier_name') {
                 queryObj.include[0].include[0].where = getKeySearchCondition(
                   '"Purchase"."Supplier"', 'default', key, term
                  );
               } else if (key === 'material_name') {
                queryObj.include[1].where = getKeySearchCondition(
                  'Material', 'default', key, term
                );
               } else if (key === 'brand_name') {
                queryObj.include[2].where = getKeySearchCondition(
                  'Brand', 'default', key, term
                );
               }
             }
            break;
            
          case 'Order':
            queryObj.attributes = [
              'id', 'orderValue', 'confirmedOrderValue', 'projectStatus',
              'paymentType', 'paymentStatus'
            ];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            queryObj.include = [
              {
                model: models.Customer,
                attributes: ['id', 'firstName', 'lastName']
              },
              {
                model: models.Reference,
                attributes: ['id', 'code']
              }
            ];
            if (key && !queryObj.where.attribute) {
              if (key === 'customer_name') {
                queryObj.include[0].where = getKeySearchCondition(
                  'Customer', 'fullName', key, term
                );
              } else if (key === 'referenceCode') {
                queryObj.include[1].where = getKeySearchCondition(
                  'Reference', 'default', key, term
                );
              }
            }
            break;
          
          case 'Payment':
            queryObj.attributes = ['id', 'title', 'date', 'paymentValue', 'reportStatus'];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            queryObj.include = [
              {
                model: models.Order,
                attributes: ['id'],
                include: [
                  {
                    model: models.Customer,
                    attributes: ['id', 'firstName', 'lastName']
                  },
                  {
                    model: models.Reference,
                    attributes: ['id', 'code']
                  }
                ],
                required: true
              },
              {
                model: models.Reference,
                attributes: ['id', 'code']
              }
            ];
            if (key && !queryObj.where.attribute) {
              if (key === 'order_customer_name') {
                queryObj.include[0].include[0].where = getKeySearchCondition(
                  'Customer', 'fullName', key, term
                );
              } else if (key === 'order_referenceCode') {
                queryObj.include[0].include[1].where = getKeySearchCondition(
                  '"Order"."Reference"', 'default', key, term
                );
              } else if (key === 'referenceCode') {
                queryObj.include[1].where = getKeySearchCondition(
                  'Reference', 'default', key, term
                );
              }
            }
            break;
          
          case 'Position':
            queryObj.attributes = ['id', 'name'];
            queryObj.order = [[orderBy || 'name', order || 'ASC']];
            break;

          case 'Product':
            queryObj.attributes = ['id', 'name', 'description', 'orderIndex'];
            queryObj.order = [[orderBy || 'name', order || 'ASC']];
            break;
          
          case 'ProductMaterial':
            queryObj.attributes = ['id', 'size', 'thickness', 'unitCost', 'quantity', 'orderIndex'];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            queryObj.include = [
              {
                model: models.Material,
                attributes: ['id', 'name']
              },
              {
                model: models.Brand,
                attributes: ['id', 'name']
              },
              {
                model: models.ProductOrder,
                attributes: ['id']
              },
              {
                model: models.Shopping,
                attributes: ['id', 'title']
              }
            ];
            if (key && !queryObj.where.attribute) {
              if (key === 'material_name') {
                queryObj.include[0].where = getKeySearchCondition(
                  'Material', 'default', key, term
                );
              } else if (key === 'brand_name') {
                queryObj.include[1].where = getKeySearchCondition(
                  'Brand', 'default', key, term
                );
              } else if (key === 'shopping_title') {
                queryObj.include[3].where = getKeySearchCondition(
                  'Shopping', 'default', key, term
                );
              }
            }
            break;
          
          case 'ProductOrder':
            queryObj.attributes = [
              'id', 'surveyDate', 'startDate', 'endDate', 'quantity',
              'area', 'unitPrice', 'materialCost', 'laborCost', 'electricityCost',
              'otherCost', 'commissionRate', 'productionStatus', 'orderIndex'
            ];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            queryObj.include = [
              {
                model: models.Order,
                attributes: ['id'],
                include: [
                  {
                    model: models.Customer,
                    attributes: ['id', 'firstName', 'lastName']
                  }
                ],
                required: true
              },
              {
                model: models.Product,
                attributes: ['id', 'name']
              }
            ];
            if (key && !queryObj.where.attribute) {
              if (key === 'order_customer_name') {
                queryObj.include[0].include[0].where = getKeySearchCondition(
                  '"Order"."Customer"', 'fullName', key, term
                );
              } else if (key === 'product_name') {
                queryObj.include[1].where = getKeySearchCondition('Product', 'default', key, term);
              }
            }
            break;
          
          case 'Purchase':
            queryObj.attributes = [
              'id', 'date', 'purchaseValue', 'purchaseStatus', 'reportStatus'
            ];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            queryObj.include = [
              {
                model: models.Division,
                attributes: ['id', 'name'],
              },
              {
                model: models.Reference,
                attributes: ['id', 'code']
              },
              {
                model: models.Supplier,
                attributes: ['id', 'name']
              }
            ];
            if (key && !queryObj.where.attribute) {
              if (key === 'division_name') {
                queryObj.include[0].where = getKeySearchCondition(
                  'Division', 'default', key, term
                );
              } else if (key === 'referenceCode') {
                queryObj.include[1].where = getKeySearchCondition(
                  'Reference', 'default', key, term
                );
              } else if (key === 'supplier_name') {
                queryObj.include[2].where = getKeySearchCondition(
                  'Supplier', 'default', key, term
                );
              }
            }
            break;
          
          case 'Reference':
            queryObj.attributes = ['id', 'code', 'category', 'date', 'relatedId'];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            break;

          case 'Shopping':
            queryObj.attributes = ['id', 'title', 'date'];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            break;
          
          case 'SizeCategory':
            queryObj.attributes = ['id', 'category'];
            queryObj.order = [[orderBy || Sequelize.fn('lower', Sequelize.col('category')),
              order || 'ASC']];
            break;
          
          case 'Size':
            queryObj.attributes = ['id', 'measurement', 'orderIndex'];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            queryObj.include = [
              {
                model: models.SizeCategory,
                attributes: ['id', 'category']
              }
            ];
            if (key && !queryObj.where.attribute) {
              if (key === 'size-category_category') {
                queryObj.include[0].where = getKeySearchCondition(
                  'SizeCategory', 'default', key, term
                );
              }
            }
            break;

          case 'Stock':
            queryObj.attributes = ['id', 'size', 'thickness', 'quantity'];
            queryObj.order = orderBy ? [[orderBy,  order || 'ASC']] :
              [[models.Stock.associations.Material, 'name', order || 'ASC']];
            queryObj.include = [
              {
                model: models.Material,
                attributes: ['id', 'name']
              },
              {
                model: models.Brand,
                attributes: ['id', 'name']
              }
            ];
            if (key && !queryObj.where.attribute) {
              if (key === 'material_name') {
                queryObj.include[0].where = getKeySearchCondition(
                  'Material', 'default', key, term
                );
              } else if (key === 'brand_name') {
                queryObj.include[1].where = getKeySearchCondition(
                  'Brand', 'default', key, term
                );
              }
            }
            break;

          case 'StockEmployee':
            queryObj.attributes = ['id', 'date', 'quantity'];
            queryObj.order = [
              [orderBy || sequelize.cast(sequelize.col('date'), 'varchar'), order || 'ASC']
            ];
            queryObj.include = [
              {
                model: models.Stock,
                attributes: ['id', 'size', 'thickness'],
                include: [
                  {
                    model: models.Material,
                    attributes: ['id', 'name']
                  }
                ],
                required: true
              },
              {
                model: models.Employee,
                attributes: ['id', 'firstName', 'lastName']
              }
            ];
            if (key && !queryObj.where.attribute) {
              if (key === 'stock_size' || key === 'stock_thickness') {
                queryObj.include[0].where = getKeySearchCondition('Stock', 'default', key, term);
              } else if (key === 'stock_material_name') {
                queryObj.include[0].include[0].where = getKeySearchCondition(
                  '"Stock"."Material"', 'default', key, term
                );
              } else if (key === 'employee_name') {
                queryObj.include[1].where = getKeySearchCondition(
                  'Employee', 'fullName', key, term
                );
              }
            }
            break;
          
          case 'Supplier':
            queryObj.attributes = ['id', 'name', 'city'];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            break;
          
          case 'Token':
            queryObj.attributes = [
              'id', 'accessToken', 'refreshToken', 'refreshTokenExpiredAt', 'createdAt'
            ];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            queryObj.include = [
              {
                model: models.Admin,
                attributes: ['id', 'firstName', 'lastName']
              }
            ];
            if (key && !queryObj.where.attribute) {
              if (key === 'admin_name') {
                queryObj.include[0].where = getKeySearchCondition('Admin', 'fullName', key, term);
              }
            }
            break;

          case 'Transaction':
            queryObj.attributes = ['id', 'title', 'date'];
            queryObj.order = [[orderBy || 'id', order || 'DESC']];
            queryObj.include = [
              {
                model: models.Reference,
                attributes: ['id', 'code', 'category', 'relatedId']
              }
            ];
            if (key && !queryObj.where.attribute) {
              if (key === 'referenceCode') {
                queryObj.include[0].where = getKeySearchCondition(
                  'Reference', 'default', key, term
                  );
              } else if (key === 'reference_category') {
                queryObj.include[0].where = getKeySearchCondition(
                  'Reference', 'default', key, term
                );
              } 
            }
            break;
        }

        if (req.query.idname) {
          const idname = req.query.idname;
          const id = parseInt(req.query.id);
          queryObj.where[Op.and].push({ [idname]: id });
        }

        if (req.query.page && req.query.limit) {
          const page = parseInt(req.query.page);
          const limit = parseInt(req.query.limit);
          const results = {};
          const startIndex = (page - 1) * limit;
          const endIndex = page * limit;
          queryObj.limit = limit;
          queryObj.offset = startIndex;
          const { count, rows: data } = await models[modelName].findAndCountAll(queryObj);
          results.results = data;
          results.totalResults = count;

          if (endIndex < count) {
            results.next = {
              page: page + 1,
              limit
            }
          } 

          if (startIndex > 0) {
            results.previous = {
              page: page - 1,
              limit
            }
          }
          res.results = results;
        } else {
          const results = {};
          const { count, rows: data } = await models[modelName].findAndCountAll(queryObj);
          results.results = data;
          results.totalResults = count;
          res.results = results;
        }
        next();
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = resultsFilterPaginator;