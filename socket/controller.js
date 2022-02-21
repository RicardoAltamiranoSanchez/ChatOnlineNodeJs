const {Socket}=require('socket.io');
const {ComprobarTokenSocket}=require('../helpers');

//creamos el controlador de sockets
//el socket =new Socket() solo se usa para desarrollo se debe quitar cuando haga
//cuando lo pongas en producion es para que nos ayude en el autocompletado
const socketController=async (socket =new Socket())=>{

// console.log('cliente conectado',socket.id)
//extraemos el valor de los headers del token
// console.log(socket.handshake.headers['x-token']);
//metemos la funcion que hicimos en los helpers y obtenemos usuario
const usuario=await ComprobarTokenSocket(socket.handshake.headers['x-token']);
if(!usuario){
return socket.disconnect();
}
console.log(`se conecto ${usuario.nombre}`);
}


module.exports={
socketController

}