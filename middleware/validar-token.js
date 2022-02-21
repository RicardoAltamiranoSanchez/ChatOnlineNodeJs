//importampos le jsonweb token
const { response, request } = require('express')
const jwt =require('jsonwebtoken');
//tip me marco error al hacer la importacion tuve que quitar los {}
//creo que paso esto por la nueva actualizacion de javascript
const Usuario=require('../models/usuario.js');

//los middleware siempre seran funciones de fechas se usan solo para validaciones
const validarToken= async (req=request,res=response,next) => {
        //obtnemos los headers las cabeceras  del token cuidado con poner comillas dobles marca error
    const token =  req.header('x-token');
 
    if(!token){

        return res.status(401).json({

            msg:`\nPARA HACER ESTA VALIDACION\n
            \nFALTA AUTENTICACIOIN DE TOKEN O TU TOKEN NO ES VALIDO.`
        });
    }
    try {
        //usamos esta funcion para verificar el tojen la de veri y obtenemos el uid por que solo de dimo el uid almomento de hacer el token
        const  Informacion=jwt.verify(token,process.env.SECRETORPRIVATEKEY);
console.log("Desde validar token  Informacion:"+Informacion);
       const {uid}=Informacion;
console.log("uid"+uid);
        //creamos una propiedad nueva para poder usarla en las demas plantillas
         //obtenemos el valor y en usuario.findByid buscamos por el id
         //lemmos el usuario
         const usuario = await Usuario.findById( uid );

          
          
      
        //verificamos si existe el usuario
       if(!usuario){
           return res.status(401).json({
               msg:"No existe el usuario"
           })

       }
        //verificamos si el usuario esta el false inactivo
       if(!usuario.estado){

           return res.status(401).json({
               msg:"El usuario esta false"
           })
       }
       //lo guardamos en una varible  para despues utilizarla en otras plantillas por ejemplo en la de categoria
         req.usuario=usuario;
         next();
         console.log(`Desde validar el token ${req.usuario}`);
        
    } catch (error) {
        console.error(`Error en el archivo de validar-token ${error}`);

        
    }
    
    

next();
}


module.exports={
    validarToken
}