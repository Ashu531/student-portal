const excludeSpecialCharactersRegex = /^[a-zA-Z0-9. ]*$/;
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const mobileRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
const amountRegex = /^\d+(\.\d{1,2})?$/;

const checkForNull = (str) => {
    if (str == null) {
        throw new Error('cannot be null');
    }
};

const checkForEmpty = (str) => {
    if (str.length === 0) {
        return 'cannot be empty';
    }
    return null;
};

const checkMatchRegex = (str, regex) => {
    if (!regex.test(str)) {
        return 'invalid';
    }
    return null;
};

export const basicValidation = (str) => {
    checkForNull(str);
    // str = str.trim();
    const emptyError = checkForEmpty(str);
    if (emptyError) return emptyError;
    // Uncomment if you want to validate against the excludeSpecialCharactersRegex
    // const regexError = checkMatchRegex(str, excludeSpecialCharactersRegex);
    // if (regexError) return regexError;
    return null;
};

export const emailValidation = (str) => {
    checkForNull(str);
    // str = str.trim();
    const emptyError = checkForEmpty(str);
    if (emptyError) return emptyError;
    return checkMatchRegex(str, emailRegex);
};

export const mobileValidation = (str) => {
    checkForNull(str);
    // str = str.trim();
    const emptyError = checkForEmpty(str);
    if (emptyError) return emptyError;
    return checkMatchRegex(str, mobileRegex);
};

export const amountValidation = (str) => {
    checkForNull(str);
    // str = str.trim();
    const emptyError = checkForEmpty(str);
    if (emptyError) return emptyError;
    return checkMatchRegex(str, amountRegex);
};

export const dropdownValidation = (value) => {
    if (value == null) {
        throw new Error('cannot be null');
    }
    // Assuming `value` should be a number, and checking if it's non-negative
    if (typeof value !== 'number' || value < 0) {
        return 'invalid';
    }
    return null;
};
