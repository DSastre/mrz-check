/*************************************
 *                                   * 
 *   CDC | Check Digits Calculator   *
 *                                   *
**************************************/

// Calculator namespace
const CALC = {
    _weighting: [7, 3, 1],
    _consideredValues: { 
        _digits: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        _abc: {
            A: 10, B: 11, C: 12, D: 13, E: 14,
            F: 15, G: 16, H: 17, I: 18, J: 19,
            K: 20, L: 21, M: 22, N: 23, O: 24,
            P: 25, Q: 26, R: 27, S: 28, T: 29,
            U: 30, V: 31, W: 32, X: 33, Y: 34,
            Z: 35, '<': 0
        },
    },
    get consideredValues() {
        const digitsAsStrings = [];
        this._consideredValues._digits.forEach(element => {
            digitsAsStrings.push(element.toString());
        });
        return digitsAsStrings.concat(Object.keys(this._consideredValues._abc));
    },
    result: '',
    log(logMessage) {
        DOC.logField = logMessage;
    },
    error(errorMessage) {
        DOC.errorField = errorMessage;
    }
}

// Document namespace
const DOC = {
    _errorField: document.getElementById('error'),
    _logField: document.getElementById('log'),
    set errorField(errorMessage) {
        if (this._errorField.childNodes.length == 0) {
            this._errorField.textContent = errorMessage;
        } else {
            this._errorField.textContent += errorMessage;
        }
    },
    set logField(logMessage) {            
        if (this._logField.childNodes.length == 0) {
            this._logField.textContent = logMessage;
        } else {
            this._logField.textContent += logMessage;
        } 
    },
    _rButton_onlyDigit: document.getElementById('checkdigit'),
    _inputField: document.getElementById('input-field'),
    _resultField: document.getElementById('result-field'),
    set resultField(result) {
        this._resultField.setAttribute('placeholder', result);
    },
    _submitButton: document.getElementById('submit-button')
}


CALC.prepareData = inputString => {   
    CALC.log(`> Raw input: '${inputString}'\r\n`);  
    let upperCaseString = inputString.toUpperCase();
    if (upperCaseString.length == 0) {
        upperCaseString = '<<<<<<<<<<<<';
        CALC.error(`> Element didn't contain any symbols and has been filled with '<'.\r\n`);
    };    
    let convertedToArray = Array.from(upperCaseString);
    if (convertedToArray.length <= 12) { 
        const fillTail = Array(12 - convertedToArray.length).fill('<');
        convertedToArray = convertedToArray.concat(fillTail);
    } else { 
        convertedToArray.splice(12);
        CALC.error(`> Element exceeded the maximum length of 12 symbols and has been trimmed.\r\n`);
    };
    convertedToArray.forEach(element => {
        if (element == ' ') { element = '<'}
    });
    for (let i = 0; i < 12; i++) {
        if (CALC.consideredValues.includes(convertedToArray[i]) == false) { 
            CALC.error(`> Invalid symbol '${convertedToArray[i]}' at index ${i} has been replaced with '<'\r\n`);
            convertedToArray[i] = '<';
        } 
    };
    CALC.result = convertedToArray.join('');
    CALC.log(`> Prepared string for further calculation: '${convertedToArray}'\r\n`);
    return convertedToArray;
}


CALC.transformInputToNumbers = inputString => {
    const preparedData = CALC.prepareData(inputString);
    const transformedToNumbers = [];
    for (let i = 0; i < 12; i++) {
        if (parseInt(preparedData[i]) >= 0) {
            transformedToNumbers[i] = parseInt(preparedData[i]);
        } else {
            transformedToNumbers[i] = CALC._consideredValues._abc[preparedData[i]];
        } 
    };
    CALC.log(`> Input transformed into numbers: ${transformedToNumbers}\r\n`)
    return transformedToNumbers;
}


CALC.createCheckChar = (inputString, choise) => {
    const inputAsNumbers = CALC.transformInputToNumbers(inputString);
    const multiplicationResults = []; 
    for (let i = 0; i < 12; i++) {
        multiplicationResults[i] = inputAsNumbers[i] * CALC._weighting[i%3];
    };
    CALC.log(`> Step 1) Multiplication results: ${multiplicationResults}\r\n`);
    const sumOfAllProducts = multiplicationResults.reduce((previousVal, currentVal) =>
        previousVal + currentVal
    );
    CALC.log(`> Step 2) Added products from step 1: ${sumOfAllProducts}\r\n`);
    
   
    let modulus;
    if (choise == 'digit') {
        modulus = sumOfAllProducts % 10;
        CALC.log(`> Step 3) Reminder of division by 10: ${modulus}\r\n`);
        

        
        //reminderOfDivison = sumOfAllProducts % 10;
        //CALC.log(`> Step 3 & 4) Reminder of division by 10: ${reminderOfDivison}\r\n`);
    } else if (choise == 'letter') {
        modulus = sumOfAllProducts % 36;
        CALC.log(`> Step 3) Reminder of division by 36: ${modulus}\r\n`);
        //CALC.log(`> Step 3 & 4) Reminder of division by 36: ${reminderOfDivison}\r\n`);
    }
    let checkLetter;
    if (modulus < 10) {
        checkLetter = modulus;
    } else {
        checkLetter = Object.entries(CALC._consideredValues._abc)[modulus - 10][0];
    }
    CALC.log(`> Step 4) Checkdigit is: ${checkLetter}\r\n`);
    CALC.result = [CALC.result, '<<<', checkLetter].join('');
    CALC.log( `> Result with check character: ${CALC.result}\r\n`);
    return CALC.result;
}


DOC._submitButton.onclick = () => {
    DOC._errorField.setAttribute('style', 'white-space: pre-line;');
    DOC._logField.setAttribute('style', 'white-space: pre-line;');
    DOC._errorField.textContent = '';
    DOC._logField.textContent = '';
    if (DOC._rButton_onlyDigit.checked) {
        let checkDigitResult = CALC.createCheckChar(DOC._inputField.value, 'digit');
        DOC.resultField = checkDigitResult;
    } else {
        let checkLetterResult = CALC.createCheckChar(DOC._inputField.value, 'letter');
        DOC.resultField = checkLetterResult;
    }
};