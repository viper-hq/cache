# AWS related secret management helpers

[![npm](https://img.shields.io/npm/v/@viperhq/secrets.svg)](https://www.npmjs.com/package/@viperhq/secrets)

## Usage

### SSM

#### batchGet

```typescript
const ssm = new SSM({
  region: "us-east-1"
});
const params = [
  {
    name: "/production/service/secrets.json",
    default: JSON.stringify({
      password: process.env.PASSWORD
    })
  },
  {
    name: "/production/service/private.pem",
    target: path.join(rootDir, "certs", "private.pem")
  }
];
const result = await ssm.batchGet(params);
console.log(result);
/*
{
  "/production/service/secrets.json": "{\"password\":\"123\"}",
  "/production/service/private.pem": "PEM_FILE_CONTENTS"
}
*/
```

#### batchDelete

```typescript
const ssm = new SSM({
  region: "us-east-1"
});
const params = [
  {
    name: "/production/service/secrets.json",
    default: JSON.stringify({
      password: process.env.PASSWORD
    })
  }
];
await ssm.batchDelete(params);
const result = await ssm.batchGet(params);
console.log(result);
/*
{
  "/production/service/secrets.json": "{\"password\":\"process.env.PASSWORD\"}"
}
*/
```

#### put

```typescript
const ssm = new SSM({
  region: "us-east-1"
});
const params = [
  {
    name: "/production/service/secrets.json",
    content: JSON.stringify({
      password: process.env.PASSWORD
    }),
    encrypted: true,
    overwrite: true
  }
];
await ssm.put(params[0]);
const result = await ssm.batchGet(params);
console.log(result);
/*
{
  "/production/service/secrets.json": "{\"password\":\"process.env.PASSWORD\"}"
}
*/
```
