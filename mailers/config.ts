let FROM_NAME = "My App"
if(process.env.NODE_ENV != 'production') {
  FROM_NAME += ` (${process.env.NODE_ENV})`;
}

const FROM_EMAIL_ADDRESS = 'no-reply@mysite.com';

export {
  FROM_EMAIL_ADDRESS,
  FROM_NAME,
}
