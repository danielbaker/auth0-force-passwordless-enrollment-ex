auth0-force-passwordless-enrollment-ex
======================================

### Description
An example application that forces users to enroll in passwordless email and sms verification before allowing them to login to the primary application

### Structure
There are two applications in this example. 

```
/login-client - Sample Auth0 react app 
/enrollment-client - An application which sends and allows users to enter TOTP codes using Auth0 Passwordless
```

### Installation
Because we want to run two different apps locally, its easiest if we create two different hosts locally 

1. `/etc/hosts` create two new hosts pointing to 127.0.0.1 (eg. `login-client` and `enrollment-client`)
2. Edit  `login-client/src/Auth/auth0-variables.js` and fill in the blanks
3. Edit `enrollment-client/.env` and fill in the blanks.
4. Edit `enrollment-client/package.json` and change the `proxy` domain to what your using
5. Open  two terminals
6. In one of the terminals 
```bash
cd ./login-client
yarn install
yarn start
```
In the other terminal
```bash
cd ./enrollment-client
yarn install
yarn start
```

### See it in action
In a browser, go to `http://login-client:3000/`
