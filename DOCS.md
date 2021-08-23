# API docs
spck's JSON API docs.

## GET `/api/package/<package>`
Gets package info.

### Params
- package: Package name.

### Response
- name: Package name.  
***type***: `string`

- desc: Description.  
***type***: `string`

- long_desc: Long description.  
***type***: `string`

- homepage: Homepage.  
***type***: `string`

- versions: Versions available.  
***type***: `array`

## DELETE `/api/package/<package>`
Deletes a package.

### Params
- package: Package name.

### Fields in body
##### \* required
- token*: Token of account.  
***type***: `string`

### Response
- message: Response message.  
***type***: `string`

## GET `/api/package/<package>/download`
Downloads the package in a .tar file.

### Params
- package: Package name.

### Response
Responds with a .tar file.

## POST `/api/publish`
Publishes a new package.

### Fields in body
##### \* required
- name*: Package name.  
***type***: `string`

- desc*: Description.  
***type***: `string`

- long_desc: Long description.  
***type***: `string`

- version*: Version number.  
***type***: `string`  
**example**: `1.0.0`

- homepage: Homepage.  
***type***: `string`

- token*: Token of account.  
***type***: `string`

- data: JSON of the directory.   
***type***: `string`

### Response
- message: Response message.  
***type***: `string`

## POST `/api/register`
Registers a new user.

### Fields in body
##### \* required
- user*: Username.  
***type***: `string`

- pass*: Password.  
***type***: `string`

### Response
- message: Response message.  
***type***: `string`

- token: JWT token.  
***type***: `string`

## POST `/api/login`
Responds with a JWT token.

### Fields in body
##### \* required
- user*: Username.  
***type***: `string`

- pass*: Password.  
***type***: `string`

### Response
- message: Response message.  
***type***: `string`
- token: JWT token.  
***type***: `string`

## GET `/api/search`
Searches for packages.

### Query
- q: Search query.

### Response
Array of similar packages.

- name: Package name.  
***type***: `string`

- desc: Description.  
***type***: `string`

- version: Latest version.  
***type***: `string`

- author: Author.  
***type***: `string`

## GET `/api/users/<user>`
Gets a user's information.

### Params
- user: Username of user.

### Response
- id: ID of user.  
***type***: `number`

- packages: Packages of user.
***type***: `array`

## DELETE `/api/users/<user>`
Deletes a user.

### Params
- user: Username.

### Fields in body
##### \* required
- token*: Token of account.  
***type***: `string`

### Response
- message: Response message.  
***type***: `string`


## PUT `/api/users/<user>`
Changes password for a user.

### Params
- user: Username.

### Fields in body
##### \* required
- old_pass*: Old password of account.  
***type***: `string`

- new_pass*: New password of account.  
***type***: `string`

### Response
- message: Response message.  
***type***: `string`
