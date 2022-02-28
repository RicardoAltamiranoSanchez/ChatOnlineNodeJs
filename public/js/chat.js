//rutas
var url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080/Api/authentication/"
  : ""; //Aqui el servidor de heroku

//hacemos la validacion de nuestro token en la parte del frontend
let socket=null;
//Referencias html
const txtUid = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");
const ulPrivado = document.querySelector("#ulPrivado");
const btnSalir = document.querySelector("#btnSalir");

//validacion del token

const ValidarToken = async () => {
  const token = localStorage.getItem("token") || "";
  if (token.length <= 10) {
    window.location = "index.html";
    throw new Error("No hay token en el servidor");
  }
  try {
    //enviamso el token a los heaers para pedir la peticion en el chat
    const peticion = await fetch(url, { headers: { "x-token": token } });
    //hacemos una destruturacion aqui si lo puedo hacer  pero de asiganmos un valor para poder mostrarlo
    const { usuario: usuariodb, token: tokendb } = await peticion.json();
    console.log(`Dede le archvo chat.js ${usuariodb}::${tokendb}`);
    //volvemo a establecer el token con el renovar token para no limitar el tiempo que ese conectado el usuario
    localStorage.setItem("token", tokendb);
    //guardamo los datos del usuario ingresalo para verificar quien esta conectado
    document.title = usuariodb.nombre;

    //hacemos la conexion al socket
    await ConectandoSocket();
  } catch (error) {
    console.error(`Error en la petcion al servidor ${error}`);
  }
};

//conectamos el socket

const ConectandoSocket = async () => {
  //mandamos la informacion por el token para la verificacion o conexion va caer en el controlador del toke
socket = await io({
    //extraHeaders son parametros ya predifinidos en socket io
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
    },
  });

  socket.on("connect", () => {
    console.log("Socket conectado");
  });

  socket.on("disconnect", () => {
    console.log("Socket desconectado");
  });

  socket.on("recibir-mensajes", (playlod) => {
console.log(playlod);
RecibirMensajes (playlod);

});

  socket.on("usuarios-conectados", (playlod) => {
  //el playload vienen del backend en controllers.js
    UsuariosConectados(playlod);
  });

  socket.on("mensaje-privado", (playlod) => {
  console.log("Privado",playlod);
   RecibirPrivado(playlod);
});
};
//hacemos el html de usuarios conectados el playlod es la informacion de usuario conectado de nuestra clas
const UsuariosConectados = (playlod) => {
//creamos una variable para meter los usuarios conectados
  let usuarioHtml = "";
//hacemos el forEach para almaceanr todos los usuarios el playload viene del socket
  playlod.forEach((u) => {
//vamos guardando todos los usuarios con el + creando nuevo elemneto cada
//vex que uno e connecte
    usuarioHtml+=` 
         <li>
            <p>
                <h5 class="text-success">${u.nombre}</h5>
                <span class="fs-6 text-muted">${u.uid}</span>
            </p>

         </li>

         `;

   });
//solo hacemos un nuevo html para mostrar los usuarios
ulUsuarios.innerHTML=usuarioHtml;

};
const RecibirMensajes = (playlod) => {
  let mensajeHtml = "";
  playlod.forEach((u) => {
    mensajeHtml+=` 
         <li>
            <p>
                <span class="text-primary">${u.nombre}</span>
                <span >${u.mensaje}</span>
            </p>

         </li>

         `;

   });
//solo hacemos un nuevo html para mostrar los usuarios
ulMensajes.innerHTML=mensajeHtml;

};
const RecibirPrivado = (playlod) => {
  let mensajeHtml = "";
  playlod.forEach((u) => {
    mensajeHtml+=` 
         <li>
            <p>
                <span class="text-primary">${u.nombre}</span>
                <span >${u.mensaje}</span>
            </p>

         </li>

         `;

   });
//solo hacemos un nuevo html para mostrar los usuarios
ulPrivado.innerHTML=mensajeHtml;

};




//mostramos los mensajes en la consola el keyup es para mostrar la informacion de la tecla que oprimimos
txtMensaje.addEventListener('keyup',(e)=>{
//obtenemos el valor del codigo de la tecla que oprimimos en
//si el valor es 13 es para el enter

const {keyCode}=e;

const mensaje=txtMensaje.value;
const uid=txtUid.value;
if(keyCode !==13){return;}
if(mensaje.length===0){return;}
socket.emit('enviar-mensaje',{mensaje,uid});
txtMensaje.value="";

})

btnSalir.addEventListener('click', () => {

  localStorage.removeItem('token');

    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then( () => {
        console.log('User signed out.');
        window.location = 'index.html';
    });

});


        


const main = async () => {
  //validamos el token
  await ValidarToken();
};
//lo importamos para eliminar el google id importante eta funcion
(()=>{
    gapi.load('auth2', () => {
        gapi.auth2.init();
        main();
    });
})();

main();

// hacemos una conexion con io la funcion para poder tener comunicacion con el backend
// const socket =io();
