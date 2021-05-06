var express =  require('express');
var router = express.Router();
var session = require('express-session');
var meetupObject = require('../utility/connectionDB');
var bodyParser = require('body-parser');
var urlEncodedParser = bodyParser.urlencoded({ extended: false });
const {check, validationResult } = require('express-validator');

router.use(session({
    secret: 'eventSession',
    cookie: { secure: true }
}));

//Validating the inputs of new Connection
router.post('/*', urlEncodedParser, [

    check('topic').isString().isLength({min:5}).withMessage('Category of the meetup should be more than 5 characters.'),
    check('name').isString().isLength({min:4}).withMessage('Name of the meetup should be more than 4 characters.'),
    check('details').isString().isLength({min:4}).withMessage('Please at least enter the details of event of more than 4 characters.'),
    check('time').isString().isLength({min:3}).withMessage('Please enter time in proper format.'),
    check('date').isString().isLength({min:6}).withMessage('Please mention the date in MM-DD-YY format.'),
    check('userEvents').custom((value, {req}) => {
        if(req.session.userEvents === null || req.session.userEvents === undefined){
            throw new Error('Please add the event once you login');
        }else {
            return true;
        }
    })
], async(req, res) => {

    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        console.log(req);
        console.log('Errors in Event');
        return res.render('newConnection', { loggedIn: (req.session.users) ? true : false, errors: errors.array() });
    }

    await meetupObject.addConnection(req.body);
    return res.redirect('/connections');
})

module.exports = router;