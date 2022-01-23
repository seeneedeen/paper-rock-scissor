const net = require('net');
const { off } = require('process');

const host = 'localhost';
const port = 8000;
let playerNum = 0;
let players = Object.create(null);
let sockets = [];
let currentPlayer = 1;
let choice1 = '';
let choice2 = '';

const server = net.createServer();
server.listen(port, host, () => {
  console.log(`TCP server listening on ${host}:${port}`);
});

server.on('connection', (socket) => {
  playerNum++;
  socket.nickname = `player${playerNum}`;
  var clientName = socket.nickname;

  players[clientName] = socket;

  var clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  console.log(`new client connected: ${clientAddress}`);
  sockets.push(socket);
  players['player1'].write('Choose: paper scissor hammer');
  socket.on('data', (data) => {
    console.log(`Client ${clientAddress}: ${data}`);
    switch (currentPlayer) {
      case 1:
        if (
          data.includes('scissor') ||
          data.includes('paper') ||
          data.includes('hammer')
        ) {
          choice1 = data
          players[`player1`].write('you choose ' + data);
          currentPlayer++;
          players[`player${currentPlayer}`].write('Choose: paper scissor hammer')
        }
        break;
      case 2:
        if (
          data.includes('scissor') ||
          data.includes('paper') ||
          data.includes('hammer')
        ) {
          choice2 = data
          players[`player2`].write('you choose ' + data);
          if (choice1 == "hammer" ){
              if(choice2 == "hammer"){
                players[`player1`].write("DRAW");
                players[`player2`].write("DRAW");
            }
              else if(choice2 == "scissor"){
                players[`player1`].write("YOU WIN");
                players[`player2`].write("YOU LOSE");
            }
              else if(choice2 == "paper"){
                players[`player1`].write("YOU LOSE");
                players[`player2`].write("YOU WIN");
            }
          }
          else if(choice1 == "scissor"){
              if(choice2 == "hammer"){
                players[`player1`].write("YOU LOSE");
                players[`player2`].write("YOU WIN");
              }
              else if(choice2 == "scissor"){
                players[`player1`].write("DRAW");
                players[`player2`].write("DRAW");
              }
              else if(choice2 == "papaer"){
                players[`player1`].write("YOU WIN");
                players[`player2`].write("YOU LOSE");
              }
          }
        
          else if(choice1 == "paper"){
              if(choice2 == "hammer"){
                players[`player1`].write("YOU WIN");
                players[`player2`].write("YOU LOSE");
              }
              else if(choice2 == "scissor"){
                players[`player1`].write("YOU LOSE");
                players[`player2`].write("YOU WIN");
              }
              else if(choice2 == "paper"){
                players[`player1`].write("DRAW");
                players[`player2`].write("DRAW");
              }
          }
        }
        break;
    }
  });

  socket.on('close', () => {
    delete players[socket.nickname];
    let index = sockets.findIndex((disconnectedClient) => {
      return (
        disconnectedClient.remoteAddress === socket.remoteAddress &&
        disconnectedClient.remotePort === socket.remotePort
      );
    });
    if (index !== -1) sockets.splice(index, 1);
    sockets.forEach((sock) => {
      sock.write(`${clientAddress} disconnected\n`);
    });
    console.log(`connection closed: ${clientAddress}`);
  });

  socket.on('error', (err) => {
    console.log(`Error occurred in ${clientAddress}: ${err.message}`);
  });
});