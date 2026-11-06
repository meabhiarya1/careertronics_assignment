/**
 * Runs a parser against `req[source]` and stores the normalised result on
 * `req.validated[source]`. Parsers throw ApiError(400) on invalid input,
 * which Express forwards to the error handler.
 *
 * @param {(input: object) => object} parser
 * @param {'query' | 'params'} source
 */
export const validateRequest = (parser, source) => (req, _res, next) => {
  req.validated = { ...req.validated, [source]: parser(req[source]) };
  next();
};
