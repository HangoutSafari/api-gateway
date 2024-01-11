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
