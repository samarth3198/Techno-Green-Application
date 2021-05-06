var express = require('express');
var router = express.Router();
var meetupObject = require('../utility/connectionDB');
var session = require('express-session');

router.use(session({
    secret: 'eventSession',
    cookie: { secure: true }
}));

router.get('/*', async function(req, res){

    req.session.categories = await meetupObject.getAllCategories();
    req.session.events = await meetupObject.getAll();

    console.log('category is'+ req.session.categories);
    console.log('events is' + req.session.events);

    if(Object.keys(req.query).length === 0) {
        res.render('connections', { events: req.session.events, categories: req.session.categories, loggedIn: (req.session.users)? true: false });

    }
    else if(req.query.meetupId){

        if (req.query.meetupId) {
            var events = await meetupObject.getConnectionById(req.query.meetupId);
            if(events == null || events == undefined) {
                res.render('connections', { events : req.session.events, categories:req.session.categories, loggedIn: (req.session.users) ? true : false  });
            }
            res.render('connection', { events : events, loggedIn: (req.session.users) ? true : false  });
        }
        else {
            res.render('connections', { events : req.session.events, categories:req.session.categories, loggedIn: (req.session.users) ? true : false  });
        }
    }
    else {
        res.render('connections', { events : req.session.events, categories:req.session.categories, loggedIn: (req.session.users) ? true : false  });
    }   
});

module.exports = router;