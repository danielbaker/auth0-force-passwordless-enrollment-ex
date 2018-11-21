import auth0 from "auth0-js";

export default class Auth {
  auth0 = new auth0.WebAuth({
    domain: process.env.REACT_APP_AUTH0_DOMAIN,
    clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    responseType: "token id_token",
    scope: "openid email profile",
  });

  verifyEmailOTP(email, code, cb) {
    this.auth0.passwordlessVerify(
      {
        connection: "email",
        email: email,
        verificationCode: code
      },
      cb
    );
  }

  verifyMobileOTP(mobile, code, cb) {
    this.auth0.passwordlessVerify(
      {
        connection: "sms",
        phoneNumber: mobile,
        verificationCode: code
      },
      cb
    );
  }

  checkSesssion(cb) {
    this.auth0.checkSession({}, cb);
  }
}
