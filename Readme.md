# dimz-routes-beta

Generate route otomatis dari file controller.

## Instalasi

Pastikan Anda memiliki Node.js dan npm terinstal di sistem Anda.

1. Install paket menggunakan npm:

   ```bash
   npm install dimz-routes-beta
   ```

2. Setelah instalasi selesai, Anda dapat mengonfigurasi paket dengan menjalankan script konfigurasi:

   ```bash
   node node_modules\dimz-routes-beta\install.js
   ```

3. File konfigurasi akan tercopy kedalam project anda

   ```javascript
       project
       |-- src
       |   |--commands
       |   |  |-- route-list.js
       |   |-- config
       |   |  |-- config.js
   ```

4. File ` package.json`` akan muncul  `"route:list": "node ./src/commands/route-list.js"```

## Penggunaan

- entry-point.js

```javascript
const { setRoute } = require('dimz-routes-beta')

require('./src/config/config')
setRoute('v1', {}, app)
```

```javascript
// Contoh penggunaan paket di dalam proyek Node.js
const express = require('express')
const app = express()
const { setRoute } = require('dimz-routes-beta')

require('./src/config/config')
setRoute('v1', {}, app)

let port = 5000
app.listen(port, () => {
  console.log(`Server started on port ${port}`)
  console.log('Push terus bang!!!')
})
```

- ./src/config/config.js

```javascript
const { config } = require('dimz-routes-beta')

/**
 * change './src/controllers' to your controller path
 * change (req, res, next) => { next() } to your auth middleware
 */

let defineConfig = {
  defaultControllerPath: './src/controllers',
  defaultAuth: (req, res, next) => {
    next()
  }
}

config.configure(defineConfig)
module.exports = { config: defineConfig }
```

# Sesuaikan path controller

Jika defaultControllerPath tidak anda ubah, maka default controller path anda harus berada di folder `src/controller/{{version}}`

contoh penggunaan di controller

/src/controller/v1/test.controller.js

```javascript
const test = (req, res) => {
  // your code here
}

const createTest = (req, res) => {
  // your code here
}

const updateTest = (req, res) => {
  // your code here
}

const deleteTest = (req, res) => {
  // your code here
}

module.exports = { test, createTest,updateTest,deleteTest }
```

route akan tergenerate menjadi 

```bash
/{version}/{nama controller}/{nama function}

GET /v1/test/test
POST /v1/test/test
PUT /v1/test/test
DELETE /v1/test/test
```

Jika ingin menambahkan parameter 

```javascript

test.paramName = ['id']
createTest.paramName = ['some-params']

```

route akan menjadi 

```bash
/{version}/{nama controller}/{nama function}/:{params}

GET /v1/test/test/:id
POST /v1/test/test/:some-params
```

Kita juga dapat membuat middleware yang terisolasi untuk fungsi tertentu

```javascript
your-function.controllerMiddleware = [your-middleware]


createTest.controllerMiddleware = [checkEmailExistMiddleware,checkPhoneExistMiddleware]
updateTest.controllerMiddleware = [checkEmailExistMiddleware,checkPhoneExistMiddleware]
deleteTest.controllerMiddleware = [checkStatusMiddleware]
```