$(document).ready(function(){
    var result=0;
    var prevEntry = 0;
    var operation=null;
    var currentEntry ="0";
    updateScreen(result);

    $('button').click(function(e) {
        var btnPressed = e.target.innerHTML;
        console.log(btnPressed);

        if (btnPressed === 'C') {
            result = 0;
            currentEntry = '0';
        }
        else if (btnPressed === '.') {
            if (currentEntry.indexOf(".") ===-1) {
                currentEntry +='.'}
        }
        else if(isNumber(btnPressed)) {
            if (currentEntry === '0')
                currentEntry = btnPressed;
            else currentEntry = currentEntry + btnPressed;


        }
        else if (isOperator(btnPressed)) {

            if (currentEntry==="" && prevEntry!==0) {
                operation = btnPressed;
            }
            else {
                prevEntry = currentEntry;
                operation = btnPressed;
                currentEntry = '';}
            console.log('curr', currentEntry );
        }
        else if (btnPressed === '%') {
            currentEntry = currentEntry/100;
        }

        else if (btnPressed === '=') {
            currentEntry = operate(prevEntry, currentEntry, operation);
            operation = null;
        }
        updateScreen(currentEntry);
    });
});

updateScreen = function(displayValue) {
    var displayValue = displayValue.toString();
    $('.display').html(displayValue.substring(0,10));
}

isNumber = function(value) {
    return !isNaN(value);
}

isOperator = function(value) {
    return value === "/" || value === "x" || value === "+" || value === "-" ;
};

operate = function(a, b, operation) {
    a = parseFloat(a);
    b = parseFloat(b);
    console.log(a, b, operation)
    if (operation === "+") {
        return a + b;
    }
    if (operation === "-") {
        return a - b;
    }
    if (operation === "x") {
        return a * b;
    }
    if (operation === "/") {
        return a / b;
    }
}



