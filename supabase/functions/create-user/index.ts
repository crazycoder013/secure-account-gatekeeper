import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    const { username, password } = await req.json()

    // Create the user
    const { data: userData, error: signUpError } = await supabaseClient.auth.admin.createUser({
      email: `${username}@virtual.com`,
      password: password,
      email_confirm: true,
      user_metadata: { username }
    })

    if (signUpError) throw signUpError

    // Create the profile
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert([
        {
          id: userData.user.id,
          username: username,
        }
      ])

    if (profileError) throw profileError

    return new Response(
      JSON.stringify({ user: userData.user }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})