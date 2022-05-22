# mailers-for-nodemailer

An opinionated mini-framework for organizing Mailers with `nodemailer`. Not actual package, but a set of classes and files you can pull in to customize the framework to match your preferences. Supports in-browser preview, text and HTML templates using Handlebars, automatically handling domain-specific `User` objects as email participants (ie. `to`, `cc`, `bcc`), and Mailers as first-class objects. May feel familiar to Ruby on Rails developers.

## Setup

### Copy files

Copy the `mailers` directory into your node project. Each copied file has a note about what customizations it needs in order to work, so you can follow those step by step or keep reading below.

### Install dependencies

Instructions are given here for `npm`, but you are of course free to use `yarn`, `pnpm`, or whatever the kids like to use to manage packages these days.

```
npm install nodemailer nodemailer-express-handlebars
npm install --save-dev joshjordan/nodemailer-browserpreview-transport @types/nodemailer @types/nodemailer-express-handlebars
```

Also, be sure to install whatever transport you're using (we use Postmark here):

```
npm install nodemailer-postmark-transport
```

### UserType and UserModel

Our example here assumes you have a Typescript specification of your User objects which looks like:

```
type UserType = {
  getFullName: () => string
	firstName: string,
	fastName: string,
  Email: string,
}
```

and the `testDriver` assumes you have a concrete class named `UserModel` which conforms to that type. As instructed in `BaseMailer`, `testDriver`, and `types.ts`, please import your own and customize this to match your user specification. Or, delete them entirely.

### Layout

Finally, you'll need to get the HTML and text email templates from your designer and paste them over what's in `layout.html.handlebars` and `layout.text.handlebars`. Replace the content portions with the appropriate partial rendering syntax, as specified at the top of each of those files.

## Usage

Woohoo! You're all set. Now you're ready to write a mailer. We recommend checking out (or even executing) `testDriver.ts` before going any further. This will show you exactly how to implement some simple emails within your own Mailer. Feel free to copy/paste `TestMailer` to get started!

### Sending to strongly-typed Users

One of the cool things about this framework is that it lets you send to your user objects. `BaseMailer` will automatically figure out whether each of the recipients is a `User`, a nodemailer `Mail.Address`, a string, or any array of any of those. They will be transformed to an array of `Mail.Address` objects at send-time. As such, all of the following are valid:

```
const user = myDb.getUserById(userId);

this.send("simple", {
  to: user,
  cc: "admin@mysite.com",
  bcc: ["other-admin@mysite.com", { address: "yet-another-admin@mysite.com", name: "YAA" }]
  ...
})
```

If you pass in a user for the `to` field, which we strongly recommend you do, this user will also automatically be included in the Handlebars context as `toUser`, so you can, for example, show the user's name with this Handlebars code:

```
Hello there {{toUser.firstName}}!
```

### Templates

The framework will always render the `layout.*.handlebars` template as a wrapper for your content. Within that, the first parameter to `this.send` in your Mailer should be the name of a template for your specific email's content. Handlebars calls this a partial. We've included a `simple.html`/`simple.text` template to get you started.

Each template you implement should have both a text and html version. If you use any context variables within your template, be sure to pass them in as the third parameter to `this.send`!

```
this.send(
  "simple"                   // <-- this is the template name
  { to: ..., subject: ... }, // <-- Mailer params to configure the email
  { content: 'Hello world' } // <-- context variables used within simple.html.handlebars and simple.text.handlebars
)
```

### Helpers

The following helpers are available from within your Handlebars templates. See `helpers.ts` for more info. Feel free to add more helpers as you go.

* `url`: Prepends `config.baseUrl` to a path. Simplifies URL generation so you only need to think about the path you want to link to.
* `htmlPartial`: Makes it simple to render an HTML partial so you only need to remember to call `htmlPartial` instead of how to mangle the Handlebars partial syntax to concatenate ".html"
* `textPartial`: Makes it simple to render a text partial so you only need to remember to call `textPartial` instead of how to mangle the Handlebars partial syntax to concatenate ".text"

### Further customization

From here, the files live in your code repository and you are free to customize them as needed. You may, for example, want to support dynamic hostnames by removing `baseUrl` from `templates/config.ts` and instead passing an `Express.Request` instance into `BaseMailer`. We'd welcome configurable contributions back to this repository!

## TODO

* CSS preprocessing support
* Support for referencing hosted images and/or feeding images into hosting framework
