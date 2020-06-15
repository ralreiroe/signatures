#!/usr/bin/env node

const yargs = require("yargs");
// const yargs = require("crypto");
const signature = require('cookie-signature');

const options = yargs
    .usage("Usage: -n <name>")
    .option("n", { alias: "name", describe: "Your name", type: "string", demandOption: true })
    .argv;

const greeting = `Hello, ${options.name}!`;


function decryptCookie(encrypted, secrets) {    //rro-recompute hmac on session id and compare
    if ('string' !== typeof encrypted) {
        console.log('decryptCookie: cookie header not set');
        return { sid: null, index: -1 };
    }

    if (encrypted.substr(0, 2) !== 's:') {
        // cookie not encrypted
        console.log('decryptCookie: cookie header not encrypted');
        return { sid: null, index: -1 };
    }

    encrypted = encrypted.slice(2);

    console.log('decryptCookie: cookie secrets: %j', secrets);
    for (var i = 0; i < secrets.length; i++) {
        var result = signature.unsign(encrypted, secrets[i]);       //rrologin-cookie decryption

        if (result !== false) {
            return { sid: result, index: i };
        }
    }

    console.log('unable to decrypt cookie header');

    return { sid: null, index: -1 };
}


function encryptCookie(raw, secrets) {
    return 's:' + signature.sign(raw, secrets[0]);
}





//url-encoded cookie value
// const cookie = "s%3APdRFikwItx4EifatLHrL2ehAbJaL8OBO.rzloyjmQ6V8SbzwMNKnZmmqDuRPczuBCxeMEBHb0C%2BE"
// const cookie = "s:w3lFwHRpjVVBCQiYlLWWofWFw3Kq02Vm.KshETJ3w4ZKEojfgnsrIslwamx8/u2JMkjgpc9dF7ME"
const cookie = "s:aGHvm4ZUkBvqRJF4t6kyIuRSGdxmovWm.J9c7iYk62qn14oy+ZopH+Q6y9XJt8PD4xVZ8aYz9jz0"

const sid1 = signature.unsign('aGHvm4ZUkBvqRJF4t6kyIuRSGdxmovWm.J9c7iYk62qn14oy+ZopH+Q6y9XJt8PD4xVZ8aYz9jz0', 'right_secret')
// const sid2 = signature.unsign("3APdRFikwItx4EifatLHrL2ehAbJaL8OBO.rzloyjmQ6V8SbzwMNKnZmmqDuRPczuBCxeMEBHb0C%2BE", "right_secret")
const sid3 = decryptCookie(cookie, ["right_secret"])

const sessionId = "aGHvm4ZUkBvqRJF4t6kyIuRSGdxmovWm"
const encryptedSessionId = encryptCookie("aGHvm4ZUkBvqRJF4t6kyIuRSGdxmovWm", ["right_secret"])
const decryptedSessionId = decryptCookie(encryptedSessionId, ["right_secret"])
const decryptAttemptWithWrongSecret = decryptCookie(encryptedSessionId, ["wrong_secret"])


console.log(greeting);
console.log(sid1);
// console.log(sid2);
console.log(sid3);
console.log("sessionId" + sessionId)
console.log("encryptedSessionId: " + encryptedSessionId)
console.log("decryptedSessionId: ")
console.log(decryptedSessionId)
console.log("decryptAttemptWithWrongSecret: ")
console.log(decryptAttemptWithWrongSecret)
