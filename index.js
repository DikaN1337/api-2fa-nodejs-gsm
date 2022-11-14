let serialportgsm = require('serialport-gsm');
let modem = serialportgsm.Modem();

const config = require('config');
const express = require('express');  
const app = express();
const port = config.get('port');
const pincode = config.get('pincode');
const apikeyconfig = config.get('apikey');
const numberowner = config.get('numberowner');
const countrycode = config.get('countrycode');
const serialportid = config.get('serialportid');
const twofaname = config.get('twofaname');
const expireminutes = config.get('expireminutes');
const supportsite = config.get('supportsite');

app.use(express.static('public'));  

const options = {
	baudRate: 115200,
	dataBits: 8,
	stopBits: 1,
	parity: 'none',
	rtscts: false,
	xon: false,
	xoff: false,
	xany: false,
	autoDeleteOnReceive: true,
	enableConcatenation: true,
	incomingCallIndication: true,
	incomingSMSIndication: true,
	pin: pincode,
	customInitCommand: ''
}

modem.open(serialportid, options, {});

const server = app.listen(port, function () {  
    console.log("2FA API listened at http://127.0.0.1:" + port + "/");
});

app.get('/send2facode', function (req, res) {  
        const apikey = req.query.apikey;
		const number = req.query.number;
        const code = req.query.code;
		const text = "O teu codigo da " + twofaname + " é " + code + ". Expira em " + expireminutes + " minutos!";

        if (apikey === apikeyconfig) {
            modem.sendSMS('+' + countrycode + number, text, false, (data) => {});
            const response  = [{
				code: 200, 
				message: 'success'
			}];
            res.json(response);  
            
        } else {
            const response1  = [{
				code: 1001, 
				message: 'Invalid API Key'
			}];
            res.json(response1);  
        }
});

modem.on('open', data => {	
    modem.initializeModem((data) => {
		modem.getOwnNumber((dataNumber) => {
			console.log("Modem ON with the number: " + dataNumber.data.number + "!");
			modem.sendSMS('+' + countrycode + numberowner, 'Modem ON!', false, (data) => {});
		});
    })
});

modem.on('onNewIncomingCall', result => {
	modem.executeCommand("ATA", (data) => {});
	modem.executeCommand("ATH", (data) => {});
	let numberCalled = result.data.number;
	modem.sendSMS('+' + countrycode + numberCalled, 'Obrigado por ligares para a ' + twofaname + ', este numero não permite receber chamadas. Entra em contacto pelo nosso Website em ' + supportsite + ' !', false, (data) => {});
});