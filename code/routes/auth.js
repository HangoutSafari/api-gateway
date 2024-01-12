import express from 'express';
import * as dotenv from "dotenv";
import cors from 'cors';
import { createClient} from "@supabase/supabase-js";
import { getCurrentSession } from "../getCurrentSession.js"
const router = express.Router();
// TODO: Import variables from env
dotenv.config({ path: 'variables.env' });
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);


async function login(req, res) {
  try {
    const userData = req.body;
    const supabaseResponse = await loginUser(userData);
    const maxAge = 100 * 365 * 24 * 60 * 60 // 100 years, never expires
    res.set(
      'Set-Cookie', [`my-access-token=${supabaseResponse.session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`, `my-refresh-token=${supabaseResponse.session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
    ]);
    res.set("Access-Control-Allow-Credentials", "true");
    res.set("Access-Control-Allow-Origin", "http://localhost:5173");
    res.status(200).json(supabaseResponse);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
async function loginUser(userData) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: userData.email,
    password: userData.password,
  });
  if (error) {
    console.error('Error fetching animals', error);
    throw error;
  }
  return data;
}

router.options('/login', (req, res, next) => {
  try {
    res.header({
      allow: 'GET, POST, OPTIONS',
      'Content-type': 'application/json',
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin":"http://localhost:5173",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      Data: Date.now(),
      'Content-length': 0,
    });

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});
router.options('/register', (req, res, next) => {
  try {
    res.header({
      allow: 'GET, POST, OPTIONS',
      'Content-type': 'application/json',
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin":"http://localhost:5173",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      Data: Date.now(),
      'Content-length': 0,
    });

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});
router.options('/session', (req, res, next) => {
  try {
    res.header({
      allow: 'GET, POST, OPTIONS',
      'Content-type': 'application/json',
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin":"http://localhost:5173",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      Data: Date.now(),
      'Content-length': 0,
    });

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});


async function signUserUp(userData) {
  const {username, email, password} = userData;
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        username: username,
      },
    },
  });
  if (error){     
    console.error('query error', error);
    throw error;
  }
  return data;
}

async function postAuthDetails(req, res) {
  const userData = req.body;
  try{
    const value = await signUserUp(userData)
    res.status(200).json({ message: "Registration successful", data: value })
  }
  catch (err) {
    res.status(500).send(err.message);
  }
};

async function checkSession(req, res) {

    const supabaseInstance = await getCurrentSession(req);
    res.set("Access-Control-Allow-Credentials", "true");
    res.set("Access-Control-Allow-Origin", "http://localhost:5173");
    if (supabaseInstance["code"] == 0) {
      res.status(200).json({ message: "good session"});
    } else {;
      res.status(500).json({error: supabaseInstance["error"]});
    }
  
}

router.post('/login', login);
router.post('/register', cors(), postAuthDetails);
router.get('/session', checkSession)

export default router;
