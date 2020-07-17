
/** Start of the HeptiHex program
 *  @param {object} io Socket.io server object  
 */
var init = function(io) {
	
	io.on('connection', function(socket) {
		console.log('A user just connected to the game.');
	
		socket.on('disconnect', function() {
			console.log('A user just disconnected from the game.');
		});
	});
	
}

module.exports = init;