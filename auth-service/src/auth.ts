export const handler = async (event, _, callback) => {
    try {
        console.log('auth event init', event.authorizationToken);
        if (!event.authorizationToken) {
            return callback('Unauthorized');
        }

        const rawBasicAuth = event.authorizationToken.split(' ')[1];
        const bufferedBA = Buffer.from(rawBasicAuth, 'base64');
        const loginAndPassword = bufferedBA.toString('utf-8').split(':');

        const [login, password] = loginAndPassword;

        if (process.env['DEFAULT_LOGIN'] === login
            && process.env['DEFAULT_PASSWORD'] === password) {
            const policyDocument = {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: event.methodArn,
                    },
                ],
            };

            return callback(null, {
                principalId: login,
                policyDocument,
            });
        } else {
            return callback('Forbidden');
        }
    } catch (e) {
        console.log('auth event failed', e);
        return callback('Bad Request');
    }
};
