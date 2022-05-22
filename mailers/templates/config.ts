// These are available within the handlebars context and helpers
// Instructions: replace baseUrl with any appropriate method for
//   determining what URL should precede all paths

export default {
  // as an example, this disables the social links in the template
  // you can probably delete this
  socialLinks: false,

  baseUrl: process.env.ASSET_HOST || "http://mysite.com",
}
