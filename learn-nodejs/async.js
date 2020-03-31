const num_retries = 5 // 尝试重复请求次数
const num_errors = 9 // getData请求错误次数
let count = 0

function sleep(timeout = 1000) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout)
  })
}
async function getData() {
  if (count < num_errors) {
    throw `error ${count}`
  } else {
    return '--This is data--'
  }
}

async function test() {
  console.log('---start')
  return await retest(() => {
    return getData()
  }, 5, 2000)
}

async function retest(func, num = 5, timeout = 1000) {
  if (!func) {
    throw '回调不能为空'
  }
  count = 0
  const errors = []
  for (let i = 0; i < num; i++) {
    try {
      if (i > 0) {
        await sleep(timeout)
      }
      count++
      return await func()
    } catch (error) {
      console.log(error)
      errors.push(error)
    }
  }
  throw errors
}

test().then(res => {
  console.log('then',res)
}).catch(err => {
  console.log('catch', err)
})


const promiseA = (code) => {
  return new Promise((resolve, reject) => {
    // resolve({ code })
    reject({ code, status: 'failed' })
  })
}

const promiseB = (code) => {
  return promiseA(code).then(res => {
    if (res.code === 200) {
      return Promise.resolve({ data: 'success' })
    } else {
      return Promise.reject({ data: 'failed' })
    }
  })
}

promiseB(200).then(res => {
  console.log(res)
}).catch(err => {
  console.error(err)
})