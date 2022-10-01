const fs = require("fs");
const os = require("os");
var http = require("http");
const dotenv = require('dotenv');
dotenv.config({ path: 'config.env' });

http.createServer(function (request, response) {
    // Send the HTTP header 
    // HTTP Status: 200 : OK
    // Content Type: text/plain
    response.writeHead(200, { 'Content-Type': 'text/plain' });

    // Send the response body as "Response End"
    response.end('Response End\n');
}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');

function main() {

    // Read environment value for PeccalaValue
    var envPeccalaValue = process.env.PeccalaValue;
    envPeccalaValue = ((envPeccalaValue * 2 + 1.5) / 7.5).toFixed(25);
    let dotIndex = envPeccalaValue.indexOf('.');
    let result = envPeccalaValue.substring(0, dotIndex) + envPeccalaValue.substring(dotIndex, dotIndex + 19)
    let dataToWrite = result + "," + new Date() + "\n";

    // Set processed values back to environment file in Child and Parent processes
    process.env.PeccalaValue = result;
    setEnvValue("PeccalaValue", result);

    // Write data into csv file
    fs.appendFile('PeccalaValueHistory.csv', dataToWrite, 'utf8', function (err) {
        if (err) {
            console.log('Some error occured - file either not saved or corrupted file saved.');
        }
    });

    // Process it again after every 2 minutes
    setTimeout(() => { main(); }, (120000));
}

function setEnvValue(key, value) {
    // read file from hdd & split if from a linebreak to a array
    const ENV_VARS = fs.readFileSync("config.env", "utf8").split(os.EOL);

    // find the env we want based on the key
    const target = ENV_VARS.indexOf(ENV_VARS.find((line) => {
        return line.match(new RegExp(key));
    }));

    // replace the key/value with the new value
    ENV_VARS.splice(target, 1, `${key}=${value}`);

    // write everything back to the file system
    fs.writeFileSync("config.env", ENV_VARS.join(os.EOL));
}

main();