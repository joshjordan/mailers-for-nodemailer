// This serves as a base class for all Mailers. New Mailers will be relatively simple
// as long as they extend BaseMailer and internally call `this.send`
// Instructions: import your own User type and customize the code below based on
//   the attributes of your user. Pay special attention to the note about mongoose objects
import Mail from "nodemailer/lib/mailer";
import { UserType } from "../models/types";
import { AddressParam, MessageOptions } from './types';
import transport from './transport';
import { FROM_NAME, FROM_EMAIL_ADDRESS } from './config';
import templatesConfig from './templates/config';

class BaseMailer {
  /**
   * Send an email using nodemailer and the given configuration. Abstracts details for
   * transforming parameters and interacting with the underlying SMTP transport.
   * @param template Filename of the handlebars template to render in the mailers/templates directory
   * @param message Recipient and subject metadata for sending the email
   * @param locals Context object for use in the handlebars template
   */
  protected send(templateName: string, message: MessageOptions, locals: any = {}) {

    // type checking. customize here if User type does not have an email attribute
    const user = message.to as UserType;
    if(user.email && user.toObject) {
      // mongoose wraps model objects in a proxy. Unwrap so Handlebars can call functions directly
      locals.toUser = user.toObject();
    }

    const nodemailerMessage = {
      from: { name: FROM_NAME, address: FROM_EMAIL_ADDRESS },
      ...message,
      // todo: handle reply-to?
      to: this.toAddress(message.to),
      cc: this.toAddress(message.cc),
      bcc: this.toAddress(message.bcc),
      // below here, configure nodemailer-express-handlebars

      // always render the layouT template...
      template: "layout.html",
      text_template: "layout.text",
      context: {
        config: templatesConfig,
        // ...because the layout template will call the partial given by templateName
        templateName,
        ...locals
      }
    }

    console.log(__filename, "Sending message", nodemailerMessage)

    transport.sendMail(nodemailerMessage, function (err, info) {
      if (err) {
        console.error(__filename, err);
      } else {
        console.log(__filename, info);
      };
    });
  }

  /**
   * Transform disparate param types to a Mail.Address. nodemailer accepts
   * a string or Mail.Address or an array of either, but we expand that to
   * include our User type. This function transforms User and string types
   * to a single consistent type usable by nodemailer
   * @param address A string, Mail.Address, User, or array thereof
   * @returns An array of Mail.Address instances. If a single object was passed
   * as a param, a single-element array will be returned
   */
  private toAddress(address?: AddressParam | AddressParam[]): (string | Mail.Address)[] {
    if(!address) return []

    const addresses: AddressParam[] = Array.isArray(address) ? address : [address];

    return addresses.map(a => {
      // if already an Address, as indicated by 'address' and 'name' property,
      // just return. This is the method used by the Postmark transport
      const mailAddress = a as Mail.Address;
      if(mailAddress.address && mailAddress.name) return mailAddress;
      if(mailAddress.address) return mailAddress.address; // corner case -- fall back to string

      // if a User, as indicated by 'email' property, transform to Address
      const user = a as UserType;
      if(user.getFullName && user.email) {
        return { name: user.getFullName(), address: user.email } as Mail.Address
      };

      // else, we must have a string
      return a as string;
    })
  }
}

export default BaseMailer;
