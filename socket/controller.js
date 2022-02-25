const {Socket}=require('socket.io');
const {ComprobarTokenSocket}=require('../helpers');
//verificar el error al hacer destruturacion en node tal vez sea una nueva Actualizacion
const ChatMensajes=require('../models/chat-mensajes');

const chatMensajes= new ChatMensajes();

//creamos el controlador de sockets
//el socket =new Socket() solo se usa para desarrollo se debe quitar cuando haga
//cuando lo pongas en producion es para que nos ayude en el autocompletado
const socketController=async (socket =new Socket(),io)=>{

// console.log('cliente conectado',socket.id)
//extraemos el valor de los headers del token
// console.log(socket.handshake.headers['x-token']);
//metemos la funcion que hicimos en los helpers y obtenemos usuario
const usuario=await ComprobarTokenSocket(socket.handshake.headers['x-token']);
if(!usuario){
return socket.disconnect();
}


//importamos la clase y ya que obtenemos la autenticacion del usuario lo guardamos 
//en la clase chatMensajes.conectarUsuario
chatMensajes.conectarUsuario(usuario);
//ya no ponemos el socket.brocast por que el io es para todo el mundo por eso lo llamamos en la funcion
//enviamos todos los usuarios que esten conectados 
io.emit('usuarios-conectados',chatMensajes.usuariosArr);

//desconectamo el usuario y hacemos limpieza de ello
socket.on('disconnect',()=>{
//elimanamos el usiaro en el array
chatMensajes.desconectarUsuario(usuario.id);
//enviamos o refrescamos los usuarios conectados
io.emit('usuarios-conectados',chatMensajes.usuariosArr);

})



}
module.exports={
socketController

}