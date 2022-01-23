const net = require('net');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const rl = readline.createInterface({ input, output });

const HOST = 'localhost';
const PORT = 8000;

var client = new net.Socket();
client.connect(PORT, HOST, () => {
  console.log(`Connected to ${HOST}:${PORT}`);
  client.write(`Hello, I am ${client.address().address}`);
});

client.on('data', (data) => {
  console.log(`Client received: ${data}`);
  if (data.includes('Choose')) {
    rl.question('What do you choose?', (answer) => {
      console.log(`${answer}`);
      client.write(answer)
      rl.close();
    });
  }
});

client.on('close', () => {
  console.log('Client closed');
});

client.on('error', (err) => {
  console.error(err);
});