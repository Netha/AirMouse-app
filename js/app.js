require('./renderer.js')

const remote = require('electron').remote;
var os = require('os');
const io = require('socket.io-client');


document.getElementById('exit').addEventListener('click', ()=>{
    var window = remote.getCurrentWindow();
    window.close();
})



var interfaces = os.networkInterfaces();
for (var k in interfaces) {
    if (k.toLowerCase().indexOf('wi-fi') > -1 || k.toLowerCase().indexOf('ethernet') > -1) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            
            console.log(`interfaces: ${address.family} - ${address.internal}`);

            if (address.family === 'IPv4' && !address.internal) {
                console.log(address.address);
                document.getElementById('ip').innerText = `http://${address.address}:8080`;
                 new QRCode("qrcode").makeCode(`http://${address.address}:8080`);

            }
        }
    }
}


var socket = io.connect('http://localhost:81');

if (socket !== undefined) {
    socket.on('status', function (data) {
        if (data == 'online') {
            document.body.classList.add('active');
        }
        if (data == 'offline') {
            document.body.classList.remove('active');
        }
        console.log(data)
    })
}

