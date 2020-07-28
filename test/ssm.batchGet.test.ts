import { SSM } from "../index";
import rimraf from "rimraf";
import fs from "fs";

import path from "path";

const rootDir = path.join(__dirname, "..", ".tmp");

beforeEach(() => {
  rimraf.sync(rootDir);
});

test("with default values", async () => {
  const ssm = new SSM({
    region: "us-east-1"
  });
  const params = [
    {
      name: "param1",
      target: path.join(rootDir, "param1.json"),
      default: "{}"
    },
    {
      name: "param2",
      target: path.join(rootDir, "param2.key"),
      default: "this is a key"
    }
  ];
  const result = await ssm.batchGet(params);
  expect(result.param1).toBe("{}");
  expect(result.param2).toBe("this is a key");
  expect(fs.readFileSync(params[0].target).toString("utf8")).toBe("{}");
  expect(fs.readFileSync(params[1].target).toString("utf8")).toBe(
    "this is a key"
  );
});

test("with no default value for param1", async () => {
  const ssm = new SSM({
    region: "us-east-1"
  });
  const params = [
    {
      name: "param1",
      target: path.join(rootDir, "param1.json")
    },
    {
      name: "param2",
      target: path.join(rootDir, "param2.key"),
      default: "this is a key"
    }
  ];
  try {
    await ssm.batchGet(params);
    expect(0).toBe(1);
  } catch (e) {}
});

test("with param1 defined in the account with access in us-east-2", async () => {
  const ssm = new SSM({
    region: "us-east-2"
  });
  const params = [
    {
      name: "param1",
      target: path.join(rootDir, "param1.json")
    },
    {
      name: "param2",
      target: path.join(rootDir, "param2.key"),
      default: "this is a key"
    }
  ];
  const result = await ssm.batchGet(params);
  expect(result.param1).toBe("{}");
  expect(result.param2).toBe("this is a key");
  expect(fs.readFileSync(params[0].target).toString("utf8")).toBe("{}");
  expect(fs.readFileSync(params[1].target).toString("utf8")).toBe(
    "this is a key"
  );
});

test("with param1 defined in the account with access in us-east-2 no saving", async () => {
  const ssm = new SSM({
    region: "us-east-2"
  });
  const params = [
    {
      name: "param1"
    },
    {
      name: "param2",
      default: "this is a key"
    }
  ];
  const result = await ssm.batchGet(params);
  expect(result.param1).toBe("{}");
  expect(result.param2).toBe("this is a key");
  try {
    expect(
      fs.readFileSync(path.join(rootDir, "param1.json")).toString("utf8")
    ).toBe("{}");
    expect(0).toBe(1);
  } catch (e) {}
});
