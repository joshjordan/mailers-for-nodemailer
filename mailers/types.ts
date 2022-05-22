// Types for use with Mailers.
// Instructions: import your own User type and be sure it is the same one
//   that you imported to BaseMailer
import Mail from "nodemailer/lib/mailer";
import { UserType } from "../models/types";

// Expands definition of 'to', 'cc', 'bcc' types to allow
// for IUser being passed in
export type AddressParam = string | Mail.Address | UserType;

// Use Mail.Options as a base but use a stricter specification
// that makes 'subject' and 'to' required, as well as expands
// definition of 'to', 'cc', 'bcc' to accept IUser instances
export type MessageOptions = Omit<Mail.Options, "html" | "text"> & {
  subject: string,
  to: AddressParam | AddressParam[],
  cc?: AddressParam | AddressParam[],
  bcc?: AddressParam | AddressParam[],
};
