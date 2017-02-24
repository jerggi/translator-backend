const parse = (str) => {
    // camel case
    str = str.replace(/[a-z][A-Z]/g, chars => `${chars[0]} ${chars[1]}`);

    // snake case
    str = str.replace(/_/g, ' ');

    // Class prefix 'C' + 'Class'
    str = str.replace(/C[A-Z][a-z]+/g, chars => ' ' + chars.substr(1));

    const words = str.split(' ');

    return words.filter(w => /[a-z]/i.test(w));
}

module.exports = parse;
