const clean = (input) => {
  if (typeof input === 'string') {
    // HTML sanitize: escape potential script injections
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  if (typeof input === 'object' && input !== null) {
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        input[key] = clean(input[key]);
      }
    }
  }
  return input;
};

export const xssSanitize = (req, res, next) => {
  if (req.body) {
    req.body = clean(req.body);
  }
  if (req.query) {
    req.query = clean(req.query);
  }
  if (req.params) {
    req.params = clean(req.params);
  }
  next();
};
