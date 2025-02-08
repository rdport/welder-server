const { Reference, AccountTransaction, Order, Sequelize, sequelize } = require('../models');
const Op = Sequelize.Op;
const { QueryTypes } = require('sequelize');
const separateModelName = require('./separateModelName');
const formatNumberInput = require('./formatNumberInput');

async function followDeleteRef(ReferenceId, t) {
  try {
    const data = await Reference.destroy({
      where: {
        id: ReferenceId
      },
      transaction: t
    });
    if (!data) {
      throw error404('Reference');
    }
  } catch (err) {
    Promise.reject(err);
  }
}
  
function getPurchaseReportUpdate(accountTransactions) {
  let purchaseValue = 0;
  let paidAmount = 0;
  let purchaseStatus = '';
  const { reportStatus } = getReportStatus(accountTransactions);
  
  if (accountTransactions) {
    accountTransactions.forEach(accountTransaction => {
      if (accountTransaction.entry === 'debit') {
        totalDebit += accountTransaction.value;
      } else {
        totalCredit += accountTransaction.value;
      }

      if (accountTransaction.Account.code >= 11100 && accountTransaction.Account.code < 11300) {
        if (accountTransaction.entry === 'kredit') {
          paidAmount += accountTransaction.value;
        } else {
          paidAmount -= accountTransaction.value;
        }
      } else if (accountTransaction.Account.code > 11400 && accountTransaction.Account.code < 11500) {
        if (accountTransaction.entry === 'debit') {
          purchaseValue += accountTransaction.value;
        } else {
          purchaseValue -= accountTransaction.value;
        }
      }

      if (!paidAmount) {
        purchaseStatus = 'unpaid';
      } else if (paidAmount === purchaseValue) {
        purchaseStatus = 'completed';
      } else if (paidAmount < purchaseValue) {
        purchaseStatus = 'in debt';
      } else if (paidAmount > purchaseValue) {
        purchaseStatus = 'overpaid';
      }
    })
  } else {
    paidAmount = 0;
    purchaseStatus = 'unpaid';
  }
  return {
    paidAmount,
    purchaseStatus,
    reportStatus
  };
}

function getReportStatus(accountTransactions) {
  let totalDebit = 0;
  let totalCredit = 0;
  let reportStatus = '';
  
  if (accountTransactions) {
    accountTransactions.forEach(accountTransaction => {
      if (accountTransaction.entry === 'debit') {
        totalDebit += accountTransaction.value;
      } else {
        totalCredit += accountTransaction.value;
      }

      if (totalDebit === totalCredit) {
        reportStatus = 'reported';
      } else if (totalDebit !== totalCredit) {
        reportStatus = 'reported - unbalanced';
      }
    })
  } else {
    reportStatus = 'not reported';
  }
  return {
    reportStatus
  };
}

/*--------------------------------------------EXPORT--------------------------------------------*/

function error404(modelName) {
  return {
    status: 404,
    message: `${separateModelName(modelName)} not found`
  }
}

async function generateRefCode(category, date, t) {
  try {
    let generatedCode = '';
    const references = await Reference.findAll({
      where: {
        category,
        date
      },
      order: [['id', 'DESC']],
      transaction: t
    });
    if (references.length) {
      const code = references[0].code;
      const alphabetCode = code.slice(0, 3);
      const numericCode = +code.slice(3);
      const newNumericCode = numericCode + 1;
      generatedCode = alphabetCode + newNumericCode;
    } else {
      const alphabetCode = category.slice(0,3).toUpperCase();
      const arrDate = date.split('-');
      const numericCode = arrDate[0] + arrDate[1] + arrDate[2] + '010001';
      generatedCode = alphabetCode + numericCode;
    }
    const newReference = {
      code: generatedCode,
      category,
      date
    }
    const data = await Reference.create(newReference, { transaction: t });
    return Promise.resolve(data);
  } catch (err) {
    return Promise.reject(err);
  }
}

async function chainRefDelete (req, model, t) {
  try {
    const id = +req.params.id;
    const instance = await model.findByPk(id, {
      attributes :[],
      include: {
        model: Reference,
        attributes:['id']
      },
      transaction: t
    });
    if (!instance) {
      throw error404(model.name);
    }
    const ReferenceId = instance.Reference.id;
    await model.destroy({
      where: {
        id
      },
      transaction: t
    });
    await followDeleteRef(ReferenceId, t);
  } catch (err) {
    return Promise.reject(err);
  }
}

async function refCheckEdit(req, model, updatedObj, t) {
  try {
    const id = +req.params.id;
    const ReferenceId = formatNumberInput(req.body.ReferenceId);
    const date = req.body.date;
    const { date: prevDate } = await findByPk(Reference, ReferenceId, ['date'], t);
    let code = req.body.referenceCode;
    if (prevDate === date) {
      updatedObj.ReferenceId = ReferenceId;
    } else {
      if (model.name !== 'GeneralTransaction') {
        updatedObj.date = date;
      }
      const reference = await generateRefCode(model.name.toLowerCase(), date, t);
      updatedObj.ReferenceId = reference.id;
      code = reference.code;
      await Reference.update({ relatedId: id }, {
        where: {
          id: reference.id
        },
        transaction: t
      });
      await followDeleteRef(ReferenceId, t);
    }
    const data = await model.update(updatedObj, {
      where: {
        id 
      },
      returning: true,
      transaction: t
    });
    if (!data[0]) {
      throw error404(model.name);
    }
    return Promise.resolve({ editedData: data[1][0], referenceCode: code });
  } catch (err) {
    return Promise.reject(err);
  }
}

async function getValue(queryObj, t) {
  try {
    let optionalQuery = '';
    const baseQuery =
      `SELECT SUM(${queryObj.query})
      FROM "${queryObj.tableName}"
      WHERE "${queryObj.idname}" = ${queryObj.id}`;
    if (queryObj.optionalQuery) {
      optionalQuery = queryObj.optionalQuery;
    }
    const value = +(await sequelize.query(
      `${baseQuery} ${optionalQuery}`,
      { type: QueryTypes.SELECT, transaction: t }))[0].sum;
    return Promise.resolve(value);
  } catch (err) {
    return Promise.reject(err);
  }
}

async function findByPk(model, pk, outputArray, t) {
  try {
    const instance = await model.findByPk(pk, { attributes: outputArray,  transaction: t });
    if (!instance) {
      throw error404(model.name);
    }
    return Promise.resolve(instance);
  } catch (err) {
    return Promise.reject(err);
  }
}

async function chainOrderUpdate(OrderId, modelName, propertyArr, t) {
  try {
    const patchedObj = {};
    if (modelName === 'ProductMaterial') {
      const productionCostQuery = 
        '("materialCost" + "laborCost" + "electricityCost" + "otherCost") * "quantity"';
      const productionCostQueryObj = {
        query: productionCostQuery,
        tableName: 'ProductOrders',
        idname: 'OrderId',
        id: OrderId
      }
      const productionCost = await getValue(productionCostQueryObj, t);
      patchedObj.productionCost = productionCost;
    } else {
      const receivedPaymentQuery = '"paymentValue"';
      const queryObj = {
        query: receivedPaymentQuery,
        tableName: 'Payments',
        idname: 'OrderId',
        id: OrderId,
      }
      let paymentStatus = '';
      const { confirmedOrderValue } = await findByPk(Order, OrderId, ['confirmedOrderValue'], t);
      const receivedPayment = await getValue(queryObj, t);
      if (!receivedPayment) {
        paymentStatus = 'unpaid';
      } else if (receivedPayment < confirmedOrderValue) {
        paymentStatus = 'uncompleted';
      } else if (receivedPayment === confirmedOrderValue) {
        paymentStatus = 'completed';
      } else if (receivedPayment > confirmedOrderValue) {
        paymentStatus = 'overpaid';
      }
      if (modelName === 'Payment') {
        patchedObj.receivedPayment = receivedPayment;
      } else if (modelName === 'ProductOrder') {
        const orderValueQuery = '"unitPrice" * "area" * "quantity"';
        const productionCostQuery =
          '("materialCost" + "laborCost" + "electricityCost" + "otherCost") * "quantity"';
        const orderValueQueryObj = {
          property: 'orderValue',
          query: orderValueQuery,
          tableName: 'ProductOrders',
          idname: 'OrderId',
          id: OrderId
        }
        const confirmedOrderValueQueryObj = {
          property: 'confirmedOrderValue',
          query: orderValueQuery,
          tableName: 'ProductOrders',
          idname: 'OrderId',
          id: OrderId,
          optionalQuery: `AND (
            "productionStatus" = 'confirmed' OR
            "productionStatus" = 'started' OR
            "productionStatus" = 'completed' OR
            "productionStatus" = 'postponed')`
        };
        const productionCostQueryObj = {
          property: 'productionCost',
          query: productionCostQuery,
          tableName: 'ProductOrders',
          idname: 'OrderId',
          id: OrderId
        };
        const query = {
          orderValueQueryObj,
          confirmedOrderValueQueryObj,
          productionCostQueryObj
        };
        const data = {};
        for (let property of propertyArr) {
          data[property] = await getValue(query[`${property}QueryObj`], t);
          patchedObj[property] = data[property];
        }
      }
      patchedObj.paymentStatus = paymentStatus;
    }
    await patchProperty(patchedObj, OrderId, Order, t);
  } catch (err) {
    return Promise.reject(err);
  }
}

async function afterReportUpdate(TransactionId, referenceObj, model, t) {
  try {
    const category = referenceObj.category;
    const relatedId = referenceObj.relatedId;
    const updatedObj = {};
    const accountTransactions = await AccountTransaction.findAll({
      where: {
        TransactionId
      },
      include:[Account],
      transaction: t
    });
    if (category === 'purchase') {
      updatedObj = getPurchaseReportUpdate(accountTransactions);
    } else {
      updatedObj = getReportStatus(accountTransactions);
    }
    await patchProperty(updatedObj, relatedId, model, t);
  } catch (err) {
    return Promise.reject(err);
  }
}

async function changeOrderIndex(dataObj, model, t) {
  try {
    const { pk, sourceIndex, destinationIndex, idname, id } = dataObj;
    const queryObj = {};
    queryObj.transaction = t;
    queryObj.where = {
      [Op.and]: []
    };
    queryObj.where[Op.and].push({ orderIndex: {
      [Op.gte]: destinationIndex > sourceIndex ? sourceIndex : destinationIndex } 
    });
    queryObj.where[Op.and].push({ orderIndex: {
      [Op.lte]: destinationIndex > sourceIndex ? destinationIndex : sourceIndex } 
    });
    if (idname) queryObj.where[Op.and].push({ [idname]: id });
    
    if (destinationIndex > sourceIndex) await model.decrement('orderIndex', queryObj);
    if (destinationIndex < sourceIndex) await model.increment('orderIndex', queryObj);
    
    const patchedData = await patchProperty(
      { orderIndex: destinationIndex }, pk, model, t
    );
    return Promise.resolve(patchedData);
  } catch (err) {
    return Promise.reject(err);
  }
}

async function patchProperty(updatedObj, id, model, t) {
  try {
    const  data = await model.update(updatedObj, {
      where: {
        id
      },
      returning: true,
      transaction: t
    });
    if (!data[0]) {
      throw error404(model.name);
    } else {
      return Promise.resolve(data[1][0]);
    }

  } catch (err) {
    return Promise.reject(err);
  }
}

module.exports = {
  generateRefCode,
  chainRefDelete,
  refCheckEdit,
  getValue,
  findByPk,
  chainOrderUpdate,
  afterReportUpdate,
  changeOrderIndex,
  patchProperty,
  error404
}
