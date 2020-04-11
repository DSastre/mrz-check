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
        convertedToArray = convertedToArray.splice(12);
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


CALC.convertInputToNumbers = inputString => {
    const preparedData = CALC.prepareData(inputString);
    
    for (let i = 0; i < 12; i++) {
        if (parseInt(preparedData[i]) >= 0) {
            // convert existing numbers within strings to nrs
            preparedData[i] = parseInt(preparedData[i]);
        } else {
            // convert alphabetical symbols and '<' to their respective nrs
            preparedData[i] = CALC._consideredValues._abc[preparedData[i]];
        } 
    };
    console.log('input converted in numbers: ' + preparedData)
    return preparedData;
}


CALC.createCheckDigit = inputString => {
    
    let inputAsNumbers = CALC.convertInputToNumbers(inputString);
        
    // step 1: multiply each digit with corresponding wighting nr.
    for (let j = 0; j<12; j++) {
        inputAsNumbers[j] = inputAsNumbers[j] * CALC._weighting[j%3];
    };
    console.log('step 1) multiplication results: ' + inputAsNumbers);
    // step 2: add the products from step 1
    inputAsNumbers = inputAsNumbers.reduce((accumulator, currentVal) =>
        accumulator + currentVal
    );
    console.log('step 2) added products from step 1: ' + inputAsNumbers);
    // step 3 & 4: Divide by ten and keep reminder
    inputAsNumbers = inputAsNumbers % 10;
    console.log('step 3 & 4) reminder of division by 10: ' + inputAsNumbers);
    CALC.result = [CALC.result, '<<<', inputAsNumbers].join('');
    console.log('result with check digit: ' + CALC.result);
    return CALC.result;
}

/**
 * 
 */
CALC.createCheckLetter = inputString => {
    
    let inputAsNumbers = CALC.convertInputToNumbers(inputString);
    let letter
    // step 1: multiply each digit with corresponding wighting nr.
    for (let j = 0; j<12; j++) {
        inputAsNumbers[j] = inputAsNumbers[j] * CALC._weighting[j%3];
    };
    console.log('step 1) multiplication results: ' + inputAsNumbers);
    // step 2: add the products from step 1
    inputAsNumbers = inputAsNumbers.reduce((accumulator, currentVal) =>
        accumulator + currentVal
    );
    console.log('step 2) added products from step 1: ' + inputAsNumbers);
    // step 3 & 4: Divide by 36 and keep reminder
    inputAsNumbers = inputAsNumbers % 36;
    console.log('step 3 & 4) reminder of division by 36: ' + inputAsNumbers);
    // results from 0-9 are displayed as nr., above, alphabetical chars are used.
    if (inputAsNumbers < 10) {
        letter = inputAsNumbers;
    } else {
        letter = Object.entries(CALC._consideredValues._abc)[inputAsNumbers - 10][0];
    }

    CALC.result = [CALC.result, '<<<', letter].join('');

    console.log('result with check letter: ' + CALC.result);
    return CALC.result;
}

/**
 * 
 */
DOC.submitButton.onclick = () => {
    DOC._errorField.setAttribute('style', 'white-space: pre-line;');    // to use \r\n in textContent commands
    DOC._logField.setAttribute('style', 'white-space: pre-line;');      // to use \r\n in textContent commands
    DOC._errorField.textContent = '';   // reset error messages with every new request
    DOC._logField.textContent = '';     // reset error messages with every new request
    if (DOC.rButton_onlyDigit.checked) {
        let checkDigitResult = CALC.createCheckDigit(DOC.inputField.value);
        DOC.resultField.setAttribute('placeholder', checkDigitResult);
    } else {
        let checkLetterResult = CALC.createCheckLetter(DOC.inputField.value);
        DOC.resultField.setAttribute('placeholder', checkLetterResult);
    }
};