/*************************************
 *                                   * 
 *   CDC | Check Digits Calculator   *
 *                                   *
**************************************/


const calc = {
    _weighting: [7, 3, 1],
    _values: { 
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
    get values() {
        return this._values._digits.concat(Object.keys(this._values._abc));
    },
    msg: { 
        empty: `> Element didn't contain any symbols and has been filled with '<'.\r\n`,
        exceed: `> Element exceeded the maximum length of 12 symbols and has been trimmed.\r\n`,
        invalid: [`> Invalid symbol '`, `' at index `, ` has been replaced with '<'.\r\n`]
    },
    result: ''
}

const doc = {
    errorMsg: document.getElementById('error'),
    logMsg: document.getElementById('log'),
    rButton_onlyDigit: document.getElementById('checkdigit'),
    inputField: document.getElementById('input-field'),
    resultField: document.getElementById('result-field'),
    submitButton: document.getElementById('submit-button')
}

//console.log(calc.values);

const prepareData = testingString => {
    console.log('raw input: ' + testingString);
    //doc.logMsg.textContent = '> raw input: ' + testingString;

    const convertedArray = testingString;
    if (testingString.length == 0) {
        // handle input strings with no length
        testingString = '<<<<<<<<<<<<';
        doc.errorMsg.textContent += calc.msg.empty;
    } else {
        // convert all letters to uppercase-notation
        testingString = testingString.toUpperCase();
    };
    // convert strings to arrays
    testingString = Array.from(testingString);
    if (testingString.length <= 12) {
        // fill all elements with less than 12 positions with '<'
        const fillSymbols = Array(12 - testingString.length).fill('<');
        testingString = Array.from(testingString).concat(fillSymbols);
    } else {
        // trim elements with more than 12 positions
        testingString.splice(12);
        doc.errorMsg.textContent += calc.msg.exceed;
    };
    // fill all spaces between arrays with '<'
    for (let i = 0; i < 12; i++) {
        if (testingString[i] == ' ') {
            testingString[i] = '<';
        }
    };
    // change invalid symbols to '<'
    for (let i = 0; i < 12; i++) {
        if (
            Object.keys(calc._values._abc).includes(testingString[i]) == false 
            && calc._values._digits.includes(parseInt(testingString[i])) == false) { 
                doc.errorMsg.textContent += 
                    calc.msg.invalid[0] + testingString[i] 
                  + calc.msg.invalid[1] + i 
                  + calc.msg.invalid[2];
                testingString[i] = '<';
            } 
    };
    calc.result = testingString.join('');
    console.log('prepared string for further calculation: ' + testingString);
    return testingString;
}


const convertInputToNumbers = inputString => {
    const preparedData = prepareData(inputString);
    
    for (let i = 0; i < 12; i++) {
        if (parseInt(preparedData[i]) >= 0) {
            // convert existing numbers within strings to nrs
            preparedData[i] = parseInt(preparedData[i]);
        } else {
            // convert alphabetical symbols and '<' to their respective nrs
            preparedData[i] = calc._values._abc[preparedData[i]];
        } 
    };
    console.log('input converted in numbers: ' + preparedData)
    return preparedData;
}


// create check digit 
const createCheckDigit = inputString => {
    
    let inputAsNumbers = convertInputToNumbers(inputString);
        
    // step 1: multiply each digit with corresponding wighting nr.
    for (let j = 0; j<12; j++) {
        inputAsNumbers[j] = inputAsNumbers[j] * calc._weighting[j%3];
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
    calc.result = [calc.result, '<<<', inputAsNumbers].join('');
    console.log('result with check digit: ' + calc.result);
    return calc.result;
}


// create check letter 
const createCheckLetter = inputString => {
    
    let inputAsNumbers = convertInputToNumbers(inputString);
    let letter
    // step 1: multiply each digit with corresponding wighting nr.
    for (let j = 0; j<12; j++) {
        inputAsNumbers[j] = inputAsNumbers[j] * calc._weighting[j%3];
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
        letter = Object.entries(calc._values._abc)[inputAsNumbers - 10][0];
    }

    calc.result = [calc.result, '<<<', letter].join('');

    console.log('result with check letter: ' + calc.result);
    return calc.result;
}


doc.submitButton.onclick = () => {
    
    // this is necessary to use \r\n in textContent commands
    doc.errorMsg.setAttribute('style', 'white-space: pre-line;');
    
    // reset error messages with every new request
    doc.errorMsg.textContent = '';
    if (doc.rButton_onlyDigit.checked) {
        let checkDigitResult = createCheckDigit(doc.inputField.value);
        doc.resultField.setAttribute('placeholder', checkDigitResult);
    } else {
        let checkLetterResult = createCheckLetter(doc.inputField.value);
        doc.resultField.setAttribute('placeholder', checkLetterResult);
    }
};