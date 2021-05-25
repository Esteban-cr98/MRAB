const app = require('./src/config/server');

require('./src/routes/services')(app);

//Routes
//app.get('/', (req, res) => {
    //res.send('Hello pa')
//});
//app.use(require('./routes'));
//app.use(require('./routes/authentication'));
//app.use('/links',require('./routes/links'));

//require('routes/routes.js')(app);

//Staring server
app.listen(app.get('port'), ()=>{
    console.log('Server on port ', app.get('port'));
})