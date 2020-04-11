/*************************************
 *                                   * 
 *   CDC | Check Digits Calculator   *
 *                                   *
**************************************/


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
    msg: { 
        emptyError: `> Element didn't contain any symbols and has been filled with '<'.\r\n`,
        exceedError: `> Element exceeded the maximum length of 12 symbols and has been trimmed.\r\n`,
        _invalidError: [`> Invalid symbol '`, `' at index `, ` has been replaced with '<'.\r\n`],
        _rawLog: [`> Raw input: '`, `'\r\n`],
        _preparedLog: [`> Prepared string for further calculation: '`, `'\r\n`],
        invalidError(symbol, index) {
            return this._invalidError[0] + symbol + 
            this._invalidError[1] + index + 
            this._invalidError[2];
        },
        rawLog(testingString) {
            return this._rawLog[0] + testingString + this._rawLog[1];
        },
        preparedLog(testingString) {
            return this._preparedLog[0] + testingString + this._preparedLog[1];
        }
    },
    result: '',
    log(logMessage) {
        DOC.logField = logMessage;
    },
    error(errorMessage) {
        DOC.errorField = errorMessage;
    }
}


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
    rButton_onlyDigit: document.getElementById('checkdigit'),
    inputField: document.getElementById('input-field'),
    resultField: document.getElementById('result-field'),
    submitButton: document.getElementById('submit-button')
}


CALC.prepareData = inputString => {   
    CALC.log(
        `> Raw input: '${inputString}'\r\n`
    );  
    let upperCaseString = inputString.toUpperCase();
    if (upperCaseString.length == 0) {
        upperCaseString = '<<<<<<<<<<<<';
        CALC.error(
            `> Element didn't contain any symbols and has been filled with '<'.\r\n`
        );
    };    
    let convertedToArray = Array.from(upperCaseString);
    if (convertedToArray.length <= 12) { 
        const fillTail = Array(12 - convertedToArray.length).fill('<');
        convertedToArray = convertedToArray.concat(fillTail);
    } else { 
        convertedToArray.splice(12);
        CALC.error(
            `> Element exceeded the maximum length of 12 symbols and has been trimmed.\r\n`
        );
    };
    convertedToArray.forEach(element => {
        if (element == ' ') { element = '<'}
    });
    for (let i = 0; i < 12; i++) {
        if (CALC.consideredValues.includes(convertedToArray[i]) == false) { 
            CALC.error(
                `> Invalid symbol '${convertedToArray[i]}' at index ${i} has been replaced with '<'.\r\n`
            );
            convertedToArray[i] = '<';
        } 
    };
    CALC.result = convertedToArray.join('');
    CALC.log(
        `> Prepared string for further calculation: '${convertedToArray}'\r\n`
    );
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
    CALC.log(
        `> Input transformed into numbers: ${transformedToNumbers}\r\n`
    )
    return transformedToNumbers;
}


CALC.createCheckChar = (inputString, choise) => {
    const inputAsNumbers = CALC.transformInputToNumbers(inputString);
    const multiplicationResults = []; 
    for (let i = 0; i < 12; i++) {
        multiplicationResults[i] = inputAsNumbers[i] * CALC._weighting[i%3];
    };
    CALC.log(
        `> Step 1) Multiplication results: ${multiplicationResults}\r\n`
    );
    const sumOfAllProducts = multiplicationResults.reduce((previousVal, currentVal) =>
        previousVal + currentVal
    );
    CALC.log(
        `> Step 2) Added products from step 1: ${sumOfAllProducts}\r\n`
    );
    let reminderOfDivison;
    if (choise == 'number') {
        reminderOfDivison = sumOfAllProducts % 10;
        CALC.log(`> Step 3 & 4) Reminder of division by 10: ${reminderOfDivison}\r\n`);
    } else if (choise == 'letter') {
        reminderOfDivison = sumOfAllProducts % 36;
        CALC.log(`> Step 3 & 4) Reminder of division by 36: ${reminderOfDivison}\r\n`);
    }
    let checkLetter;
    if (reminderOfDivison < 10) {
        checkLetter = reminderOfDivison;
    } else {
        checkLetter = Object.entries(CALC._consideredValues._abc)[reminderOfDivison - 10][0];
    }
    CALC.result = [CALC.result, '<<<', checkLetter].join('');
    CALC.log(
        `> Result with check letter: ${CALC.result}\r\n`
    );
    return CALC.result;
}


DOC.submitButton.onclick = () => {
    DOC._errorField.setAttribute('style', 'white-space: pre-line;');    // to use \r\n in textContent commands
    DOC._logField.setAttribute('style', 'white-space: pre-line;');      // to use \r\n in textContent commands
    DOC._errorField.textContent = '';   // reset error messages with every new request
    DOC._logField.textContent = '';     // reset error messages with every new request
    if (DOC.rButton_onlyDigit.checked) {
        let checkDigitResult = CALC.createCheckChar(DOC.inputField.value, 'number');
        DOC.resultField.setAttribute('placeholder', checkDigitResult);
    } else {
        let checkLetterResult = CALC.createCheckChar(DOC.inputField.value, 'letter');
        DOC.resultField.setAttribute('placeholder', checkLetterResult);
    }
};