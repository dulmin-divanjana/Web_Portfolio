export class OrderModel {
    constructor(orderId, date, customerId, orderDetailsArr, netTotal, subTotal, discount, cash) {
        this.orderId = orderId;
        this.date = date;
        this.customerId = customerId;
        this.orderDetailsArr = orderDetailsArr;
        this.netTotal = netTotal;
        this.discount = discount;
        this.cash = cash;
        this.subTotal = subTotal;
    }
}