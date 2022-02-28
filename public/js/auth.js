//configuracion de google y validacion del token en el backend  

       console.log(window.location.hostname.includes('localhost'));

const miformulario=document.querySelector('form');//obtenemos el formulario


       var url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/Api/authentication/'
            : '';//Aqui el servidor de heroku




miformulario.addEventListener('submit',(ev)  =>{
ev.preventDefault();
const InformacionFormulario={};//variable para meter la informacion del Informacio del formulario
for(let elemento of miformulario.elements ){//el of es como el foreach buscamos en todos los elemnetos del formulario
   if(elemento.name.length > 0){//de decimos si tiene algo en un elemento
     InformacionFormulario[elemento.name]=elemento.value;//guardamos los valores en la variable del formulario llave valor el nombre del elemento adentro y el = el valor del elemento
    }
}
fetch(url+"login",{
method: 'POST',
headers:{"Content-Type":"application/json"},
body: JSON.stringify(InformacionFormulario),

})
.then((res)=> res.json())
.then(({msg,token})=>{//hacemos destruturacion para obteneer el token directamente
if(msg){
return console.error(msg)
}
localStorage.setItem('token',token);//guardamos el token el local store
document.location='chat.html';//cuando ya pasamos todo el proceso y este verificado pasamos al chat html

})
.catch((error)=>{console.log(`Hubo un error en la peticon en login ${error}`)});

})

            




            //Hacemos la validacion del token de google atravez de su api 
            function onSignIn(googleUser) {
                //   var profile = googleUser.getBasicProfile();
                //   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
                //   console.log('Name: ' + profile.getName());
                //   console.log('Image URL: ' + profile.getImageUrl());
                //   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
                 
                  //nos devuelven el token de google para la autenticacion 
                  var id_token = googleUser.getAuthResponse().id_token;
                 const data ={id_token};
                  
                  // console.log(id_token);                              
             try {
                  fetch( url+'google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( data )
            })
            .then( resp =>   resp.json() )
            .then( ({token}) => {//hacemos destrururacion para obtener el token la validacion de campos en la rutas de goggle no agarra la validcacion si lo ponemos
                
               localStorage.setItem('token',token),
                  document.location="chat.html";
}
        
 )
            .catch( console.warn );
             } catch (error) {
                 console.log(`Error en la peticion  de google ${error}`);
             }





            
        }
                 //Aqui para salirno de la autenticacion del google
                 function signOut() {
                   var auth2 = gapi.auth2.getAuthInstance();
                   auth2.signOut().then(function () {
                   console.log('User signed out.');

                   });
                   }
  
