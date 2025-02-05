const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = requir
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/atm/deposit', (req, res) => {
	const spawn = require("child_process").spawn;
	const pythonProcess = spawn('python', ["ir_sensor.py"]);

	pythonProcess.stdout.on('data', (data) => {
		var prints = data.toString('utf8');
		prints = prints.split('\n');
		if (prints.length == 1) {
			res.status(500).send()
		} else if (prints.length >= 2) {
			res.status(200).send({
				count: prints[1]
			})
		}
	});
});

app.get('/api/atm/depositPersisted', (req, res) => {
	fs.readFile('./deposit.txt', 'utf8', (err, data) => {
		res.status(200).send({
			count: parseInt(data)
		})
	});
});

app.post('/api/atm/withdraw', (req, res) => {
	var rotations = req.body.amount;

	if (rotations > 0) {
		const spawn = require("child_process").spawn;
		const pythonProcess = spawn('python', ["servo.py", rotations]);

		pythonProcess.stdout.on('data', (data) => {
			var prints = data.toString('utf8');
			prints = prints.split('\n');
			if (prints.length == 1) {
				res.status(400).send()
			} else if (prints.length >= 2) {
				res.status(200).send()
			}
		});
	} else {
		res.status(400).send();
	}
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening to port ${port}`));
