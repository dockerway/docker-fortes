module.exports = {
    apps: [
        {
            name: 'DraculScaffold',
            script: 'index.js',
            instances: 1,
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'development',

                //### MONGO ENVIRONMENT VARIABLES ###
                MONGO_URI: 'mongodb://user:pass@127.0.0.1:27017/scaffold',

                //### JWT ENVIRONMENT VARIABLES ###
                JWT_SECRET: 'djghhhhuuwiwuewieuwiehyew',
                JWT_LOGIN_EXPIRED_IN: '1d',
                JWT_REGISTER_EXPIRED_IN: '30d',

                //### APP ENVIRONMENT VARIABLES ###
                APP_NAME: 'DraculScaffold',
                APP_PORT: 8050,
                APP_API_URL: 'http://localhost:8050',

                //### SMTP ENVIRONMENT VARIABLES ###
                SMTP_HOST: 'smtp.gmail.com',
                SMTP_PORT: '465',
                // SMTP_SECURE= true (use 465 port) / false (use other port)
                SMTP_SECURE: 'true',
                //SMTP_IGNORE_TLS: 'true' (dont user TLS, ej port 25) / false (use TLS)
                SMTP_IGNORE_TLS: 'false',
                SMTP_USER: 'ci.sys.virtual@gmail.com',
                SMTP_PASS: '',

                //### LOG ENVIRONMENT VARIABLES ###
                //# LOG LEVEL: error, warning, info, debug
                LOG_LEVEL: 'debug',
                //# REQUEST
                LOG_REQUEST: 'ON',
                LOG_RESPONSE_TIME: 'ON',
                LOG_GQL_ERRORS: 'ON',
                //# LOG TRANSPORTS
                LOG_TRANSPORT_CONSOLE: 'ON',
                LOG_TRANSPORT_COMBINED: 'ON',
                LOG_TRANSPORT_ERROR: 'ON',
                LOG_TRANSPORT_ACCESS: 'ON',
                LOG_TRANSPORT_GQL_ERROR: 'ON',
                LOG_TRANSPORT_GQL_RESPONSE: 'ON',
                //# LOG COLORIZE: ON / OFF
                LOG_COLORIZE: 'ON',
                //# Max log file size in bytes. Ex: 10000000 Bytes :: 1 MegaByte
                LOG_FILE_MAX_SIZE: '10000000',
                //# Number of max files
                LOG_FILE_MAX_FILES: '3',
                // # LOG MODES: TEXT / JSON
                LOG_MODE: 'TEXT',
            },
        }
    ]
};
