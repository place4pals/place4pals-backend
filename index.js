const { Pool } = require('pg');
const poolConfig = {
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port
};

exports.handler = async(event, context) => {
    console.log("place4pals init");
    console.log(event);

    if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
        let pool = new Pool(poolConfig);
        let response = await pool.query('INSERT INTO users(id, email, username, user_type) VALUES($1, $2, $3, $4) RETURNING *', [event.request.userAttributes['sub'], event.request.userAttributes['email'], event.request.userAttributes['custom:username'], 'pal']);
        console.log(response);
        pool.end();
        return context.done(null, event);
    }
    else { //if (event.triggerSource === 'TokenGeneration_Authentication')
        event.response = {
            "claimsOverrideDetails": {
                "claimsToAddOrOverride": {
                    "https://hasura.io/jwt/claims": JSON.stringify({
                        "x-hasura-allowed-roles": ["user", "admin"],
                        "x-hasura-default-role": "user",
                        "x-hasura-user-id": event.request.userAttributes.sub,
                        "x-hasura-role": event.request.userAttributes.sub === "18cc0fe3-ad0b-44f8-a622-fd470c7eeb78" ? "admin" : "user"
                    })
                }
            }
        };
        return context.done(null, event);
    }
};
