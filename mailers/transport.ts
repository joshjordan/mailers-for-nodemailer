// Configures the underyling nodemailer transport with a proper sender, previews
// in development, and handlebars templating at send-time.
// Instructions: replace transportConfig with the appropriate configuration for
//   your SMTP host. Here, we're using Postmark in production and browser preview
//   in development. We recommend you replace postmarkTransport and leave the
//   rest alone. Also, you probably want to remove node-credentials in favor of some
//    other method of configuring secret keys in your transport.
import nodemailer from "nodemailer";
import path from "path";
import renderer from 'nodemailer-express-handlebars';
import { credentialsEnv } from 'node-credentials';
import postmarkTransport from 'nodemailer-postmark-transport';
import previewTransport from "nodemailer-browserpreview-transport";
import helpers from './templates/helpers';

const transportConfig = credentialsEnv.POSTMARK_API_KEY ?
  postmarkTransport({ auth: { apiKey: credentialsEnv.POSTMARK_API_KEY } }) :
  previewTransport({});

const transport = nodemailer.createTransport(transportConfig);

transport.use('compile', renderer(
  {
    viewEngine: {
      partialsDir: path.resolve(__dirname, './templates'),
       // this type of layout is not for rendering text and html at the same time
      defaultLayout: false,
      helpers
    },
    viewPath: path.resolve(__dirname, './templates')
  })
);

export default transport;
