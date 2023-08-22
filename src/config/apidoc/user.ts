/**
 * @api {get} /v1/users Fetch all users
 * @apiDescription Get all users
 * @apiVersion 1.0.0
 * @apiName GetUsers
 * @apiGroup Users
 * @apiPermission admin
 *
 * @apiHeader {string} Content-Type
 * @apiHeader {string} Authorization
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json",
 *       "Authorization": "Bearer <token>"
 *     }
 *
 * @apiSuccess (200) {String}  message API message
 * @apiSuccess (200) {any} data Combination of paging and user data
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200
 *  {
 *    "message": "User listed successfully",
 *    "data": {
 *     "paging": {
 *       "total": 1,
 *       "startIndex": 0,
 *       "endIndex": 1,
 *       "hasNextPage": false
 *     },
 *     "data": [
 *       {
 *         "_id": "0W5Q84608091R944516L26U3M",
 *         "email": "user@api.com",
 *         "name":"admin",
 *         "created_at": "2023-08-22T16:57:39.453Z",
 *         "modified_at": "2023-08-22T16:57:39.453Z",
 *         "created_by": "0W5Q84608091R944516L26U3M",
 *         "deleted" :false,
 *         "deleted_at":"2023-08-22T16:57:39.453Z",
 *         "deleted_by":"0W5Q84608091R944516L26U3M"
 *         "__v": 0
 *       },
 *     ]
 *   }
 *
 *  }
 */

/**
 * @api {get} /v1/users/:id Fetch single users
 * @apiDescription Get single users
 * @apiVersion 1.0.0
 * @apiName GetSingleUser
 * @apiGroup Users
 * @apiPermission admin/user
 *
 * @apiHeader {string} Content-Type
 * @apiHeader {string} Authorization
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json",
 *       "Authorization": "Bearer <token>"
 *     }
 *
 * @apiParam {string} _id User Id
 *
 * @apiSuccess (200) {String}  message API message
 * @apiSuccess (200) {User} data User
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200
 *  {
 *    "message": "User listed successfully",
 *    "data": {
 *       {
 *         "_id": "0W5Q84608091R944516L26U3M",
 *         "email": "user@api.com",
 *         "name":"admin",
 *         "created_at": "2023-08-22T16:57:39.453Z",
 *         "modified_at": "2023-08-22T16:57:39.453Z",
 *         "created_by": "0W5Q84608091R944516L26U3M",
 *         "deleted" :false,
 *         "deleted_at":"2023-08-22T16:57:39.453Z",
 *         "deleted_by":"0W5Q84608091R944516L26U3M"
 *         "__v": 0
 *       },
 *   }
 *
 *  }
 */

/**
 * @api {put} /v1/users/:id Update-user
 * @apiDescription Update user
 * @apiVersion 1.0.0
 * @apiName UpdateUser
 * @apiGroup Users
 * @apiPermission user/admin
 *
 * @apiHeader {string} Content-Type
 * @apiHeader {string} Authorization
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json",
 *       "Authorization": "Bearer <token>"
 *     }
 *
 * @apiParam {string} _id User Id
 * @apiParam {string} firstName User first name
 * @apiParam {string} lastName User last name
 * @apiParamExample {json} Request-Example:
 *     {
 *       "firstName": "Updated",
 *       "lastName":"User"
 *     }
 *
 * @apiSuccess (200) {String}  message API message
 * @apiSuccess (200) {User} data User
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200
 *  {
 *    "message": "User updated",
 *    "data": {
 *       {
 *         "_id": "0W5Q84608091R944516L26U3M",
 *         "email": "user@api.com",
 *         "name":"admin",
 *         "created_at": "2023-08-22T16:57:39.453Z",
 *         "modified_at": "2023-08-22T16:57:39.453Z",
 *         "created_by": "0W5Q84608091R944516L26U3M",
 *         "deleted" :false,
 *         "deleted_at":"2023-08-22T16:57:39.453Z",
 *         "deleted_by":"0W5Q84608091R944516L26U3M"
 *         "__v": 0
 *       },
 *    }
 *  }
 *
 */

/**
 * @api {delete} /v1/users/:id Delete-user
 * @apiDescription Delete user
 * @apiVersion 1.0.0
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiPermission admin
 *
 * @apiHeader {string} Content-Type
 * @apiHeader {string} Authorization
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "Content-Type": "application/json",
 *       "Authorization": "Bearer <token>"
 *     }
 *
 * @apiParam {string} _id User Id
 *
 * @apiSuccess (200) {String}  message API message
 * @apiSuccess (200) {User} data User
 *
 * @apiSuccessExample {json} Success-Response:
 *  HTTP/1.1 200
 *  {
 *    "message": "User deleted",
 *    "data": {
 *       {
 *         "_id": "0W5Q84608091R944516L26U3M",
 *         "email": "user@api.com",
 *         "name":"admin",
 *         "created_at": "2023-08-22T16:57:39.453Z",
 *         "modified_at": "2023-08-22T16:57:39.453Z",
 *         "created_by": "0W5Q84608091R944516L26U3M",
 *         "deleted" :false,
 *         "deleted_at":"2023-08-22T16:57:39.453Z",
 *         "deleted_by":"0W5Q84608091R944516L26U3M"
 *         "__v": 0
 *       },
 *    }
 *  }
 *
 */
