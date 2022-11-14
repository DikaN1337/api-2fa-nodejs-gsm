let serialportgsm = require('serialport-gsm');
let modem = serialportgsm.Modem();

const express = require('express');  
const app = express();
let port = 5013;

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
	pin: '2525',
	customInitCommand: ''
}

modem.open('COM5', options, {});

const server = app.listen(5013, function () {  
    console.log("2FA API listened at http://127.0.0.1:5013/");
});

app.get('/send2facode', function (req, res) {  
        const apikey = req.query.apikey;
		const number = req.query.number;
        const code = req.query.code;
		const text = "O teu Codigo da EXPOSIT.XYZ é " + code + ". Expira em 5 minutos!";

        if (apikey === "JBJHSiJbM5sN6YOaQFWzlp7q0n9vBGW92JVL9f3N") {
            modem.sendSMS('+351' + number, text, false, (data) => {});
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
			modem.sendSMS('+351963681103', 'Modem ON!', false, (data) => {});
		});
    })
});

modem.on('onNewIncomingCall', result => {
	modem.executeCommand("ATA", (data) => {});
	modem.executeCommand("ATH", (data) => {});
	let numberCalled = result.data.number;
	modem.sendSMS('+351' + numberCalled, 'Obrigado por ligares para a EXPOSIT.XYZ, este numero não permite receber chamadas. Entra em contacto pelo nosso Website em https://support.exposit.xyz/ !', false, (data) => {});
});