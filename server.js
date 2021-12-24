import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';
import register from './controllers/register.js'
import signin from './controllers/signin.js'
import image from './controllers/image.js'
import profile from './controllers/profile.js'

const db = knex({client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '1234',
      database : 'smart-brain'
    }
  });

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());


app.get('/', (req, res)=>{
    //res.send('success');
})

app.post('/signin', (req, res) =>{signin(req, res, db, bcrypt)});

app.post('/register', (req, res) => { register(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => {profile(req, res, db)});

app.put('/image', (req, res) => {image(req, res, db)});

app.listen(3002, ()=>{
    console.log('app is running on port 3002')
})


