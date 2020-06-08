var WebSocketServer = require('websocket').server;
var http = require('http');

const { uuid } = require('uuidv4');
const app = require('express')();
const server = require('http').Server(app);

var whosPlaying = {};	// We use this to store useful information keyed by connection id

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});
 
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

function broadcast( messageType, currentState )
{		
    let numPlayers = Object.entries(whosPlaying).length;
	
	var data = { messageType : messageType,
				 currentState : currentState,
				 numPlayers : numPlayers };
	var msg = JSON.stringify(data);
	
	console.log( "Broadcasting message: " + msg );
	
	for (let [key, value] of Object.entries(whosPlaying))
	{
		value[ 'connection' ].send( msg );
	}
}

wsServer.on('request', function(request)
{
    if (!originIsAllowed(request.origin))
	{
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
	// Accept the connection
    var connection = request.accept('echo-protocol', request.origin);
		
	// Assign our own ID
	connection.id = uuid();	

	console.log((new Date()) + ' Connection accepted. id = ' + connection.id);
	
	// Add a player
	//   adding the connection
	//   add a blank state for them to be filled later
	whosPlaying[connection.id] = { connection : connection,
								   currentState : "" };
								   
    // Tell all the clients someone has joined								   
	broadcast( "update", null );

	// Respond to a message
	connection.on('message', function(message)
	{
		// https://stackoverflow.com/questions/13364243/websocketserver-node-js-how-to-differentiate-clients
        if (message.type === 'utf8')
		{
			// Print out the received message
            console.log('Received Message: ' + message.utf8Data);
			
			// Update the state
			whosPlaying[connection.id]['currentState'] = message.utf8Data;
			
			// Do snake logic here
			if( message.utf8Data == "waiting" )
			{
				// Check all clients are waiting
				var everyoneWaiting = true;
				
				for (let [key, value] of Object.entries(whosPlaying))
				{
					if( value['currentState'] != "waiting" )
					{
						everyoneWaiting = false;
					}
				}
				
				if( everyoneWaiting )
				{
					broadcast( "state", "connected" );
				}
				else
				{
					console.log( "Waiting for connections" );
				}
			}
			else if( message.utf8Data == "paused" )
			{
				broadcast( "state", "paused" );				
			}
        }
    });
	
	// Respond to a close event
    connection.on('close', function(reasonCode, description)
	{
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
		
		// Delete the connection
		delete whosPlaying[connection.id];
		
		// Tell all the clients someone has left								   
		broadcast( "update", null );
    });
});

app.get('/', (req, res) =>
{
	res.sendFile(__dirname + '/game.html');
});

app.get('/stopwatch.js', (req, res) =>
{
	res.sendFile(__dirname + '/stopwatch.js');
});

app.get('/game.css', (req, res) =>
{
	res.sendFile(__dirname + '/game.css');
});

app.get('/game.html', (req, res) =>
{
	res.sendFile(__dirname + '/game.html');
});

app.get('/game.js', (req, res) =>
{
	res.sendFile(__dirname + '/game.js');
});

server.listen(80);