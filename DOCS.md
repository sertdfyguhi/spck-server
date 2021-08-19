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

- token: Token of account.  
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
