const {Socket}=require('socket.io');
const {ComprobarTokenSocket}=require('../helpers');
//verificar el error al hacer destruturacion en node tal vez sea una nueva Actualizacion
const ChatMensajes=require('../models/chat-mensajes');

const chatMensajes= new ChatMensajes();
const chatPrivado=new ChatMensajes();
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
//enviamos los ultimos mensajes cuando uno se conecte
socket.emit('recibir-mensajes',chatMensajes.ultimosMensajes);

//desconectamo el usuario y hacemos limpieza de ello
socket.on('disconnect',()=>{
//elimanamos el usiaro en el array
chatMensajes.desconectarUsuario(usuario.id);
//enviamos o refrescamos los usuarios conectados
io.emit('usuarios-conectados',chatMensajes.usuariosArr);

});
//conectamos a una sala especial
//el socket join lo mandamos a una sala privada y de añadimos el id para hacer 
//y hacemos que todos lo usuarios esten identificado con el usuario.id
//referencia a esa sala estan en tres sala al mismo tiempo  en global , socket.id y usuario.id
socket.join(usuario.id);

//obtemos el mensaje y lo enviamos a todos los usuarios
socket.on('enviar-mensaje',({mensaje,uid})=>{
if(uid){
//con socket to enviamos mensaje al uid del usuario solo a el  creamos un objeto donde indicamos devuelva
//quien lo envia y el mensaje
chatPrivado.conectarUsuario(uid);
chatPrivado.enviarPrivado(uid,usuario.nombre, mensaje);
socket.to(uid).emit('mensaje-privado',chatPrivado.ultimosPrivados);
socket.emit('mensaje-privado',chatPrivado.ultimosPrivados);
}else{  
//guardamos nuestro objeto y guardamos  en la funcion de enviar mensaje
chatMensajes.enviarMensaje(usuario.uid,usuario.nombre,mensaje);
//enviamos a todos los usuarios el mensaje en forma de objeto
//cuidado por que puse en on en vez de emit 
io.emit('recibir-mensajes',(chatMensajes.ultimosMensajes));
}
})

}
module.exports={
socketController

}