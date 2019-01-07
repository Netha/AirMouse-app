require('./renderer.js')

const remote = require('electron').remote;

document.getElementById('exit').addEventListener('click', ()=>{
    var window = remote.getCurrentWindow();
    window.close();
})


var os = require('os');
var interfaces = os.networkInterfaces();
for (var k in interfaces) {
    if (k == 'Wi-Fi') {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];

            if (address.family === 'IPv4' && !address.internal) {
                console.log(address.address);
                new QRCode("qrcode").makeCode(`http://${address.address}:8080`);
                document.getElementById('ip').innerText = `http://${address.address}:8080`;
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

