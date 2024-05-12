export class OrderDetailsModel {
    constructor(itemId, quantity, unitPrice, description) {
        this.itemId = itemId;
        this.quantity = quantity;
        this.description = description;
        this.unitPrice = unitPrice;
    }
}