import {CustomerModel} from "../model/CustomerModel.js";
import {customer_db} from "../db/db.js";


const customerIdPattern = /^CID-0{0,3}[1-9]\d{0,3}$/;
const nameRegex = /^[A-Za-z-' ]{2,}$/;
const addressRegex = /^[A-Za-z0-9\s.,'-]+$/;


// submit
$('#customer_submit').on("click", () => {

    if (allCustomerValidations()){
        let customer_id = $('#customerId').val();
        let full_name = $('#fullName').val();
        let address = $('#address').val();

        let customer_obj = new CustomerModel(customer_id, full_name, address);

        customer_db.push(customer_obj);
        loadCustomerData();
        $('#customer-reset').click();
        $('#customerId').val(genNextCustomerId());
    }

});

// update
$('#customer_update').on("click", () => {

    if (allCustomerValidations()){
        let customer_id = $('#customerId').val();
        let full_name = $('#fullName').val();
        let address = $('#address').val();

        let customer_obj = new CustomerModel(customer_id, full_name, address);

        let index = customer_db.findIndex(item => item.customer_id === customer_id);

        customer_db[index] = customer_obj;

        loadCustomerData();

        $('#customer-reset').click();
        $('#customerId').val(genNextCustomerId());
    }


});

// customer delete
$('#customer-delete').on("click", () => {
    let customer_id = $("#customerId").val();

    let index = customer_db.findIndex(item => item.customer_id === customer_id);

    customer_db.splice(index, 1);

    loadCustomerData();

    $('#customer-reset').click();
    $('#customerId').val(genNextCustomerId());
});

// customer details load
$('#customer-table-body').on("click", "tr", function() {
    let customer_id = $(this).find(".customer_id").text();
    let full_name = $(this).find(".full_name").text();
    let address = $(this).find(".address").text();

    $('#customerId').val(customer_id);
    $('#fullName').val(full_name);
    $('#address').val(address);

});
const loadCustomerData = () => {
    $('#customer-table-body').empty(); // make tbody empty
    customer_db.map((item, index) => {
        let record = `<tr><td class="customer_id">${item.customer_id}</td><td class="full_name">${item.full_name}</td><td class="address">${item.address}</td></tr>`;
        $("#customer-table-body").append(record);
    });
};

const genNextCustomerId = () => {

    if (customer_db.length === 0) {
        return "CID-0001";
    } else {
        const lastCustomerID = customer_db[customer_db.length - 1].customer_id;

        const lastCustomerNumber = parseInt(lastCustomerID.split('-')[1]);
        let nextCustomerNumber = lastCustomerNumber + 1;
        nextCustomerNumber = nextCustomerNumber.toString();


        if (nextCustomerNumber.length === 1){
            return `CID-000${nextCustomerNumber}`;
        } else if(nextCustomerNumber.length === 2) {
            return`CID-00${nextCustomerNumber}`;
        } else if(nextCustomerNumber.length === 3){
            return`CID-0${nextCustomerNumber}`;
        }else {
            return`CID-${nextCustomerNumber}`;
        }
    }
}

$('#navigation-bar>li').eq(1).on('click', () => {
    $('#customerId').val(genNextCustomerId());
})

$('#link-customers').on('click', () => {
    $('#customerId').val(genNextCustomerId());
})

function allCustomerValidations() {
    let customer_id = $('#customerId').val();
    let customer_full_name = $('#fullName').val();
    let customer_address = $('#address').val();



    if (customer_id && customerIdPattern.test(customer_id)) {
        if (customer_full_name && nameRegex.test(customer_full_name)){
            if (customer_address && addressRegex.test(customer_address)){
                return true;
            } else {
                Swal.fire({
                    icon: 'error',
                    text: 'Customer Address is Empty or or Invalid!',
                })
                return false;
            }
        }else {
            Swal.fire({
                icon: 'error',
                text: 'Customer Full Name is Empty or Invalid!',
            })
            return false;
        }
    }else{
        Swal.fire({
            icon: 'error',
            text: 'Customer Id is Empty or Invalid !',
        })
        return  false;
    }
}

$('#customerId').on("keyup", () => {
    const customerId = $('#customerId').val();

    const isMatch = customerIdPattern.test(customerId);

    if (!isMatch) {
        $('#customerId').addClass('is-invalid');
    } else {
        $('#customerId').removeClass('is-invalid');
    }

});

$('#fullName').on("keyup", () => {
    const fullName = $('#fullName').val();

    const isMatch = nameRegex.test(fullName);

    if (!isMatch) {
        $('#fullName').addClass('is-invalid');
    } else {
        $('#fullName').removeClass('is-invalid');
    }

});

$('#address').on("keyup", () => {
    const address = $('#address').val();

    const isMatch = addressRegex.test(address);

    if (!isMatch) {
        $('#address').addClass('is-invalid');
    } else {
        $('#address').removeClass('is-invalid');
    }

});