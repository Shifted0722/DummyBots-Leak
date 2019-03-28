module.exports = function token(pack) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    var packCode = "";
    for (let i = 0; i < 5; i++) {
        for (let a = 0; a < 7; a++) token += possible.charAt(Math.floor(Math.random() * possible.length));
        token += '-';
    }
    if (pack == 1) {
        packCode = "Ultimate";
    } else if (pack == 2) {
        packCode = "Gold";
    } else if (pack == 3) {
        packCode = "Classic";
    }
    token = packCode + "-" + token.substring(0, token.length - 1);
    return token;
}