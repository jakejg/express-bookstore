const jsonschema = require('jsonschema');
const bookSchema = require('../schemas/bookSchema.json');
const ExpressError = require('../expressError')

function validateBookJson(req, res, next){
    const result = jsonschema.validate(req.body, bookSchema)
    if (!result.valid) {
      let listOfErros = result.errors.map(error => error.stack)
      let error = new ExpressError(listOfErros, 400)
      return next(error)
    }
    else {
        return next()
    }
}

module.exports = {
    validateBookJson
}