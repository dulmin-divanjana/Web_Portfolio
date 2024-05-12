import {customer_db, item_db, order_db} from "../db/db.js";
import {OrderModel} from "../model/OrderModel.js";
import {OrderDetailsModel} from "../model/OrderDetailsModel.js";

$('#order-update-button').css('display','none');
$('#order-delete-button').css('display','none');
$('#desc').prop('disabled', true);
$('#placeOrderQtyOnHand').prop('disabled', true);
$('#place_order_unit_price').prop('disabled', true);
$('#place_order_customer_name').prop('disabled', true);
$('#Balance').prop('disabled', true);

const orderIdPattern = /^OID-0{0,3}[1-9]\d{0,3}$/;
const digitRegex = /^\d+$/;

var orderDetailsArr =[];

$('#link-orders').on('click', () => {
    placeOrderClicked();
});



$('#navigation-bar>li').eq(3).on('click', () => {
    placeOrderClicked();
});
$('#order-place-order-button').on('click', () => {

    if (orderValidations()) {

        let orderId = $('#order_Id').val();
        let orderDate = $('#orderDate').val();
        let customerId = $('#customerIdSelect').val();
        let netTotal = $('#net-total').text();
        let subTotal = $('#sub-total').text();
        let discount = $('#discount').val();
        let cash = $('#cash').val();


        let order_obj = new OrderModel(orderId, orderDate, customerId, orderDetailsArr, netTotal, subTotal, discount, cash);
        order_db.push(order_obj);

        for (const items of orderDetailsArr) {
            let index = item_db.findIndex(item => item.item_id === items.itemId);
            let item = item_db[index];
            let quantity  = parseInt(item.qty);
            quantity -= parseInt(items.quantity);
            item.qty = quantity;

        }

        orderDetailsClear();
    }
});

$('#add-cart-button').on('click', () => {
    let itemId = $('#itemIdSelect').val();
    let itemQuantity = $('#place_order_qty').val();
    let unitPrice = $('#place_order_unit_price').val();
    let description = $('#desc').val();

    if (itemValidations()) {

        for (const orderDetailsArrElement of orderDetailsArr) {
            if (orderDetailsArrElement.itemId === itemId) {
                let quantity = parseInt(orderDetailsArrElement.quantity);
                quantity += parseInt(itemQuantity);
                orderDetailsArrElement.quantity = quantity;

                $('#cart-table').empty();

                for (const orderDetailsArrElement of orderDetailsArr) {
                    let record = `<tr><td class="item_id">${orderDetailsArrElement.itemId}</td><td class="Description">${orderDetailsArrElement.description}</td><td class="unit_price">${orderDetailsArrElement.unitPrice}</td><td class="Qty">${orderDetailsArrElement.quantity}</td></tr>`;
                    $("#cart-table").append(record);
                }
                let total = 0;

                for (const orderDetailsArrElement of orderDetailsArr) {
                    total += (orderDetailsArrElement.unitPrice * orderDetailsArrElement.quantity)
                }
                $('#net-total').text(total.toFixed(2));
                $('#sub-total').text(calculateDiscountedPrice(total, $('#discount').val()).toFixed(2));
                itemClear();
                return;
            }
        }

        let order_obj = new OrderDetailsModel(itemId, itemQuantity, unitPrice, description);

        orderDetailsArr.push(order_obj);

        $('#cart-table').empty();

        for (const orderDetailsArrElement of orderDetailsArr) {
            let record = `<tr><td class="item_id">${orderDetailsArrElement.itemId}</td><td class="Description">${orderDetailsArrElement.description}</td><td class="unit_price">${orderDetailsArrElement.unitPrice}</td><td class="Qty">${orderDetailsArrElement.quantity}</td></tr>`;
            $("#cart-table").append(record);
        }

        let total = 0;

        for (const orderDetailsArrElement of orderDetailsArr) {
            total += (orderDetailsArrElement.unitPrice * orderDetailsArrElement.quantity)
        }
        $('#net-total').text(total.toFixed(2));
        $('#sub-total').text(calculateDiscountedPrice(total, $('#discount').val()).toFixed(2));
        itemClear();
    }
});

$('#itemIdSelect').on('change', () => {
    let itemId = $('#itemIdSelect').val();
    let index = item_db.findIndex(item => item.item_id === itemId);
    $("#placeOrderQtyOnHand").val(item_db[index].qty);
    $("#desc").val(item_db[index].description);
    $("#place_order_unit_price").val(item_db[index].unit_price);
});

$('#customerIdSelect').on('change', () => {
    let customerId = $('#customerIdSelect').val();
    let index = customer_db.findIndex(item => item.customer_id === customerId);
    $("#place_order_customer_name").val(customer_db[index].full_name);
});
const genNextOrderId = () => {
    if (order_db.length === 0) {
        return "OID-0001";
    } else {
        // Find the last order ID in the array
        const lastOrderId = order_db[order_db.length - 1].orderId;

        // Extract the numeric part and increment it
        const lastOrderNumber = parseInt(lastOrderId.split('-')[1]);
        let nextOrderNumber = lastOrderNumber + 1;
        nextOrderNumber = nextOrderNumber.toString();


        if (nextOrderNumber.toString().length === 1){
            return `OID-000${nextOrderNumber.toString()}`;
        } else if(nextOrderNumber.toString().length === 2) {
            return`OID-00${nextOrderNumber.toString()}`;
        } else if(nextOrderNumber.toString().length === 3){
            return`OID-0${nextOrderNumber.toString()}`;
        }else {
            return`OID-${nextOrderNumber.toString()}`;
        }
    }

}

function placeOrderClicked() {
    orderDetailsClear();
    $('#order_Id').val(genNextOrderId());

    let currentDate = new Date();
    let formattedDate = currentDate.toISOString().split('T')[0];
    $('#orderDate').val(formattedDate);

    $('#customerIdSelect').empty();
    customer_db.map((item, index) => {
        let record = `<option>${item.customer_id}</option>`;
        $("#customerIdSelect").append(record);
    });
    $("#customerIdSelect").append(`<option selected>select the customer</option>`);
    $('#itemIdSelect').empty();
    item_db.map((item, index) => {
        let record = `<option>${item.item_id}</option>`;
        $("#itemIdSelect").append(record);
    });
    $("#itemIdSelect").append(`<option selected>select the Item</option>`);
}
function calculateDiscountedPrice(originalPrice, discountPercentage) {
    if (discountPercentage === null || discountPercentage === 0)return originalPrice;
    const discountAmount = (originalPrice * discountPercentage) / 100;
    return originalPrice - discountAmount;
}

$('#discount').on('input', () => {
    $('#sub-total').text(calculateDiscountedPrice($('#net-total').text(), $('#discount').val()).toFixed(2));
});

function itemClear() {
    $('#itemIdSelect').val("select the Item");
    $('#place_order_qty').val("");
    $('#place_order_unit_price').val("");
    $('#desc').val("");
    $('#placeOrderQtyOnHand').val("");
}

$('#cash').on('input', () => {
    $('#Balance').text(calculateBalance());
});

function calculateBalance() {
    let subtotal = parseInt($('#sub-total').text());
    let cash = $('#cash').val();
    if (subtotal >= cash){
        return 0;
    }else {
        return cash - subtotal;
    }
}
$('#order_Id').on('keypress', (event) => {
    let orderId = $('#order_Id').val();
    if (event.key === 'Enter') {

        let index = order_db.findIndex(item => item.orderId === orderId);

        let order_obj = order_db[index];

        if (order_obj != null) {
            $('#customerIdSelect').val(order_obj.customerId);

            let index = customer_db.findIndex(item => item.customer_id === order_obj.customerId);
            $("#place_order_customer_name").val(customer_db[index].full_name);

            for (const orderDetailsArrElement of order_obj.orderDetailsArr) {
                let record = `<tr><td class="item_id">${orderDetailsArrElement.itemId}</td><td class="Description">${orderDetailsArrElement.description}</td><td class="unit_price">${orderDetailsArrElement.unitPrice}</td><td class="Qty">${orderDetailsArrElement.quantity}</td></tr>`;
                $("#cart-table").append(record);
            }

            $('#net-total').text(order_obj.netTotal);
            $('#sub-total').text(order_obj.subTotal);
            $('#discount').val(order_obj.discount);
            $('#cash').val(order_obj.cash);

            $('#Balance').text(calculateBalance());

            $('#order-update-button').css('display', 'block');
            $('#order-delete-button').css('display', 'block');
            $('#order-place-order-button').css('display', 'none');
        }

    }else {
        $('#order-update-button').css('display','none');
        $('#order-delete-button').css('display','none');
        $('#order-place-order-button').css('display','block');
    }

});

function orderDetailsClear() {
    $('#order_Id').val(genNextOrderId());
    $('#customerIdSelect').val("select the customer");
    $('#place_order_customer_name').val("");
    $('#net-total').text("0");
    $('#sub-total').text("0");
    $('#discount').val("");
    $('#cash').val("");
    $('#Balance').text("0");
    $('#cart-table').empty();
    orderDetailsArr = [];
    itemClear();
    $('#order-update-button').css('display','none');
    $('#order-delete-button').css('display','none');
    $('#order-place-order-button').css('display','block');
}

$('#cart-table').on("click", "tr", function() {
    let item_id = $(this).find(".item_id").text();
    let description = $(this).find(".Description").text();
    let unit_price = $(this).find(".unit_price").text();
    let qty = $(this).find(".Qty").text();

    $('#itemIdSelect').val(item_id);
    $('#desc').val(description);
    let index = item_db.findIndex(item => item.item_id === item_id);
    $("#placeOrderQtyOnHand").val(item_db[index].qty);
    $('#place_order_unit_price').val(unit_price);
    $('#place_order_qty').val(qty);
});

$('#order-update-button').on('click', () => {
    if  (orderValidations()) {
        let orderId = $('#order_Id').val();
        let orderDate = $('#orderDate').val();
        let customerId = $('#customerIdSelect').val();
        let netTotal = $('#net-total').text();
        let subTotal = $('#sub-total').text();
        let discount = $('#discount').val();
        let cash = $('#cash').val();

        let order_obj = new OrderModel(orderId, orderDate, customerId, orderDetailsArr, netTotal, subTotal, discount, cash);
        let index = order_db.findIndex(item => item.orderId === orderId);

        order_db[index] = order_obj;

        orderDetailsClear();
    }
});

$('#order-delete-button').on('click', () => {
    let orderId = $('#order_Id').val();

    let index = order_db.findIndex(item => item.orderId === orderId);

    order_db.splice(index, 1);

    orderDetailsClear();
});

function itemValidations() {
    let item_id = $('#itemIdSelect').val();
    let itemQuantity = $('#place_order_qty').val();
    let itemQuantityOnHand = $('#placeOrderQtyOnHand').val();

    if (item_id !== "select the Item"){
        if (itemQuantity){
            if (itemQuantity <= itemQuantityOnHand){
                return true;
            }else {
                Swal.fire({
                    icon: 'error',
                    text: 'not have enough quantity !',
                })
                return false;
            }
        }else {
            Swal.fire({
                icon: 'error',
                text: 'Item QTY is Empty!',
            })
            return false;
        }
    }else {
        Swal.fire({
            icon: 'error',
            text: 'Please Select Item!',
        })
        return false;
    }

}

function orderValidations() {
    let orderId = $('#order_Id').val();
    let customerId = $('#customerIdSelect').val();
    let cash = $('#cash').val();

    if (orderId && orderIdPattern.test(orderId)) {
        if (customerId !== "select the customer") {
            if (orderDetailsArr.length !== 0) {
                if (cash && digitRegex.test(cash)) {
                    return true;
                } else {
                    Swal.fire({
                        icon: 'error',
                        text: 'Cash is empty or Invalid !',
                    })
                    return false;
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    text: 'Cart is Empty !',
                })
                return false;
            }
        } else {
            Swal.fire({
                icon: 'error',
                text: 'Please Select Customer!',
            })
            return false;
        }
    }else {
        Swal.fire({
            icon: 'error',
            text: 'Customer Id is empty or Invalid !',
        })
        return false;
    }
}
$('#order_Id').on("keyup", () => {
    const orderId = $('#order_Id').val();

    const isMatch = orderIdPattern.test(orderId);

    if (!isMatch) {
        $('#order_Id').addClass('is-invalid');
    } else {
        $('#order_Id').removeClass('is-invalid');
    }

});
$('#place_order_qty').on("keyup", () => {
    const qty = $('#place_order_qty').val();

    const isMatch = digitRegex.test(qty);

    if (!isMatch) {
        $('#place_order_qty').addClass('is-invalid');
    } else {
        $('#place_order_qty').removeClass('is-invalid');
    }

});
$('#discount').on("keyup", () => {
    const discount = $('#discount').val();

    const isMatch = digitRegex.test(discount);

    if (!isMatch) {
        $('#discount').addClass('is-invalid');
    } else {
        $('#discount').removeClass('is-invalid');
    }

});
$('#cash').on("keyup", () => {
    const cash = $('#cash').val();

    const isMatch = digitRegex.test(cash);

    if (!isMatch) {
        $('#cash').addClass('is-invalid');
    } else {
        $('#cash').removeClass('is-invalid');
    }

});