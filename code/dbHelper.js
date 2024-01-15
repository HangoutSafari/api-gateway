import * as dotenv from "dotenv";

import { createClient} from "@supabase/supabase-js";

dotenv.config({ path: 'variables.env' });
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export async function getCurrentSession(req) {
  const cookies = req.headers.cookie;
  if (cookies == null) return { code: 1, error: "cookies error"};
  const access_token = cookies.split('; ')[0].split('=')[1];
  const refresh_token = cookies.split('; ')[1].split('=')[1];
  const { sessionData, sessionError } = supabase.auth.setSession({
    access_token,
    refresh_token,
  })
  if (sessionError) {
    console.error('session error', sessionError);
    return { code: 1, error: "supabaseError"};
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { code:0, client: supabase};
}

export async function getDataFrom(req, res, tableName, id = null) {
  const {data, error} = await getData(supabase, tableName, id);
  sendToClient(res, await data, await error);
}

export async function getAuthDataFrom(req, res, tableName, id = null) {
  const session = await getCurrentSession(req);
  if (session['code'] == 1) res.send(`error in session: ${session['error']}`);
  else {
    const supabaseInstance = session['client'];
    const {data, error} = await getData(supabaseInstance, tableName, id);
    sendToClient(res, await data, await error, true)
  }
}

async function getData(supabaseInstance, tableName, id) {
  if (id == null) {
    return await supabaseInstance.from(tableName).select();
  } else {
    return await supabaseInstance.from(tableName).select().eq("id", id).single();
  }
}
function sendToClient(res, data, error, isAuth = false)
{
  if (error) res.send(`query error in supabase: ${error.message}`);
  else {
    if (isAuth) {
      res.set("Access-Control-Allow-Credentials", "true");
      res.set("Access-Control-Allow-Origin", "http://localhost:5173");
    }
    res.status(200).json(data); 
  } 
}

export async function insertDataTo(req, res, tableName) {
  const {data, error} = await insertData(supabase, tableName, req.body);
  sendToClient(res, await data, await error);
}

export async function insertAuthDataTo(req, res, tableName) {
  const session = await getCurrentSession(req);
  if (session['code'] == 1) res.send(`error in session: ${session['error']}`);
  else {
    const supabaseInstance = session['client'];
    const {data, error} = await insertData(supabaseInstance, tableName, req.body);
    sendToClient(res, await data, await error, true)
  }
}

async function insertData(supabaseInstance, tableName, data) {
  return await supabaseInstance.from(tableName).insert({...data}).select();
}

export async function updateDataTo(req, res, tableName, column, condition) {
  const {data, error} = await updateDataTo(supabase, tableName, req.body, column, condition);
  sendToClient(res, await data, await error);
}

export async function updateAuthDataTo(req, res, tableName, column, condition) {
  const session = await getCurrentSession(req);
  if (session['code'] == 1) res.send(`error in session: ${session['error']}`);
  else {
    const supabaseInstance = session['client'];
    const {data, error} = await updateData(supabaseInstance, tableName, req.body, column, condition);
    sendToClient(res, await data, await error, true)
  }
}

async function updateData(supabaseInstance, tableName, data, column, condition) {
  return await supabaseInstance.from(tableName).update({...data}).eq(column, condition).select();
}

export async function deleteDataFrom(req, res, tableName, column, condition) {
  const {error} = await deleteData(supabase, tableName, column, condition);
  if (error) res.send(`query error in supabase: ${error.message}`);
  else {
    res.status(200).json({message: "Successfully deleted record."}); 
  } 
}

export async function deleteAuthDataFrom(req, res, tableName, column, condition) {
  const session = await getCurrentSession(req);
  if (session['code'] == 1) res.send(`error in session: ${session['error']}`);
  else {
    const supabaseInstance = session['client'];
    const {error} = await deleteData(supabaseInstance, tableName, column, condition);
    if (error) res.send(`query error in supabase: ${error.message}`);
    else {
      res.set("Access-Control-Allow-Credentials", "true");
      res.set("Access-Control-Allow-Origin", "http://localhost:5173");
      res.status(200).json({message: "Successfully deleted record."}); 
    } 
  }
}

async function deleteData(supabaseInstance, tableName, column, condition) {
  return await supabaseInstance.from(tableName).delete().eq(column, condition);
}