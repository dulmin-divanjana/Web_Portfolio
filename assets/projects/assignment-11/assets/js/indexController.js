
$("#customer_sect").css('display','none');
$("#items_sect").css('display','none');
$("#orders_sect").css('display','none');

$("#dash_nav").on('click',()=>{
    $('.nav-link').removeClass('active');
    $("#dash_nav").addClass('active');

    $("#dashboard_sect").css('display','block');
    $("#customer_sect").css('display','none');
    $("#items_sect").css('display','none');
    $("#orders_sect").css('display','none');
})

$("#cust_nav").on('click',()=>{
    $('.nav-link').removeClass('active');
    $("#cust_nav").addClass('active');

    $("#customer_sect").css('display','block');
    $("#dashboard_sect").css('display','none');
    $("#items_sect").css('display','none');
    $("#orders_sect").css('display','none');
})

$("#item_nav").on('click',()=>{
    $('.nav-link').removeClass('active');
    $("#item_nav").addClass('active');

    $("#items_sect").css('display','block');
    $("#customer_sect").css('display','none');
    $("#dashboard_sect").css('display','none');
    $("#orders_sect").css('display','none');
})

$("#order_nav").on('click',()=>{
    $('.nav-link').removeClass('active');
    $("#order_nav").addClass('active');

    $("#orders_sect").css('display','block');
    $("#customer_sect").css('display','none');
    $("#dashboard_sect").css('display','none');
    $("#items_sect").css('display','none');
})