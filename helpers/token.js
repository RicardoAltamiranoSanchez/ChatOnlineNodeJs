//importamos para generar el token 
const jwt = require('jsonwebtoken');
const Usuario =require("../models/usuario");
const generarToken=  (uid ="" ) => {
return new Promise ((resolve,reject)=>{
        //hacemos el playlod solo informacion que no sea importante
        const playlod={uid};
        //este es un metodo de jwt para hcer el token indicamos el primer parametro
        //que es de que infromacion va utilizar para generar el token
        //en el segundo es la llave secreta que hicimos de una via
        //se hace desde el modo global osea desde env
        jwt.sign(playlod,process.env.SECRETORPRIVATEKEY,{
        //este cuando expira el token 
           expiresIn:"4h"
        },(error,token)=>{
        //aqui solo hacemos un callback des envio de error o resultados 
            if(error){
                console.log(error);
                reject("No se pudo generar el token");
            }else{
                resolve(token)
            }
        })  
    }
  )
}
//comprobamos el token del socket
const ComprobarTokenSocket=async (token="")=>{
try {
//verificamos si el token no esta vacio
if(token.length < 10){
    return null;
  }
//desecriptamos el token y obtenemos el uid des usuario conectado
const {uid}=jwt.verify(token,process.env.SECRETORPRIVATEKEY);    
//obtenemos el usuario desde nuestro servidor atlas
console.log('el uid de desd el token js :'+uid);

  

const usuario= await Usuario.findById(uid);
console.log('el usuario de desd el token js :'+usuario);
if(usuario){
   if(usuario.estado){
    return usuario;
}else{
return null;
}

}else{
return null;
}

} catch (error) {
    console.log(`Hubo un error en ComprobarToken ${error}`);
return null;
}

}

module.exports={
    generarToken,
ComprobarTokenSocket
}