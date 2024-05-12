import {ItemModel} from "../model/ItemModel.js";
import {item_db} from "../db/db.js";

const itemIdPattern = /^IID-0{0,3}[1-9]\d{0,3}$/;
const descriptionRegex = /^[A-Za-z0-9\s\-,.:;'"/()&%$@!?#]+$/;
const digitRegex = /^\d+$/;

// item submit
$('#item-submit').on("click", () => {

    if (allItemValidations()){
        let item_id = $('#itemId').val();
        let description = $('#description').val();
        let unit_price = $('#unit-price').val();
        let qty = $('#qty').val();

        let item_obj = new ItemModel(item_id, description, unit_price, qty);

        item_db.push(item_obj);


        loadItemData();

        $('#item-reset').click();
        $('#itemId').val(genNextItemId());
    }
});

// item update
$('#item-update').on("click", () => {

    if (allItemValidations()){
        let item_id = $('#itemId').val();
        let description = $('#description').val();
        let unit_price = $('#unit-price').val();
        let qty = $('#qty').val();

        let item_obj = new ItemModel(item_id, description, unit_price, qty);

        let index = item_db.findIndex(item => item.item_id === item_id);

        item_db[index] = item_obj;


        loadItemData();

        $('#item-reset').click();
        $('#itemId').val(genNextItemId());
    }
});


// Item delete
$('#item-delete').on("click", () => {
    let item_id = $('#itemId').val();

    let index = item_db.findIndex(item => item.item_id === item_id);

    item_db.splice(index, 1);

    loadItemData();

    $('#item-reset').click();
    $('#itemId').val(genNextItemId());
});

const loadItemData = () => {
    $('#iem-table-body').empty(); // make tbody empty
    item_db.map((item, index) => {
        let record = `<tr><td class="item_id">${item.item_id}</td><td class="description">${item.description}</td><td class="unit_price">${item.unit_price}</td><td class="qty">${item.qty}</td></tr>`;
        $("#iem-table-body").append(record);
    });
};

// table search
$('#iem-table-body').on("click", "tr", function() {
    let item_id = $(this).find(".item_id").text();
    let description = $(this).find(".description").text();
    let unit_price = $(this).find(".unit_price").text();
    let qty = $(this).find(".qty").text();

    $('#itemId').val(item_id);
    $('#description').val(description);
    $('#unit-price').val(unit_price);
    $('#qty').val(qty);
});

const genNextItemId = () => {

    if (item_db.length === 0) {
        return "IID-0001";
    } else {
        const lastOrderId = item_db[item_db.length - 1].item_id;

        const lastItemNumber = parseInt(lastOrderId.split('-')[1]);
        let nextItemNumber = lastItemNumber + 1;
        nextItemNumber = nextItemNumber.toString();


        if (nextItemNumber.length === 1){
            return `IID-000${nextItemNumber}`;
        } else if(nextItemNumber.length === 2) {
            return`IID-00${nextItemNumber}`;
        } else if(nextItemNumber.length === 3){
            return`IID-0${nextItemNumber}`;
        }else {
            return`IID-${nextItemNumber}`;
        }
    }
}

function itemClicked() {
    $('#itemId').val(genNextItemId());
}

$('#navigation-bar>li').eq(2).on('click', () => {
    itemClicked();
})

$('#link-items').on('click', () => {
    itemClicked();
})

function allItemValidations() {
    let item_id = $('#itemId').val();
    let description = $('#description').val();
    let unit_price = $('#unit-price').val();
    let qty = $('#qty').val();

    if (item_id && itemIdPattern.test(item_id)) {
        if (description && descriptionRegex.test(description)){
            if (unit_price && digitRegex.test(unit_price)){
                if (qty && digitRegex.test(qty)){
                    return true;
                }else {
                    Swal.fire({
                        icon: 'error',
                        text: 'Item QTY is Empty or Invalid !',
                    })
                    return false;
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    text: 'Item Unit Price is Empty or Invalid !',
                })
                return false;
            }
        }else {
            Swal.fire({
                icon: 'error',
                text: 'Item description is Empty or Invalid !',
            })
            return false;
        }
    }else{
        Swal.fire({
            icon: 'error',
            text: 'Item Id is Empty or Invalid !',
        })
        return  false;
    }
}
$('#itemId').on("keyup", () => {
    const itemId = $('#itemId').val();

    const isMatch = itemIdPattern.test(itemId);

    if (!isMatch) {
        $('#itemId').addClass('is-invalid');
    } else {
        $('#itemId').removeClass('is-invalid');
    }

});
$('#description').on("keyup", () => {
    const description = $('#description').val();

    const isMatch = descriptionRegex.test(description);

    if (!isMatch) {
        $('#description').addClass('is-invalid');
    } else {
        $('#description').removeClass('is-invalid');
    }

});
$('#unit-price').on("keyup", () => {
    const unitPrice = $('#unit-price').val();

    const isMatch = digitRegex.test(unitPrice);

    if (!isMatch) {
        $('#unit-price').addClass('is-invalid');
    } else {
        $('#unit-price').removeClass('is-invalid');
    }

});
$('#qty').on("keyup", () => {
    const qty = $('#qty').val();

    const isMatch = digitRegex.test(qty);

    if (!isMatch) {
        $('#qty').addClass('is-invalid');
    } else {
        $('#qty').removeClass('is-invalid');
    }

});