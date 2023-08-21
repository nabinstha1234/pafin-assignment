/**
 * @api {post} /v1/auth/login Login
 * @apiDescription User login
 * @apiVersion 1.0.0
 * @apiName UserLogin
 * @apiGroup Auth
 * @apiPermission public
 *
 * @apiHeader {string} Content-Type
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json",
 *     }
 *
 * @apiParam {string} email Email
 * @apiParam {string} password Password
 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": "admin@api.com",
 *       "password": "password",
 *     }
 *
 * @apiSuccess (200) {String}  message API message
 * @apiSuccess (200) {any}  data API login data
 * @apiSuccess (200) {string}  data._id User Id
 * @apiSuccess (200) {string}  data.token Access token
 * @apiSuccess (200) {string}  data.refreshToken Refresh token
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200
 *  {
 *    "message": "Login successful",
 *    "data": {
 *      "_id": "6044d1f52fbf64cef88e529d",
 *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDQ0ZDFmNTJmYmY2NGNlZjg4ZTUyOWQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MTUxMjQwMjYsImV4cCI6MTYxNTIxMDQyNn0.LmX0MSXiQz4H0wvBfYyq2WfiFRGZhp4o_vRZk90RwbY",
 *      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDQ0ZDFmNTJmYmY2NGNlZjg4ZTUyOWQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MTUxMjQwMjYsImV4cCI6MTYxNTcyODgyNn0.P-ZMqaw1Ht12KveKyPNILgVskXNBo1x0GdL23J7RV2s"
 *    }
 *  }
 *
 */
