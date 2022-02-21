

//rutas 
   var url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/Api/authentication/'
            : '';//Aqui el servidor de heroku

//hacemos la validacion de nuestro token en la parte del frontend



//validacion del token

const ValidarToken=async ()=>{

const token=localStorage.getItem('token') || '';
if(token.length <= 10){
window.location='index.html';
throw new Error('No hay token en el servidor');
}
try {
//enviamso el token a los heaers para pedir la peticion en el chat
const peticion=await fetch(url,{headers:{'x-token':token}});
//hacemos una destruturacion aqui si lo puedo hacer  pero de asiganmos un valor para poder mostrarlo
const {usuario:usuariodb,token:tokendb}=await peticion.json();
console.log(`Dede le archvo chat.js ${usuariodb}::${tokendb}`);
//volvemo a establecer el token con el renovar token para no limitar el tiempo que ese conectado el usuario
localStorage.setItem('token',tokendb);
//guardamo los datos del usuario ingresalo para verificar quien esta conectado
document.title=usuariodb.nombre;

//hacemos la conexion al socket 
await ConectandoSocket();

} catch (error) {
console.error(`Error en la petcion al servidor ${error}`);	
}
}

//conectamos el socket

const ConectandoSocket=async ()=>{
//mandamos la informacion por el token para la verificacion o conexion va caer en el controlador del toke
const socket=await io({
//extraHeaders son parametros ya predifinidos en socket io
'extraHeaders':{
  'x-token':localStorage.getItem('token')    
}
});

}



const main=async ()=>{

//validamos el token
await ValidarToken();

}


main();




// hacemos una conexion con io la funcion para poder tener comunicacion con el backend
// const socket =io();




























