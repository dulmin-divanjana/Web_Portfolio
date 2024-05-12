import {customer_db, order_db} from "../db/db.js";

const loadOrderDetails = () => {
    $('#order-table').empty(); // make tbody empty
    order_db.map((item, index) => {
        let record = `<tr><td class="order_id">${item.orderId}</td><td class="date">${item.date}</td><td class="customerId">${item.customerId}</td><td class="customerName">${customerName(item.customerId)}</td><td class="netTotal">${item.netTotal}</td><td class="discount">${item.discount}</td><td class="subTotal">${item.subTotal}</td></tr>`;
        $("#order-table").append(record);
    });
};

$('#navigation-bar>li').eq(4).on('click', () => {
    loadOrderDetails();
})
function customerName(customer_id) {
    let index = customer_db.findIndex(item => item.customer_id === customer_id);

    return customer_db[index].full_name;
}