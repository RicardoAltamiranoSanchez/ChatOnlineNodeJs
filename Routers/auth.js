
const{Router}= require('express');
const {check} = require('express-validator');
const {login,googleSingin,renovarToken}=require('../controllers/auth');
const {validarCampos,validarToken}=require('../middleware');


const router=Router();

router.post('/login',[
check("correo","Este email no es valido").isEmail(),
validarCampos],login);



//es para la authenticacion de google utilizando su api  de out2
router.post('/google',[
   check('nombre','El nombre es obligatorio').not().isEmpty()
   
],googleSingin);
//validamos el token en la pagina principla para verificar si es un usuario verificado
router.get('/',validarToken,renovarToken)
module.exports= router;
