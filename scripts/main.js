/*****************
* MRZ Check
*****************/
    
const weighting = [7, 3, 1];
const valuesDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const valuesABC = {
    A: 10,
    B: 11,
    C: 12,
    D: 13,
    E: 14,
    F: 15,
    G: 16,
    H: 17,
    I: 18,
    J: 19,
    K: 20,
    L: 21,
    M: 22,
    N: 23,
    O: 24,
    P: 25,
    Q: 26,
    R: 27,
    S: 28,
    T: 29,
    U: 30,
    V: 31,
    W: 32,
    X: 33,
    Y: 34,
    Z: 35,
    '<': 0
}

let result = '';


// HTML Document Elements
const errorMessage = document.getElementById('console-log');
const radioButton_onlyDigit = document.getElementById('checkdigit');
const inputField = document.getElementById('input-field');
const resultField = document.getElementById('result-field');
const submitButton = document.getElementById('submit-button');


// this is necessary to use \r\n in textContent commands
errorMessage.setAttribute('style', 'white-space: pre-line;');


const prepareData = testingString => {
    console.log('raw input: ' + testingString);
    const convertedArray = testingString;
    if (testingString.length == 0) {
        // handle input strings with no length
        testingString = '<<<<<<<<<<<<';
        errorMessage.textContent += `> Element didn't contain any symbols and has been filled with '<'.\r\n`;
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
        errorMessage.textContent += `> Element exceeded the maximum length of 12 symbols and has been trimmed.\r\n`;
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
            Object.keys(valuesABC).includes(testingString[i]) == false 
            && valuesDigits.includes(parseInt(testingString[i])) == false) { 
                errorMessage.textContent += `> Invalid symbol '${testingString[i]}' at index ${i} has been replaced with '<'.\r\n`;
                testingString[i] = '<' 
            } 
    };
    result = testingString.join('');
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
            preparedData[i] = valuesABC[preparedData[i]];
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
        inputAsNumbers[j] = inputAsNumbers[j] * weighting[j%3];
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
    result = [result, '<<<', inputAsNumbers].join('');
    console.log('result with check digit: ' + result);
    return result;
}


// create check letter 
const createCheckLetter = inputString => {
    
    let inputAsNumbers = convertInputToNumbers(inputString);
    let letter
    // step 1: multiply each digit with corresponding wighting nr.
    for (let j = 0; j<12; j++) {
        inputAsNumbers[j] = inputAsNumbers[j] * weighting[j%3];
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
        letter = Object.entries(valuesABC)[inputAsNumbers - 10][0];
    }

    //letter = Object.entries(valuesABC)[inputAsNumbers][0];
    result = [result, '<<<', letter].join('');

    console.log('result with check letter: ' + result);
    return result;
}


submitButton.onclick = () => {
    errorMessage.textContent = '';
    if (radioButton_onlyDigit.checked) {
        let checkDigitResult = createCheckDigit(inputField.value);
        resultField.setAttribute('placeholder', checkDigitResult);
    } else {
        let checkLetterResult = createCheckLetter(inputField.value);
        resultField.setAttribute('placeholder', checkLetterResult);
    }
};