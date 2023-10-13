const { authService, emailService } = require('../services');
const httpStatus = require('http-status');

const authController = {
    async register(req, res, next){
        try{
            const { email, password } = req.body;
            const user = await authService.createUser(email, password);
            const token = await authService.genAuthToken(user)

            //// send register email
            await emailService.registerEmail(email,user);

            res.cookie('x-access-token',token)
            .status(httpStatus.CREATED).send({
                user,
                token
            });
        } catch( error ){
            //console.log(error)
            next(error);
        }
    },
    async signin(req, res, next){
        try{
            const { email, password } = req.body;
            const user = await authService.signInWithEmailAndPassword(email, password);
            const token = await authService.genAuthToken(user)

            res.cookie('x-access-token',token)
            .send({ user, token});
        } catch(error){
            next(error);
        }
    },
    async isauth(req, res, next){
        res.json(req.user)
    },

    async seed(req, res, next){
        await authService.createUser("Admin@gmail.com", "admin123");

        for(let brand of ["Gibson", "Fender", "Martin", "Taylor", "PRS", "Ibanez", "Gretsch", "Epiphone", "Yamaha", "Godin" ]){
            await brandService.addBrand(brand)
        }
        res.send("seeded")
    }
}

module.exports = authController;