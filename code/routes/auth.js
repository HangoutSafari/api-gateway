import express from 'express';
import cors from 'cors';
import { createClient} from "@supabase/supabase-js";
const router = express.Router();
// TODO: Import variables from env
const supabase = createClient(
    'supabaseUrl',
    'supabaseKey'
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

router.post('/login', login);
router.post('/register', cors(), postAuthDetails);


export default router;
