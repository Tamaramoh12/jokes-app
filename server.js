'use strict';
//Configuration//////////////////////////////////////////////////////////////////////////////////////////////

let express = require('express');
let cors = require('cors');
let superagent = require('superagent');
let pg = require('pg');
let methodOverride = require('method-override');

require('dotenv').config();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

//Get Data From API//////////////////////////////////////////////////////////////////////////////////////////
app.get('/home', handleHome);

function handleHome(request, response) {
    let jokesArr = [];
    let url = 'https://official-joke-api.appspot.com/jokes/programming/ten';
    superagent.get(url).then(data => {
        // response.send(data.body);
        let API_Data = data.body;
        API_Data.forEach(data => {
            var jokeObj = new Joke(data);
            jokesArr.push(jokeObj);
        });
        response.render('home', { jokesArray: jokesArr });
    }).catch((error) => {
        console.log('error in handleHome', error);
    });
}

function Joke(data) {
    this.jokeNumber = data.id;
    this.type = data.type;
    this.setup = data.setup;
    this.punchline = data.punchline;
}
//Insert Joke To DB////////////////////////////////////////////////////////////////////////////////////////////
app.post('/toDB',handleInsert);

function handleInsert(request,response){
    // response.send(request.body);
    let queryStatement = `INSERT INTO jokes(type,setup,punchline) VALUES ($1,$2,$3);`;
    let bodyRequest = request.body;
    let values = [bodyRequest.type,bodyRequest.setup,bodyRequest.punchline];
    console.log('inserted to DB');
    client.query(queryStatement,values).then(()=>{
        response.redirect('/fav');
    }).catch((error)=>{
        console.log('error in handleInsert' , error);
    });
}
//Display jokes from DB//////////////////////////////////////////////////////////////////////////////////////////
app.get('/fav',handleFvorite);

function handleFvorite(request,response){
    // response.send('hiii');
}
//Connect////////////////////////////////////////////////////////////////////////////////////////////////
client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`app is listen on port: ${PORT}`);
    });
}).catch((error)=>{
    console.log('error connecting to DB' , error);
});
