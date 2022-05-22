// This can be used as a test driver to send an email from development mode.
// If you're using nodemailer-browser-preview, you can use this command
// to quickly preview your emails. Customize the code below to see how the emails change.
// Instructions: import your own User class and customize the code below based on
//   the attributes of your user. You may also wish to setup an npm script wrapper such as:
//
//   testdrive:mailer": "NODE_ENV=development nodemon mailers/testDriver.ts",

import BaseMailer from "./BaseMailer";
var UserModel = require("../models/UserModel");

const user = new UserModel();
user.firstName = 'John';
user.lastName = 'Smith';
user.email = 'john.smith@example.com';

// How to write a very simple mailer
class TestMailer extends BaseMailer {
  public sendForgotPassword(user) {
    this.send(
      "simple",
      {
        to: user,
        cc: 'My App Account Manager <my-app-account-manager@mysite.com>',
        bcc: ['admin@example.com'],
        subject: "Forgot your password?"
      },
      {
        content: 'Did someone forgot their password here?',
        link: { label: 'If so, click here', path: '/forgot-password?token=1234' }
      }
    )
  }

  public sendPasswordHasBeenReset(user) {
    this.send(
      "simple",
      {
        to: user,
        bcc: ['admin@example.com'],
        subject: "Your password has been reset"
      },
      {
        content: "Your password has been changed. If this wans't you, contact us immediately."
      }
    )
  }
}

new TestMailer().sendForgotPassword(user);
new TestMailer().sendPasswordHasBeenReset(user);
