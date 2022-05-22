// Instructions: Nothing to do here.

// Not strictly necessary to import config here. config is actually part
// of the handlebars template object accessible using "this" in a helper,
// but using an import gives intellisense, and maybe a chance for inlining
// static values during compilation
import config from './config';

// helper functions included in handlebars templates
const helpers = {
  // {{ url "/home" }} -> "https://mysite.com/home"
  url(path: string) {
    return config.baseUrl + path;
  },
  // wrappers that make handlebars partial syntax simple
  // {{> (htmlParial "socialLinks") }} -> renders socialLinks.html.handlebars
  htmlPartial(partialName: string) {
    return partialName + '.html'
  },
  // {{> (textParial "socialLinks") }} -> renders socialLinks.text.handlebars
  textPartial(partialName: string) {
    return partialName + '.text'
  }
};

export default helpers;
