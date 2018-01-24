function capitalize (str) {
    return str.split(' ').map(p => p.slice(0, 1).toUpperCase() + p.slice(1)).join(' ');
}

module.exports = {
    capitalize: capitalize
};
