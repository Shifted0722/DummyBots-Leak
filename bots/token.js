module.exports = function token() {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 5; i++) {
        for (let a = 0; a < 7; a++) token += possible.charAt(Math.floor(Math.random() * possible.length));
        token += '-';
    }
    token = token.substring(0, token.length - 1);
    return token;
}