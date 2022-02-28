
//configuracion para los socket del chat
//creamos una clase para el mensaje 
class Mensaje{

   constructor(uid,nombre,mensaje){
        this.uid=uid;
		this.nombre=nombre;
		this.mensaje=mensaje;
     }

}



//creamos un objeto con 2 parametros uno para almacenar los mensajes y el otro mostrar los usuarios
class ChatMensajes {
   constructor(){
        this.mensajes=[];
        this.usuarios={};
        this.mensajesPrivados=[];

     }
//obtenemos los 10 ultimos mensajes con splice primero ponemos en donde empieza y hasta que punto nos devuelva la informacion
    get ultimosMensajes(){
       this.mensajes=this.mensajes.splice(0,10);
      
       return this.mensajes;

		}
    get ultimosPrivados(){
          this.mensajesPrivados=this.mensajesPrivados.splice(0,10);
        return this.mensajesPrivados;
       }
//con Object.values no s devuelve todos los usuarios que tengo valor por eso lo hicimos en una clase
	get usuariosArr(){

		return Object.values(this.usuarios);
    }
   
	enviarMensaje(uid,nombre,mensaje){
    this.mensajes.unshift(
    new Mensaje(uid,nombre,mensaje)
	);
}
	enviarPrivado(uid,nombre,mensaje){
    this.mensajesPrivados.unshift(
    new Mensaje(uid,nombre,mensaje)
	);
}
//verificamos que usuario se ha conectado 
	conectarUsuario(usuario){

	this.usuarios[usuario.id]=usuario;
}
//eliminamos al usuario conectado 
   desconectarUsuario(id){
delete this.usuarios[id];
    }

}

module.exports=ChatMensajes;