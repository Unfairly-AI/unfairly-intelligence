import { createRequire as __unfairlyRequire } from 'node:module'; const require = __unfairlyRequire(import.meta.url);
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/zod/v3/helpers/util.js
var util, objectUtil, ZodParsedType, getParsedType;
var init_util = __esm({
  "node_modules/zod/v3/helpers/util.js"() {
    (function(util2) {
      util2.assertEqual = (_) => {
      };
      function assertIs(_arg) {
      }
      util2.assertIs = assertIs;
      function assertNever(_x) {
        throw new Error();
      }
      util2.assertNever = assertNever;
      util2.arrayToEnum = (items) => {
        const obj = {};
        for (const item of items) {
          obj[item] = item;
        }
        return obj;
      };
      util2.getValidEnumValues = (obj) => {
        const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
        const filtered = {};
        for (const k of validKeys) {
          filtered[k] = obj[k];
        }
        return util2.objectValues(filtered);
      };
      util2.objectValues = (obj) => {
        return util2.objectKeys(obj).map(function(e) {
          return obj[e];
        });
      };
      util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
        const keys = [];
        for (const key in object) {
          if (Object.prototype.hasOwnProperty.call(object, key)) {
            keys.push(key);
          }
        }
        return keys;
      };
      util2.find = (arr, checker) => {
        for (const item of arr) {
          if (checker(item))
            return item;
        }
        return void 0;
      };
      util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
      function joinValues(array, separator = " | ") {
        return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
      }
      util2.joinValues = joinValues;
      util2.jsonStringifyReplacer = (_, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      };
    })(util || (util = {}));
    (function(objectUtil2) {
      objectUtil2.mergeShapes = (first, second) => {
        return {
          ...first,
          ...second
          // second overwrites first
        };
      };
    })(objectUtil || (objectUtil = {}));
    ZodParsedType = util.arrayToEnum([
      "string",
      "nan",
      "number",
      "integer",
      "float",
      "boolean",
      "date",
      "bigint",
      "symbol",
      "function",
      "undefined",
      "null",
      "array",
      "object",
      "unknown",
      "promise",
      "void",
      "never",
      "map",
      "set"
    ]);
    getParsedType = (data) => {
      const t = typeof data;
      switch (t) {
        case "undefined":
          return ZodParsedType.undefined;
        case "string":
          return ZodParsedType.string;
        case "number":
          return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
        case "boolean":
          return ZodParsedType.boolean;
        case "function":
          return ZodParsedType.function;
        case "bigint":
          return ZodParsedType.bigint;
        case "symbol":
          return ZodParsedType.symbol;
        case "object":
          if (Array.isArray(data)) {
            return ZodParsedType.array;
          }
          if (data === null) {
            return ZodParsedType.null;
          }
          if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
            return ZodParsedType.promise;
          }
          if (typeof Map !== "undefined" && data instanceof Map) {
            return ZodParsedType.map;
          }
          if (typeof Set !== "undefined" && data instanceof Set) {
            return ZodParsedType.set;
          }
          if (typeof Date !== "undefined" && data instanceof Date) {
            return ZodParsedType.date;
          }
          return ZodParsedType.object;
        default:
          return ZodParsedType.unknown;
      }
    };
  }
});

// node_modules/zod/v3/ZodError.js
var ZodIssueCode, quotelessJson, ZodError;
var init_ZodError = __esm({
  "node_modules/zod/v3/ZodError.js"() {
    init_util();
    ZodIssueCode = util.arrayToEnum([
      "invalid_type",
      "invalid_literal",
      "custom",
      "invalid_union",
      "invalid_union_discriminator",
      "invalid_enum_value",
      "unrecognized_keys",
      "invalid_arguments",
      "invalid_return_type",
      "invalid_date",
      "invalid_string",
      "too_small",
      "too_big",
      "invalid_intersection_types",
      "not_multiple_of",
      "not_finite"
    ]);
    quotelessJson = (obj) => {
      const json = JSON.stringify(obj, null, 2);
      return json.replace(/"([^"]+)":/g, "$1:");
    };
    ZodError = class _ZodError extends Error {
      get errors() {
        return this.issues;
      }
      constructor(issues) {
        super();
        this.issues = [];
        this.addIssue = (sub) => {
          this.issues = [...this.issues, sub];
        };
        this.addIssues = (subs = []) => {
          this.issues = [...this.issues, ...subs];
        };
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(this, actualProto);
        } else {
          this.__proto__ = actualProto;
        }
        this.name = "ZodError";
        this.issues = issues;
      }
      format(_mapper) {
        const mapper = _mapper || function(issue) {
          return issue.message;
        };
        const fieldErrors = { _errors: [] };
        const processError = (error) => {
          for (const issue of error.issues) {
            if (issue.code === "invalid_union") {
              issue.unionErrors.map(processError);
            } else if (issue.code === "invalid_return_type") {
              processError(issue.returnTypeError);
            } else if (issue.code === "invalid_arguments") {
              processError(issue.argumentsError);
            } else if (issue.path.length === 0) {
              fieldErrors._errors.push(mapper(issue));
            } else {
              let curr = fieldErrors;
              let i = 0;
              while (i < issue.path.length) {
                const el = issue.path[i];
                const terminal = i === issue.path.length - 1;
                if (!terminal) {
                  curr[el] = curr[el] || { _errors: [] };
                } else {
                  curr[el] = curr[el] || { _errors: [] };
                  curr[el]._errors.push(mapper(issue));
                }
                curr = curr[el];
                i++;
              }
            }
          }
        };
        processError(this);
        return fieldErrors;
      }
      static assert(value) {
        if (!(value instanceof _ZodError)) {
          throw new Error(`Not a ZodError: ${value}`);
        }
      }
      toString() {
        return this.message;
      }
      get message() {
        return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
      }
      get isEmpty() {
        return this.issues.length === 0;
      }
      flatten(mapper = (issue) => issue.message) {
        const fieldErrors = {};
        const formErrors = [];
        for (const sub of this.issues) {
          if (sub.path.length > 0) {
            const firstEl = sub.path[0];
            fieldErrors[firstEl] = fieldErrors[firstEl] || [];
            fieldErrors[firstEl].push(mapper(sub));
          } else {
            formErrors.push(mapper(sub));
          }
        }
        return { formErrors, fieldErrors };
      }
      get formErrors() {
        return this.flatten();
      }
    };
    ZodError.create = (issues) => {
      const error = new ZodError(issues);
      return error;
    };
  }
});

// node_modules/zod/v3/locales/en.js
var errorMap, en_default;
var init_en = __esm({
  "node_modules/zod/v3/locales/en.js"() {
    init_ZodError();
    init_util();
    errorMap = (issue, _ctx) => {
      let message;
      switch (issue.code) {
        case ZodIssueCode.invalid_type:
          if (issue.received === ZodParsedType.undefined) {
            message = "Required";
          } else {
            message = `Expected ${issue.expected}, received ${issue.received}`;
          }
          break;
        case ZodIssueCode.invalid_literal:
          message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
          break;
        case ZodIssueCode.unrecognized_keys:
          message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
          break;
        case ZodIssueCode.invalid_union:
          message = `Invalid input`;
          break;
        case ZodIssueCode.invalid_union_discriminator:
          message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
          break;
        case ZodIssueCode.invalid_enum_value:
          message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
          break;
        case ZodIssueCode.invalid_arguments:
          message = `Invalid function arguments`;
          break;
        case ZodIssueCode.invalid_return_type:
          message = `Invalid function return type`;
          break;
        case ZodIssueCode.invalid_date:
          message = `Invalid date`;
          break;
        case ZodIssueCode.invalid_string:
          if (typeof issue.validation === "object") {
            if ("includes" in issue.validation) {
              message = `Invalid input: must include "${issue.validation.includes}"`;
              if (typeof issue.validation.position === "number") {
                message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
              }
            } else if ("startsWith" in issue.validation) {
              message = `Invalid input: must start with "${issue.validation.startsWith}"`;
            } else if ("endsWith" in issue.validation) {
              message = `Invalid input: must end with "${issue.validation.endsWith}"`;
            } else {
              util.assertNever(issue.validation);
            }
          } else if (issue.validation !== "regex") {
            message = `Invalid ${issue.validation}`;
          } else {
            message = "Invalid";
          }
          break;
        case ZodIssueCode.too_small:
          if (issue.type === "array")
            message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
          else if (issue.type === "string")
            message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
          else if (issue.type === "number")
            message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
          else if (issue.type === "bigint")
            message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
          else if (issue.type === "date")
            message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
          else
            message = "Invalid input";
          break;
        case ZodIssueCode.too_big:
          if (issue.type === "array")
            message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
          else if (issue.type === "string")
            message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
          else if (issue.type === "number")
            message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
          else if (issue.type === "bigint")
            message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
          else if (issue.type === "date")
            message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
          else
            message = "Invalid input";
          break;
        case ZodIssueCode.custom:
          message = `Invalid input`;
          break;
        case ZodIssueCode.invalid_intersection_types:
          message = `Intersection results could not be merged`;
          break;
        case ZodIssueCode.not_multiple_of:
          message = `Number must be a multiple of ${issue.multipleOf}`;
          break;
        case ZodIssueCode.not_finite:
          message = "Number must be finite";
          break;
        default:
          message = _ctx.defaultError;
          util.assertNever(issue);
      }
      return { message };
    };
    en_default = errorMap;
  }
});

// node_modules/zod/v3/errors.js
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
var overrideErrorMap;
var init_errors = __esm({
  "node_modules/zod/v3/errors.js"() {
    init_en();
    overrideErrorMap = en_default;
  }
});

// node_modules/zod/v3/helpers/parseUtil.js
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var makeIssue, EMPTY_PATH, ParseStatus, INVALID, DIRTY, OK, isAborted, isDirty, isValid, isAsync;
var init_parseUtil = __esm({
  "node_modules/zod/v3/helpers/parseUtil.js"() {
    init_errors();
    init_en();
    makeIssue = (params) => {
      const { data, path: path9, errorMaps, issueData } = params;
      const fullPath = [...path9, ...issueData.path || []];
      const fullIssue = {
        ...issueData,
        path: fullPath
      };
      if (issueData.message !== void 0) {
        return {
          ...issueData,
          path: fullPath,
          message: issueData.message
        };
      }
      let errorMessage = "";
      const maps = errorMaps.filter((m) => !!m).slice().reverse();
      for (const map of maps) {
        errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
      }
      return {
        ...issueData,
        path: fullPath,
        message: errorMessage
      };
    };
    EMPTY_PATH = [];
    ParseStatus = class _ParseStatus {
      constructor() {
        this.value = "valid";
      }
      dirty() {
        if (this.value === "valid")
          this.value = "dirty";
      }
      abort() {
        if (this.value !== "aborted")
          this.value = "aborted";
      }
      static mergeArray(status, results) {
        const arrayValue = [];
        for (const s of results) {
          if (s.status === "aborted")
            return INVALID;
          if (s.status === "dirty")
            status.dirty();
          arrayValue.push(s.value);
        }
        return { status: status.value, value: arrayValue };
      }
      static async mergeObjectAsync(status, pairs) {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value
          });
        }
        return _ParseStatus.mergeObjectSync(status, syncPairs);
      }
      static mergeObjectSync(status, pairs) {
        const finalObject = {};
        for (const pair of pairs) {
          const { key, value } = pair;
          if (key.status === "aborted")
            return INVALID;
          if (value.status === "aborted")
            return INVALID;
          if (key.status === "dirty")
            status.dirty();
          if (value.status === "dirty")
            status.dirty();
          if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
            finalObject[key.value] = value.value;
          }
        }
        return { status: status.value, value: finalObject };
      }
    };
    INVALID = Object.freeze({
      status: "aborted"
    });
    DIRTY = (value) => ({ status: "dirty", value });
    OK = (value) => ({ status: "valid", value });
    isAborted = (x) => x.status === "aborted";
    isDirty = (x) => x.status === "dirty";
    isValid = (x) => x.status === "valid";
    isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
  }
});

// node_modules/zod/v3/helpers/typeAliases.js
var init_typeAliases = __esm({
  "node_modules/zod/v3/helpers/typeAliases.js"() {
  }
});

// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
var init_errorUtil = __esm({
  "node_modules/zod/v3/helpers/errorUtil.js"() {
    (function(errorUtil2) {
      errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
      errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
    })(errorUtil || (errorUtil = {}));
  }
});

// node_modules/zod/v3/types.js
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var ParseInputLazyPath, handleResult, ZodType, cuidRegex, cuid2Regex, ulidRegex, uuidRegex, nanoidRegex, jwtRegex, durationRegex, emailRegex, _emojiRegex, emojiRegex, ipv4Regex, ipv4CidrRegex, ipv6Regex, ipv6CidrRegex, base64Regex, base64urlRegex, dateRegexSource, dateRegex, ZodString, ZodNumber, ZodBigInt, ZodBoolean, ZodDate, ZodSymbol, ZodUndefined, ZodNull, ZodAny, ZodUnknown, ZodNever, ZodVoid, ZodArray, ZodObject, ZodUnion, getDiscriminator, ZodDiscriminatedUnion, ZodIntersection, ZodTuple, ZodRecord, ZodMap, ZodSet, ZodFunction, ZodLazy, ZodLiteral, ZodEnum, ZodNativeEnum, ZodPromise, ZodEffects, ZodOptional, ZodNullable, ZodDefault, ZodCatch, ZodNaN, BRAND, ZodBranded, ZodPipeline, ZodReadonly, late, ZodFirstPartyTypeKind, instanceOfType, stringType, numberType, nanType, bigIntType, booleanType, dateType, symbolType, undefinedType, nullType, anyType, unknownType, neverType, voidType, arrayType, objectType, strictObjectType, unionType, discriminatedUnionType, intersectionType, tupleType, recordType, mapType, setType, functionType, lazyType, literalType, enumType, nativeEnumType, promiseType, effectsType, optionalType, nullableType, preprocessType, pipelineType, ostring, onumber, oboolean, coerce, NEVER;
var init_types = __esm({
  "node_modules/zod/v3/types.js"() {
    init_ZodError();
    init_errors();
    init_errorUtil();
    init_parseUtil();
    init_util();
    ParseInputLazyPath = class {
      constructor(parent, value, path9, key) {
        this._cachedPath = [];
        this.parent = parent;
        this.data = value;
        this._path = path9;
        this._key = key;
      }
      get path() {
        if (!this._cachedPath.length) {
          if (Array.isArray(this._key)) {
            this._cachedPath.push(...this._path, ...this._key);
          } else {
            this._cachedPath.push(...this._path, this._key);
          }
        }
        return this._cachedPath;
      }
    };
    handleResult = (ctx, result) => {
      if (isValid(result)) {
        return { success: true, data: result.value };
      } else {
        if (!ctx.common.issues.length) {
          throw new Error("Validation failed but no issues detected.");
        }
        return {
          success: false,
          get error() {
            if (this._error)
              return this._error;
            const error = new ZodError(ctx.common.issues);
            this._error = error;
            return this._error;
          }
        };
      }
    };
    ZodType = class {
      get description() {
        return this._def.description;
      }
      _getType(input) {
        return getParsedType(input.data);
      }
      _getOrReturnCtx(input, ctx) {
        return ctx || {
          common: input.parent.common,
          data: input.data,
          parsedType: getParsedType(input.data),
          schemaErrorMap: this._def.errorMap,
          path: input.path,
          parent: input.parent
        };
      }
      _processInputParams(input) {
        return {
          status: new ParseStatus(),
          ctx: {
            common: input.parent.common,
            data: input.data,
            parsedType: getParsedType(input.data),
            schemaErrorMap: this._def.errorMap,
            path: input.path,
            parent: input.parent
          }
        };
      }
      _parseSync(input) {
        const result = this._parse(input);
        if (isAsync(result)) {
          throw new Error("Synchronous parse encountered promise.");
        }
        return result;
      }
      _parseAsync(input) {
        const result = this._parse(input);
        return Promise.resolve(result);
      }
      parse(data, params) {
        const result = this.safeParse(data, params);
        if (result.success)
          return result.data;
        throw result.error;
      }
      safeParse(data, params) {
        const ctx = {
          common: {
            issues: [],
            async: params?.async ?? false,
            contextualErrorMap: params?.errorMap
          },
          path: params?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        const result = this._parseSync({ data, path: ctx.path, parent: ctx });
        return handleResult(ctx, result);
      }
      "~validate"(data) {
        const ctx = {
          common: {
            issues: [],
            async: !!this["~standard"].async
          },
          path: [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        if (!this["~standard"].async) {
          try {
            const result = this._parseSync({ data, path: [], parent: ctx });
            return isValid(result) ? {
              value: result.value
            } : {
              issues: ctx.common.issues
            };
          } catch (err) {
            if (err?.message?.toLowerCase()?.includes("encountered")) {
              this["~standard"].async = true;
            }
            ctx.common = {
              issues: [],
              async: true
            };
          }
        }
        return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        });
      }
      async parseAsync(data, params) {
        const result = await this.safeParseAsync(data, params);
        if (result.success)
          return result.data;
        throw result.error;
      }
      async safeParseAsync(data, params) {
        const ctx = {
          common: {
            issues: [],
            contextualErrorMap: params?.errorMap,
            async: true
          },
          path: params?.path || [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data,
          parsedType: getParsedType(data)
        };
        const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
        const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
        return handleResult(ctx, result);
      }
      refine(check, message) {
        const getIssueProperties = (val) => {
          if (typeof message === "string" || typeof message === "undefined") {
            return { message };
          } else if (typeof message === "function") {
            return message(val);
          } else {
            return message;
          }
        };
        return this._refinement((val, ctx) => {
          const result = check(val);
          const setError = () => ctx.addIssue({
            code: ZodIssueCode.custom,
            ...getIssueProperties(val)
          });
          if (typeof Promise !== "undefined" && result instanceof Promise) {
            return result.then((data) => {
              if (!data) {
                setError();
                return false;
              } else {
                return true;
              }
            });
          }
          if (!result) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      refinement(check, refinementData) {
        return this._refinement((val, ctx) => {
          if (!check(val)) {
            ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
            return false;
          } else {
            return true;
          }
        });
      }
      _refinement(refinement) {
        return new ZodEffects({
          schema: this,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect: { type: "refinement", refinement }
        });
      }
      superRefine(refinement) {
        return this._refinement(refinement);
      }
      constructor(def) {
        this.spa = this.safeParseAsync;
        this._def = def;
        this.parse = this.parse.bind(this);
        this.safeParse = this.safeParse.bind(this);
        this.parseAsync = this.parseAsync.bind(this);
        this.safeParseAsync = this.safeParseAsync.bind(this);
        this.spa = this.spa.bind(this);
        this.refine = this.refine.bind(this);
        this.refinement = this.refinement.bind(this);
        this.superRefine = this.superRefine.bind(this);
        this.optional = this.optional.bind(this);
        this.nullable = this.nullable.bind(this);
        this.nullish = this.nullish.bind(this);
        this.array = this.array.bind(this);
        this.promise = this.promise.bind(this);
        this.or = this.or.bind(this);
        this.and = this.and.bind(this);
        this.transform = this.transform.bind(this);
        this.brand = this.brand.bind(this);
        this.default = this.default.bind(this);
        this.catch = this.catch.bind(this);
        this.describe = this.describe.bind(this);
        this.pipe = this.pipe.bind(this);
        this.readonly = this.readonly.bind(this);
        this.isNullable = this.isNullable.bind(this);
        this.isOptional = this.isOptional.bind(this);
        this["~standard"] = {
          version: 1,
          vendor: "zod",
          validate: (data) => this["~validate"](data)
        };
      }
      optional() {
        return ZodOptional.create(this, this._def);
      }
      nullable() {
        return ZodNullable.create(this, this._def);
      }
      nullish() {
        return this.nullable().optional();
      }
      array() {
        return ZodArray.create(this);
      }
      promise() {
        return ZodPromise.create(this, this._def);
      }
      or(option) {
        return ZodUnion.create([this, option], this._def);
      }
      and(incoming) {
        return ZodIntersection.create(this, incoming, this._def);
      }
      transform(transform) {
        return new ZodEffects({
          ...processCreateParams(this._def),
          schema: this,
          typeName: ZodFirstPartyTypeKind.ZodEffects,
          effect: { type: "transform", transform }
        });
      }
      default(def) {
        const defaultValueFunc = typeof def === "function" ? def : () => def;
        return new ZodDefault({
          ...processCreateParams(this._def),
          innerType: this,
          defaultValue: defaultValueFunc,
          typeName: ZodFirstPartyTypeKind.ZodDefault
        });
      }
      brand() {
        return new ZodBranded({
          typeName: ZodFirstPartyTypeKind.ZodBranded,
          type: this,
          ...processCreateParams(this._def)
        });
      }
      catch(def) {
        const catchValueFunc = typeof def === "function" ? def : () => def;
        return new ZodCatch({
          ...processCreateParams(this._def),
          innerType: this,
          catchValue: catchValueFunc,
          typeName: ZodFirstPartyTypeKind.ZodCatch
        });
      }
      describe(description) {
        const This = this.constructor;
        return new This({
          ...this._def,
          description
        });
      }
      pipe(target) {
        return ZodPipeline.create(this, target);
      }
      readonly() {
        return ZodReadonly.create(this);
      }
      isOptional() {
        return this.safeParse(void 0).success;
      }
      isNullable() {
        return this.safeParse(null).success;
      }
    };
    cuidRegex = /^c[^\s-]{8,}$/i;
    cuid2Regex = /^[0-9a-z]+$/;
    ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
    uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
    nanoidRegex = /^[a-z0-9_-]{21}$/i;
    jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
    emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
    _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
    ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
    ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
    ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
    base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
    dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
    dateRegex = new RegExp(`^${dateRegexSource}$`);
    ZodString = class _ZodString extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = String(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.string) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.string,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        const status = new ParseStatus();
        let ctx = void 0;
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            if (input.data.length < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.length > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "string",
                inclusive: true,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "length") {
            const tooBig = input.data.length > check.value;
            const tooSmall = input.data.length < check.value;
            if (tooBig || tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              if (tooBig) {
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_big,
                  maximum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              } else if (tooSmall) {
                addIssueToContext(ctx, {
                  code: ZodIssueCode.too_small,
                  minimum: check.value,
                  type: "string",
                  inclusive: true,
                  exact: true,
                  message: check.message
                });
              }
              status.dirty();
            }
          } else if (check.kind === "email") {
            if (!emailRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "email",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "emoji") {
            if (!emojiRegex) {
              emojiRegex = new RegExp(_emojiRegex, "u");
            }
            if (!emojiRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "emoji",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "uuid") {
            if (!uuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "uuid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "nanoid") {
            if (!nanoidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "nanoid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cuid") {
            if (!cuidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cuid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cuid2") {
            if (!cuid2Regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cuid2",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "ulid") {
            if (!ulidRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "ulid",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "url") {
            try {
              new URL(input.data);
            } catch {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "url",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "regex") {
            check.regex.lastIndex = 0;
            const testResult = check.regex.test(input.data);
            if (!testResult) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "regex",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "trim") {
            input.data = input.data.trim();
          } else if (check.kind === "includes") {
            if (!input.data.includes(check.value, check.position)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { includes: check.value, position: check.position },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "toLowerCase") {
            input.data = input.data.toLowerCase();
          } else if (check.kind === "toUpperCase") {
            input.data = input.data.toUpperCase();
          } else if (check.kind === "startsWith") {
            if (!input.data.startsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { startsWith: check.value },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "endsWith") {
            if (!input.data.endsWith(check.value)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: { endsWith: check.value },
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "datetime") {
            const regex = datetimeRegex(check);
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "datetime",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "date") {
            const regex = dateRegex;
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "date",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "time") {
            const regex = timeRegex(check);
            if (!regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_string,
                validation: "time",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "duration") {
            if (!durationRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "duration",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "ip") {
            if (!isValidIP(input.data, check.version)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "ip",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "jwt") {
            if (!isValidJWT(input.data, check.alg)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "jwt",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "cidr") {
            if (!isValidCidr(input.data, check.version)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "cidr",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "base64") {
            if (!base64Regex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "base64",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "base64url") {
            if (!base64urlRegex.test(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                validation: "base64url",
                code: ZodIssueCode.invalid_string,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      _regex(regex, validation, message) {
        return this.refinement((data) => regex.test(data), {
          validation,
          code: ZodIssueCode.invalid_string,
          ...errorUtil.errToObj(message)
        });
      }
      _addCheck(check) {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      email(message) {
        return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
      }
      url(message) {
        return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
      }
      emoji(message) {
        return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
      }
      uuid(message) {
        return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
      }
      nanoid(message) {
        return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
      }
      cuid(message) {
        return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
      }
      cuid2(message) {
        return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
      }
      ulid(message) {
        return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
      }
      base64(message) {
        return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
      }
      base64url(message) {
        return this._addCheck({
          kind: "base64url",
          ...errorUtil.errToObj(message)
        });
      }
      jwt(options) {
        return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
      }
      ip(options) {
        return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
      }
      cidr(options) {
        return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
      }
      datetime(options) {
        if (typeof options === "string") {
          return this._addCheck({
            kind: "datetime",
            precision: null,
            offset: false,
            local: false,
            message: options
          });
        }
        return this._addCheck({
          kind: "datetime",
          precision: typeof options?.precision === "undefined" ? null : options?.precision,
          offset: options?.offset ?? false,
          local: options?.local ?? false,
          ...errorUtil.errToObj(options?.message)
        });
      }
      date(message) {
        return this._addCheck({ kind: "date", message });
      }
      time(options) {
        if (typeof options === "string") {
          return this._addCheck({
            kind: "time",
            precision: null,
            message: options
          });
        }
        return this._addCheck({
          kind: "time",
          precision: typeof options?.precision === "undefined" ? null : options?.precision,
          ...errorUtil.errToObj(options?.message)
        });
      }
      duration(message) {
        return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
      }
      regex(regex, message) {
        return this._addCheck({
          kind: "regex",
          regex,
          ...errorUtil.errToObj(message)
        });
      }
      includes(value, options) {
        return this._addCheck({
          kind: "includes",
          value,
          position: options?.position,
          ...errorUtil.errToObj(options?.message)
        });
      }
      startsWith(value, message) {
        return this._addCheck({
          kind: "startsWith",
          value,
          ...errorUtil.errToObj(message)
        });
      }
      endsWith(value, message) {
        return this._addCheck({
          kind: "endsWith",
          value,
          ...errorUtil.errToObj(message)
        });
      }
      min(minLength, message) {
        return this._addCheck({
          kind: "min",
          value: minLength,
          ...errorUtil.errToObj(message)
        });
      }
      max(maxLength, message) {
        return this._addCheck({
          kind: "max",
          value: maxLength,
          ...errorUtil.errToObj(message)
        });
      }
      length(len, message) {
        return this._addCheck({
          kind: "length",
          value: len,
          ...errorUtil.errToObj(message)
        });
      }
      /**
       * Equivalent to `.min(1)`
       */
      nonempty(message) {
        return this.min(1, errorUtil.errToObj(message));
      }
      trim() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "trim" }]
        });
      }
      toLowerCase() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "toLowerCase" }]
        });
      }
      toUpperCase() {
        return new _ZodString({
          ...this._def,
          checks: [...this._def.checks, { kind: "toUpperCase" }]
        });
      }
      get isDatetime() {
        return !!this._def.checks.find((ch) => ch.kind === "datetime");
      }
      get isDate() {
        return !!this._def.checks.find((ch) => ch.kind === "date");
      }
      get isTime() {
        return !!this._def.checks.find((ch) => ch.kind === "time");
      }
      get isDuration() {
        return !!this._def.checks.find((ch) => ch.kind === "duration");
      }
      get isEmail() {
        return !!this._def.checks.find((ch) => ch.kind === "email");
      }
      get isURL() {
        return !!this._def.checks.find((ch) => ch.kind === "url");
      }
      get isEmoji() {
        return !!this._def.checks.find((ch) => ch.kind === "emoji");
      }
      get isUUID() {
        return !!this._def.checks.find((ch) => ch.kind === "uuid");
      }
      get isNANOID() {
        return !!this._def.checks.find((ch) => ch.kind === "nanoid");
      }
      get isCUID() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid");
      }
      get isCUID2() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid2");
      }
      get isULID() {
        return !!this._def.checks.find((ch) => ch.kind === "ulid");
      }
      get isIP() {
        return !!this._def.checks.find((ch) => ch.kind === "ip");
      }
      get isCIDR() {
        return !!this._def.checks.find((ch) => ch.kind === "cidr");
      }
      get isBase64() {
        return !!this._def.checks.find((ch) => ch.kind === "base64");
      }
      get isBase64url() {
        return !!this._def.checks.find((ch) => ch.kind === "base64url");
      }
      get minLength() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxLength() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
    };
    ZodString.create = (params) => {
      return new ZodString({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodString,
        coerce: params?.coerce ?? false,
        ...processCreateParams(params)
      });
    };
    ZodNumber = class _ZodNumber extends ZodType {
      constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
        this.step = this.multipleOf;
      }
      _parse(input) {
        if (this._def.coerce) {
          input.data = Number(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.number) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.number,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        let ctx = void 0;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
          if (check.kind === "int") {
            if (!util.isInteger(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: "integer",
                received: "float",
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "min") {
            const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
            if (tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
            if (tooBig) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "number",
                inclusive: check.inclusive,
                exact: false,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "multipleOf") {
            if (floatSafeRemainder(input.data, check.value) !== 0) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "finite") {
            if (!Number.isFinite(input.data)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_finite,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
      }
      gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
      }
      lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
      }
      lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
      }
      setLimit(kind, value, inclusive, message) {
        return new _ZodNumber({
          ...this._def,
          checks: [
            ...this._def.checks,
            {
              kind,
              value,
              inclusive,
              message: errorUtil.toString(message)
            }
          ]
        });
      }
      _addCheck(check) {
        return new _ZodNumber({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      int(message) {
        return this._addCheck({
          kind: "int",
          message: errorUtil.toString(message)
        });
      }
      positive(message) {
        return this._addCheck({
          kind: "min",
          value: 0,
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      negative(message) {
        return this._addCheck({
          kind: "max",
          value: 0,
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      nonpositive(message) {
        return this._addCheck({
          kind: "max",
          value: 0,
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      nonnegative(message) {
        return this._addCheck({
          kind: "min",
          value: 0,
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      multipleOf(value, message) {
        return this._addCheck({
          kind: "multipleOf",
          value,
          message: errorUtil.toString(message)
        });
      }
      finite(message) {
        return this._addCheck({
          kind: "finite",
          message: errorUtil.toString(message)
        });
      }
      safe(message) {
        return this._addCheck({
          kind: "min",
          inclusive: true,
          value: Number.MIN_SAFE_INTEGER,
          message: errorUtil.toString(message)
        })._addCheck({
          kind: "max",
          inclusive: true,
          value: Number.MAX_SAFE_INTEGER,
          message: errorUtil.toString(message)
        });
      }
      get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
      get isInt() {
        return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
      }
      get isFinite() {
        let max = null;
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
            return true;
          } else if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          } else if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return Number.isFinite(min) && Number.isFinite(max);
      }
    };
    ZodNumber.create = (params) => {
      return new ZodNumber({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodNumber,
        coerce: params?.coerce || false,
        ...processCreateParams(params)
      });
    };
    ZodBigInt = class _ZodBigInt extends ZodType {
      constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
      }
      _parse(input) {
        if (this._def.coerce) {
          try {
            input.data = BigInt(input.data);
          } catch {
            return this._getInvalidInput(input);
          }
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.bigint) {
          return this._getInvalidInput(input);
        }
        let ctx = void 0;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
            if (tooSmall) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                type: "bigint",
                minimum: check.value,
                inclusive: check.inclusive,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
            if (tooBig) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                type: "bigint",
                maximum: check.value,
                inclusive: check.inclusive,
                message: check.message
              });
              status.dirty();
            }
          } else if (check.kind === "multipleOf") {
            if (input.data % check.value !== BigInt(0)) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.not_multiple_of,
                multipleOf: check.value,
                message: check.message
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return { status: status.value, value: input.data };
      }
      _getInvalidInput(input) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.bigint,
          received: ctx.parsedType
        });
        return INVALID;
      }
      gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
      }
      gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
      }
      lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
      }
      lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
      }
      setLimit(kind, value, inclusive, message) {
        return new _ZodBigInt({
          ...this._def,
          checks: [
            ...this._def.checks,
            {
              kind,
              value,
              inclusive,
              message: errorUtil.toString(message)
            }
          ]
        });
      }
      _addCheck(check) {
        return new _ZodBigInt({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      positive(message) {
        return this._addCheck({
          kind: "min",
          value: BigInt(0),
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      negative(message) {
        return this._addCheck({
          kind: "max",
          value: BigInt(0),
          inclusive: false,
          message: errorUtil.toString(message)
        });
      }
      nonpositive(message) {
        return this._addCheck({
          kind: "max",
          value: BigInt(0),
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      nonnegative(message) {
        return this._addCheck({
          kind: "min",
          value: BigInt(0),
          inclusive: true,
          message: errorUtil.toString(message)
        });
      }
      multipleOf(value, message) {
        return this._addCheck({
          kind: "multipleOf",
          value,
          message: errorUtil.toString(message)
        });
      }
      get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min;
      }
      get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max;
      }
    };
    ZodBigInt.create = (params) => {
      return new ZodBigInt({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodBigInt,
        coerce: params?.coerce ?? false,
        ...processCreateParams(params)
      });
    };
    ZodBoolean = class extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = Boolean(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.boolean) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.boolean,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodBoolean.create = (params) => {
      return new ZodBoolean({
        typeName: ZodFirstPartyTypeKind.ZodBoolean,
        coerce: params?.coerce || false,
        ...processCreateParams(params)
      });
    };
    ZodDate = class _ZodDate extends ZodType {
      _parse(input) {
        if (this._def.coerce) {
          input.data = new Date(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.date) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.date,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        if (Number.isNaN(input.data.getTime())) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_date
          });
          return INVALID;
        }
        const status = new ParseStatus();
        let ctx = void 0;
        for (const check of this._def.checks) {
          if (check.kind === "min") {
            if (input.data.getTime() < check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                message: check.message,
                inclusive: true,
                exact: false,
                minimum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else if (check.kind === "max") {
            if (input.data.getTime() > check.value) {
              ctx = this._getOrReturnCtx(input, ctx);
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                message: check.message,
                inclusive: true,
                exact: false,
                maximum: check.value,
                type: "date"
              });
              status.dirty();
            }
          } else {
            util.assertNever(check);
          }
        }
        return {
          status: status.value,
          value: new Date(input.data.getTime())
        };
      }
      _addCheck(check) {
        return new _ZodDate({
          ...this._def,
          checks: [...this._def.checks, check]
        });
      }
      min(minDate, message) {
        return this._addCheck({
          kind: "min",
          value: minDate.getTime(),
          message: errorUtil.toString(message)
        });
      }
      max(maxDate, message) {
        return this._addCheck({
          kind: "max",
          value: maxDate.getTime(),
          message: errorUtil.toString(message)
        });
      }
      get minDate() {
        let min = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "min") {
            if (min === null || ch.value > min)
              min = ch.value;
          }
        }
        return min != null ? new Date(min) : null;
      }
      get maxDate() {
        let max = null;
        for (const ch of this._def.checks) {
          if (ch.kind === "max") {
            if (max === null || ch.value < max)
              max = ch.value;
          }
        }
        return max != null ? new Date(max) : null;
      }
    };
    ZodDate.create = (params) => {
      return new ZodDate({
        checks: [],
        coerce: params?.coerce || false,
        typeName: ZodFirstPartyTypeKind.ZodDate,
        ...processCreateParams(params)
      });
    };
    ZodSymbol = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.symbol) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.symbol,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodSymbol.create = (params) => {
      return new ZodSymbol({
        typeName: ZodFirstPartyTypeKind.ZodSymbol,
        ...processCreateParams(params)
      });
    };
    ZodUndefined = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.undefined,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodUndefined.create = (params) => {
      return new ZodUndefined({
        typeName: ZodFirstPartyTypeKind.ZodUndefined,
        ...processCreateParams(params)
      });
    };
    ZodNull = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.null) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.null,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodNull.create = (params) => {
      return new ZodNull({
        typeName: ZodFirstPartyTypeKind.ZodNull,
        ...processCreateParams(params)
      });
    };
    ZodAny = class extends ZodType {
      constructor() {
        super(...arguments);
        this._any = true;
      }
      _parse(input) {
        return OK(input.data);
      }
    };
    ZodAny.create = (params) => {
      return new ZodAny({
        typeName: ZodFirstPartyTypeKind.ZodAny,
        ...processCreateParams(params)
      });
    };
    ZodUnknown = class extends ZodType {
      constructor() {
        super(...arguments);
        this._unknown = true;
      }
      _parse(input) {
        return OK(input.data);
      }
    };
    ZodUnknown.create = (params) => {
      return new ZodUnknown({
        typeName: ZodFirstPartyTypeKind.ZodUnknown,
        ...processCreateParams(params)
      });
    };
    ZodNever = class extends ZodType {
      _parse(input) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.never,
          received: ctx.parsedType
        });
        return INVALID;
      }
    };
    ZodNever.create = (params) => {
      return new ZodNever({
        typeName: ZodFirstPartyTypeKind.ZodNever,
        ...processCreateParams(params)
      });
    };
    ZodVoid = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.void,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return OK(input.data);
      }
    };
    ZodVoid.create = (params) => {
      return new ZodVoid({
        typeName: ZodFirstPartyTypeKind.ZodVoid,
        ...processCreateParams(params)
      });
    };
    ZodArray = class _ZodArray extends ZodType {
      _parse(input) {
        const { ctx, status } = this._processInputParams(input);
        const def = this._def;
        if (ctx.parsedType !== ZodParsedType.array) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.array,
            received: ctx.parsedType
          });
          return INVALID;
        }
        if (def.exactLength !== null) {
          const tooBig = ctx.data.length > def.exactLength.value;
          const tooSmall = ctx.data.length < def.exactLength.value;
          if (tooBig || tooSmall) {
            addIssueToContext(ctx, {
              code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
              minimum: tooSmall ? def.exactLength.value : void 0,
              maximum: tooBig ? def.exactLength.value : void 0,
              type: "array",
              inclusive: true,
              exact: true,
              message: def.exactLength.message
            });
            status.dirty();
          }
        }
        if (def.minLength !== null) {
          if (ctx.data.length < def.minLength.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: def.minLength.value,
              type: "array",
              inclusive: true,
              exact: false,
              message: def.minLength.message
            });
            status.dirty();
          }
        }
        if (def.maxLength !== null) {
          if (ctx.data.length > def.maxLength.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: def.maxLength.value,
              type: "array",
              inclusive: true,
              exact: false,
              message: def.maxLength.message
            });
            status.dirty();
          }
        }
        if (ctx.common.async) {
          return Promise.all([...ctx.data].map((item, i) => {
            return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
          })).then((result2) => {
            return ParseStatus.mergeArray(status, result2);
          });
        }
        const result = [...ctx.data].map((item, i) => {
          return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        });
        return ParseStatus.mergeArray(status, result);
      }
      get element() {
        return this._def.type;
      }
      min(minLength, message) {
        return new _ZodArray({
          ...this._def,
          minLength: { value: minLength, message: errorUtil.toString(message) }
        });
      }
      max(maxLength, message) {
        return new _ZodArray({
          ...this._def,
          maxLength: { value: maxLength, message: errorUtil.toString(message) }
        });
      }
      length(len, message) {
        return new _ZodArray({
          ...this._def,
          exactLength: { value: len, message: errorUtil.toString(message) }
        });
      }
      nonempty(message) {
        return this.min(1, message);
      }
    };
    ZodArray.create = (schema, params) => {
      return new ZodArray({
        type: schema,
        minLength: null,
        maxLength: null,
        exactLength: null,
        typeName: ZodFirstPartyTypeKind.ZodArray,
        ...processCreateParams(params)
      });
    };
    ZodObject = class _ZodObject extends ZodType {
      constructor() {
        super(...arguments);
        this._cached = null;
        this.nonstrict = this.passthrough;
        this.augment = this.extend;
      }
      _getCached() {
        if (this._cached !== null)
          return this._cached;
        const shape = this._def.shape();
        const keys = util.objectKeys(shape);
        this._cached = { shape, keys };
        return this._cached;
      }
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.object) {
          const ctx2 = this._getOrReturnCtx(input);
          addIssueToContext(ctx2, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx2.parsedType
          });
          return INVALID;
        }
        const { status, ctx } = this._processInputParams(input);
        const { shape, keys: shapeKeys } = this._getCached();
        const extraKeys = [];
        if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
          for (const key in ctx.data) {
            if (!shapeKeys.includes(key)) {
              extraKeys.push(key);
            }
          }
        }
        const pairs = [];
        for (const key of shapeKeys) {
          const keyValidator = shape[key];
          const value = ctx.data[key];
          pairs.push({
            key: { status: "valid", value: key },
            value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
            alwaysSet: key in ctx.data
          });
        }
        if (this._def.catchall instanceof ZodNever) {
          const unknownKeys = this._def.unknownKeys;
          if (unknownKeys === "passthrough") {
            for (const key of extraKeys) {
              pairs.push({
                key: { status: "valid", value: key },
                value: { status: "valid", value: ctx.data[key] }
              });
            }
          } else if (unknownKeys === "strict") {
            if (extraKeys.length > 0) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.unrecognized_keys,
                keys: extraKeys
              });
              status.dirty();
            }
          } else if (unknownKeys === "strip") {
          } else {
            throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
          }
        } else {
          const catchall = this._def.catchall;
          for (const key of extraKeys) {
            const value = ctx.data[key];
            pairs.push({
              key: { status: "valid", value: key },
              value: catchall._parse(
                new ParseInputLazyPath(ctx, value, ctx.path, key)
                //, ctx.child(key), value, getParsedType(value)
              ),
              alwaysSet: key in ctx.data
            });
          }
        }
        if (ctx.common.async) {
          return Promise.resolve().then(async () => {
            const syncPairs = [];
            for (const pair of pairs) {
              const key = await pair.key;
              const value = await pair.value;
              syncPairs.push({
                key,
                value,
                alwaysSet: pair.alwaysSet
              });
            }
            return syncPairs;
          }).then((syncPairs) => {
            return ParseStatus.mergeObjectSync(status, syncPairs);
          });
        } else {
          return ParseStatus.mergeObjectSync(status, pairs);
        }
      }
      get shape() {
        return this._def.shape();
      }
      strict(message) {
        errorUtil.errToObj;
        return new _ZodObject({
          ...this._def,
          unknownKeys: "strict",
          ...message !== void 0 ? {
            errorMap: (issue, ctx) => {
              const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
              if (issue.code === "unrecognized_keys")
                return {
                  message: errorUtil.errToObj(message).message ?? defaultError
                };
              return {
                message: defaultError
              };
            }
          } : {}
        });
      }
      strip() {
        return new _ZodObject({
          ...this._def,
          unknownKeys: "strip"
        });
      }
      passthrough() {
        return new _ZodObject({
          ...this._def,
          unknownKeys: "passthrough"
        });
      }
      // const AugmentFactory =
      //   <Def extends ZodObjectDef>(def: Def) =>
      //   <Augmentation extends ZodRawShape>(
      //     augmentation: Augmentation
      //   ): ZodObject<
      //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
      //     Def["unknownKeys"],
      //     Def["catchall"]
      //   > => {
      //     return new ZodObject({
      //       ...def,
      //       shape: () => ({
      //         ...def.shape(),
      //         ...augmentation,
      //       }),
      //     }) as any;
      //   };
      extend(augmentation) {
        return new _ZodObject({
          ...this._def,
          shape: () => ({
            ...this._def.shape(),
            ...augmentation
          })
        });
      }
      /**
       * Prior to zod@1.0.12 there was a bug in the
       * inferred type of merged objects. Please
       * upgrade if you are experiencing issues.
       */
      merge(merging) {
        const merged = new _ZodObject({
          unknownKeys: merging._def.unknownKeys,
          catchall: merging._def.catchall,
          shape: () => ({
            ...this._def.shape(),
            ...merging._def.shape()
          }),
          typeName: ZodFirstPartyTypeKind.ZodObject
        });
        return merged;
      }
      // merge<
      //   Incoming extends AnyZodObject,
      //   Augmentation extends Incoming["shape"],
      //   NewOutput extends {
      //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
      //       ? Augmentation[k]["_output"]
      //       : k extends keyof Output
      //       ? Output[k]
      //       : never;
      //   },
      //   NewInput extends {
      //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
      //       ? Augmentation[k]["_input"]
      //       : k extends keyof Input
      //       ? Input[k]
      //       : never;
      //   }
      // >(
      //   merging: Incoming
      // ): ZodObject<
      //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
      //   Incoming["_def"]["unknownKeys"],
      //   Incoming["_def"]["catchall"],
      //   NewOutput,
      //   NewInput
      // > {
      //   const merged: any = new ZodObject({
      //     unknownKeys: merging._def.unknownKeys,
      //     catchall: merging._def.catchall,
      //     shape: () =>
      //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
      //     typeName: ZodFirstPartyTypeKind.ZodObject,
      //   }) as any;
      //   return merged;
      // }
      setKey(key, schema) {
        return this.augment({ [key]: schema });
      }
      // merge<Incoming extends AnyZodObject>(
      //   merging: Incoming
      // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
      // ZodObject<
      //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
      //   Incoming["_def"]["unknownKeys"],
      //   Incoming["_def"]["catchall"]
      // > {
      //   // const mergedShape = objectUtil.mergeShapes(
      //   //   this._def.shape(),
      //   //   merging._def.shape()
      //   // );
      //   const merged: any = new ZodObject({
      //     unknownKeys: merging._def.unknownKeys,
      //     catchall: merging._def.catchall,
      //     shape: () =>
      //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
      //     typeName: ZodFirstPartyTypeKind.ZodObject,
      //   }) as any;
      //   return merged;
      // }
      catchall(index) {
        return new _ZodObject({
          ...this._def,
          catchall: index
        });
      }
      pick(mask) {
        const shape = {};
        for (const key of util.objectKeys(mask)) {
          if (mask[key] && this.shape[key]) {
            shape[key] = this.shape[key];
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: () => shape
        });
      }
      omit(mask) {
        const shape = {};
        for (const key of util.objectKeys(this.shape)) {
          if (!mask[key]) {
            shape[key] = this.shape[key];
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: () => shape
        });
      }
      /**
       * @deprecated
       */
      deepPartial() {
        return deepPartialify(this);
      }
      partial(mask) {
        const newShape = {};
        for (const key of util.objectKeys(this.shape)) {
          const fieldSchema = this.shape[key];
          if (mask && !mask[key]) {
            newShape[key] = fieldSchema;
          } else {
            newShape[key] = fieldSchema.optional();
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: () => newShape
        });
      }
      required(mask) {
        const newShape = {};
        for (const key of util.objectKeys(this.shape)) {
          if (mask && !mask[key]) {
            newShape[key] = this.shape[key];
          } else {
            const fieldSchema = this.shape[key];
            let newField = fieldSchema;
            while (newField instanceof ZodOptional) {
              newField = newField._def.innerType;
            }
            newShape[key] = newField;
          }
        }
        return new _ZodObject({
          ...this._def,
          shape: () => newShape
        });
      }
      keyof() {
        return createZodEnum(util.objectKeys(this.shape));
      }
    };
    ZodObject.create = (shape, params) => {
      return new ZodObject({
        shape: () => shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.strictCreate = (shape, params) => {
      return new ZodObject({
        shape: () => shape,
        unknownKeys: "strict",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodObject.lazycreate = (shape, params) => {
      return new ZodObject({
        shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params)
      });
    };
    ZodUnion = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const options = this._def.options;
        function handleResults(results) {
          for (const result of results) {
            if (result.result.status === "valid") {
              return result.result;
            }
          }
          for (const result of results) {
            if (result.result.status === "dirty") {
              ctx.common.issues.push(...result.ctx.common.issues);
              return result.result;
            }
          }
          const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union,
            unionErrors
          });
          return INVALID;
        }
        if (ctx.common.async) {
          return Promise.all(options.map(async (option) => {
            const childCtx = {
              ...ctx,
              common: {
                ...ctx.common,
                issues: []
              },
              parent: null
            };
            return {
              result: await option._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: childCtx
              }),
              ctx: childCtx
            };
          })).then(handleResults);
        } else {
          let dirty = void 0;
          const issues = [];
          for (const option of options) {
            const childCtx = {
              ...ctx,
              common: {
                ...ctx.common,
                issues: []
              },
              parent: null
            };
            const result = option._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx
            });
            if (result.status === "valid") {
              return result;
            } else if (result.status === "dirty" && !dirty) {
              dirty = { result, ctx: childCtx };
            }
            if (childCtx.common.issues.length) {
              issues.push(childCtx.common.issues);
            }
          }
          if (dirty) {
            ctx.common.issues.push(...dirty.ctx.common.issues);
            return dirty.result;
          }
          const unionErrors = issues.map((issues2) => new ZodError(issues2));
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union,
            unionErrors
          });
          return INVALID;
        }
      }
      get options() {
        return this._def.options;
      }
    };
    ZodUnion.create = (types, params) => {
      return new ZodUnion({
        options: types,
        typeName: ZodFirstPartyTypeKind.ZodUnion,
        ...processCreateParams(params)
      });
    };
    getDiscriminator = (type) => {
      if (type instanceof ZodLazy) {
        return getDiscriminator(type.schema);
      } else if (type instanceof ZodEffects) {
        return getDiscriminator(type.innerType());
      } else if (type instanceof ZodLiteral) {
        return [type.value];
      } else if (type instanceof ZodEnum) {
        return type.options;
      } else if (type instanceof ZodNativeEnum) {
        return util.objectValues(type.enum);
      } else if (type instanceof ZodDefault) {
        return getDiscriminator(type._def.innerType);
      } else if (type instanceof ZodUndefined) {
        return [void 0];
      } else if (type instanceof ZodNull) {
        return [null];
      } else if (type instanceof ZodOptional) {
        return [void 0, ...getDiscriminator(type.unwrap())];
      } else if (type instanceof ZodNullable) {
        return [null, ...getDiscriminator(type.unwrap())];
      } else if (type instanceof ZodBranded) {
        return getDiscriminator(type.unwrap());
      } else if (type instanceof ZodReadonly) {
        return getDiscriminator(type.unwrap());
      } else if (type instanceof ZodCatch) {
        return getDiscriminator(type._def.innerType);
      } else {
        return [];
      }
    };
    ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const discriminator = this.discriminator;
        const discriminatorValue = ctx.data[discriminator];
        const option = this.optionsMap.get(discriminatorValue);
        if (!option) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_union_discriminator,
            options: Array.from(this.optionsMap.keys()),
            path: [discriminator]
          });
          return INVALID;
        }
        if (ctx.common.async) {
          return option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
        } else {
          return option._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
        }
      }
      get discriminator() {
        return this._def.discriminator;
      }
      get options() {
        return this._def.options;
      }
      get optionsMap() {
        return this._def.optionsMap;
      }
      /**
       * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
       * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
       * have a different value for each object in the union.
       * @param discriminator the name of the discriminator property
       * @param types an array of object schemas
       * @param params
       */
      static create(discriminator, options, params) {
        const optionsMap = /* @__PURE__ */ new Map();
        for (const type of options) {
          const discriminatorValues = getDiscriminator(type.shape[discriminator]);
          if (!discriminatorValues.length) {
            throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
          }
          for (const value of discriminatorValues) {
            if (optionsMap.has(value)) {
              throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
            }
            optionsMap.set(value, type);
          }
        }
        return new _ZodDiscriminatedUnion({
          typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
          discriminator,
          options,
          optionsMap,
          ...processCreateParams(params)
        });
      }
    };
    ZodIntersection = class extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const handleParsed = (parsedLeft, parsedRight) => {
          if (isAborted(parsedLeft) || isAborted(parsedRight)) {
            return INVALID;
          }
          const merged = mergeValues(parsedLeft.value, parsedRight.value);
          if (!merged.valid) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_intersection_types
            });
            return INVALID;
          }
          if (isDirty(parsedLeft) || isDirty(parsedRight)) {
            status.dirty();
          }
          return { status: status.value, value: merged.data };
        };
        if (ctx.common.async) {
          return Promise.all([
            this._def.left._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            }),
            this._def.right._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            })
          ]).then(([left, right]) => handleParsed(left, right));
        } else {
          return handleParsed(this._def.left._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }), this._def.right._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }));
        }
      }
    };
    ZodIntersection.create = (left, right, params) => {
      return new ZodIntersection({
        left,
        right,
        typeName: ZodFirstPartyTypeKind.ZodIntersection,
        ...processCreateParams(params)
      });
    };
    ZodTuple = class _ZodTuple extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.array) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.array,
            received: ctx.parsedType
          });
          return INVALID;
        }
        if (ctx.data.length < this._def.items.length) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: this._def.items.length,
            inclusive: true,
            exact: false,
            type: "array"
          });
          return INVALID;
        }
        const rest = this._def.rest;
        if (!rest && ctx.data.length > this._def.items.length) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: this._def.items.length,
            inclusive: true,
            exact: false,
            type: "array"
          });
          status.dirty();
        }
        const items = [...ctx.data].map((item, itemIndex) => {
          const schema = this._def.items[itemIndex] || this._def.rest;
          if (!schema)
            return null;
          return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
        }).filter((x) => !!x);
        if (ctx.common.async) {
          return Promise.all(items).then((results) => {
            return ParseStatus.mergeArray(status, results);
          });
        } else {
          return ParseStatus.mergeArray(status, items);
        }
      }
      get items() {
        return this._def.items;
      }
      rest(rest) {
        return new _ZodTuple({
          ...this._def,
          rest
        });
      }
    };
    ZodTuple.create = (schemas, params) => {
      if (!Array.isArray(schemas)) {
        throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
      }
      return new ZodTuple({
        items: schemas,
        typeName: ZodFirstPartyTypeKind.ZodTuple,
        rest: null,
        ...processCreateParams(params)
      });
    };
    ZodRecord = class _ZodRecord extends ZodType {
      get keySchema() {
        return this._def.keyType;
      }
      get valueSchema() {
        return this._def.valueType;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.object,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const pairs = [];
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        for (const key in ctx.data) {
          pairs.push({
            key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
            value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
            alwaysSet: key in ctx.data
          });
        }
        if (ctx.common.async) {
          return ParseStatus.mergeObjectAsync(status, pairs);
        } else {
          return ParseStatus.mergeObjectSync(status, pairs);
        }
      }
      get element() {
        return this._def.valueType;
      }
      static create(first, second, third) {
        if (second instanceof ZodType) {
          return new _ZodRecord({
            keyType: first,
            valueType: second,
            typeName: ZodFirstPartyTypeKind.ZodRecord,
            ...processCreateParams(third)
          });
        }
        return new _ZodRecord({
          keyType: ZodString.create(),
          valueType: first,
          typeName: ZodFirstPartyTypeKind.ZodRecord,
          ...processCreateParams(second)
        });
      }
    };
    ZodMap = class extends ZodType {
      get keySchema() {
        return this._def.keyType;
      }
      get valueSchema() {
        return this._def.valueType;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.map) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.map,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        const pairs = [...ctx.data.entries()].map(([key, value], index) => {
          return {
            key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
            value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
          };
        });
        if (ctx.common.async) {
          const finalMap = /* @__PURE__ */ new Map();
          return Promise.resolve().then(async () => {
            for (const pair of pairs) {
              const key = await pair.key;
              const value = await pair.value;
              if (key.status === "aborted" || value.status === "aborted") {
                return INVALID;
              }
              if (key.status === "dirty" || value.status === "dirty") {
                status.dirty();
              }
              finalMap.set(key.value, value.value);
            }
            return { status: status.value, value: finalMap };
          });
        } else {
          const finalMap = /* @__PURE__ */ new Map();
          for (const pair of pairs) {
            const key = pair.key;
            const value = pair.value;
            if (key.status === "aborted" || value.status === "aborted") {
              return INVALID;
            }
            if (key.status === "dirty" || value.status === "dirty") {
              status.dirty();
            }
            finalMap.set(key.value, value.value);
          }
          return { status: status.value, value: finalMap };
        }
      }
    };
    ZodMap.create = (keyType, valueType, params) => {
      return new ZodMap({
        valueType,
        keyType,
        typeName: ZodFirstPartyTypeKind.ZodMap,
        ...processCreateParams(params)
      });
    };
    ZodSet = class _ZodSet extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.set) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.set,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const def = this._def;
        if (def.minSize !== null) {
          if (ctx.data.size < def.minSize.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: def.minSize.value,
              type: "set",
              inclusive: true,
              exact: false,
              message: def.minSize.message
            });
            status.dirty();
          }
        }
        if (def.maxSize !== null) {
          if (ctx.data.size > def.maxSize.value) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: def.maxSize.value,
              type: "set",
              inclusive: true,
              exact: false,
              message: def.maxSize.message
            });
            status.dirty();
          }
        }
        const valueType = this._def.valueType;
        function finalizeSet(elements2) {
          const parsedSet = /* @__PURE__ */ new Set();
          for (const element of elements2) {
            if (element.status === "aborted")
              return INVALID;
            if (element.status === "dirty")
              status.dirty();
            parsedSet.add(element.value);
          }
          return { status: status.value, value: parsedSet };
        }
        const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
        if (ctx.common.async) {
          return Promise.all(elements).then((elements2) => finalizeSet(elements2));
        } else {
          return finalizeSet(elements);
        }
      }
      min(minSize, message) {
        return new _ZodSet({
          ...this._def,
          minSize: { value: minSize, message: errorUtil.toString(message) }
        });
      }
      max(maxSize, message) {
        return new _ZodSet({
          ...this._def,
          maxSize: { value: maxSize, message: errorUtil.toString(message) }
        });
      }
      size(size, message) {
        return this.min(size, message).max(size, message);
      }
      nonempty(message) {
        return this.min(1, message);
      }
    };
    ZodSet.create = (valueType, params) => {
      return new ZodSet({
        valueType,
        minSize: null,
        maxSize: null,
        typeName: ZodFirstPartyTypeKind.ZodSet,
        ...processCreateParams(params)
      });
    };
    ZodFunction = class _ZodFunction extends ZodType {
      constructor() {
        super(...arguments);
        this.validate = this.implement;
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.function) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.function,
            received: ctx.parsedType
          });
          return INVALID;
        }
        function makeArgsIssue(args, error) {
          return makeIssue({
            data: args,
            path: ctx.path,
            errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
            issueData: {
              code: ZodIssueCode.invalid_arguments,
              argumentsError: error
            }
          });
        }
        function makeReturnsIssue(returns, error) {
          return makeIssue({
            data: returns,
            path: ctx.path,
            errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
            issueData: {
              code: ZodIssueCode.invalid_return_type,
              returnTypeError: error
            }
          });
        }
        const params = { errorMap: ctx.common.contextualErrorMap };
        const fn = ctx.data;
        if (this._def.returns instanceof ZodPromise) {
          const me = this;
          return OK(async function(...args) {
            const error = new ZodError([]);
            const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
              error.addIssue(makeArgsIssue(args, e));
              throw error;
            });
            const result = await Reflect.apply(fn, this, parsedArgs);
            const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
              error.addIssue(makeReturnsIssue(result, e));
              throw error;
            });
            return parsedReturns;
          });
        } else {
          const me = this;
          return OK(function(...args) {
            const parsedArgs = me._def.args.safeParse(args, params);
            if (!parsedArgs.success) {
              throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
            }
            const result = Reflect.apply(fn, this, parsedArgs.data);
            const parsedReturns = me._def.returns.safeParse(result, params);
            if (!parsedReturns.success) {
              throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
            }
            return parsedReturns.data;
          });
        }
      }
      parameters() {
        return this._def.args;
      }
      returnType() {
        return this._def.returns;
      }
      args(...items) {
        return new _ZodFunction({
          ...this._def,
          args: ZodTuple.create(items).rest(ZodUnknown.create())
        });
      }
      returns(returnType) {
        return new _ZodFunction({
          ...this._def,
          returns: returnType
        });
      }
      implement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
      }
      strictImplement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
      }
      static create(args, returns, params) {
        return new _ZodFunction({
          args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
          returns: returns || ZodUnknown.create(),
          typeName: ZodFirstPartyTypeKind.ZodFunction,
          ...processCreateParams(params)
        });
      }
    };
    ZodLazy = class extends ZodType {
      get schema() {
        return this._def.getter();
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const lazySchema = this._def.getter();
        return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
      }
    };
    ZodLazy.create = (getter, params) => {
      return new ZodLazy({
        getter,
        typeName: ZodFirstPartyTypeKind.ZodLazy,
        ...processCreateParams(params)
      });
    };
    ZodLiteral = class extends ZodType {
      _parse(input) {
        if (input.data !== this._def.value) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_literal,
            expected: this._def.value
          });
          return INVALID;
        }
        return { status: "valid", value: input.data };
      }
      get value() {
        return this._def.value;
      }
    };
    ZodLiteral.create = (value, params) => {
      return new ZodLiteral({
        value,
        typeName: ZodFirstPartyTypeKind.ZodLiteral,
        ...processCreateParams(params)
      });
    };
    ZodEnum = class _ZodEnum extends ZodType {
      _parse(input) {
        if (typeof input.data !== "string") {
          const ctx = this._getOrReturnCtx(input);
          const expectedValues = this._def.values;
          addIssueToContext(ctx, {
            expected: util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodIssueCode.invalid_type
          });
          return INVALID;
        }
        if (!this._cache) {
          this._cache = new Set(this._def.values);
        }
        if (!this._cache.has(input.data)) {
          const ctx = this._getOrReturnCtx(input);
          const expectedValues = this._def.values;
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_enum_value,
            options: expectedValues
          });
          return INVALID;
        }
        return OK(input.data);
      }
      get options() {
        return this._def.values;
      }
      get enum() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      get Values() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      get Enum() {
        const enumValues = {};
        for (const val of this._def.values) {
          enumValues[val] = val;
        }
        return enumValues;
      }
      extract(values, newDef = this._def) {
        return _ZodEnum.create(values, {
          ...this._def,
          ...newDef
        });
      }
      exclude(values, newDef = this._def) {
        return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
          ...this._def,
          ...newDef
        });
      }
    };
    ZodEnum.create = createZodEnum;
    ZodNativeEnum = class extends ZodType {
      _parse(input) {
        const nativeEnumValues = util.getValidEnumValues(this._def.values);
        const ctx = this._getOrReturnCtx(input);
        if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
          const expectedValues = util.objectValues(nativeEnumValues);
          addIssueToContext(ctx, {
            expected: util.joinValues(expectedValues),
            received: ctx.parsedType,
            code: ZodIssueCode.invalid_type
          });
          return INVALID;
        }
        if (!this._cache) {
          this._cache = new Set(util.getValidEnumValues(this._def.values));
        }
        if (!this._cache.has(input.data)) {
          const expectedValues = util.objectValues(nativeEnumValues);
          addIssueToContext(ctx, {
            received: ctx.data,
            code: ZodIssueCode.invalid_enum_value,
            options: expectedValues
          });
          return INVALID;
        }
        return OK(input.data);
      }
      get enum() {
        return this._def.values;
      }
    };
    ZodNativeEnum.create = (values, params) => {
      return new ZodNativeEnum({
        values,
        typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
        ...processCreateParams(params)
      });
    };
    ZodPromise = class extends ZodType {
      unwrap() {
        return this._def.type;
      }
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.promise,
            received: ctx.parsedType
          });
          return INVALID;
        }
        const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
        return OK(promisified.then((data) => {
          return this._def.type.parseAsync(data, {
            path: ctx.path,
            errorMap: ctx.common.contextualErrorMap
          });
        }));
      }
    };
    ZodPromise.create = (schema, params) => {
      return new ZodPromise({
        type: schema,
        typeName: ZodFirstPartyTypeKind.ZodPromise,
        ...processCreateParams(params)
      });
    };
    ZodEffects = class extends ZodType {
      innerType() {
        return this._def.schema;
      }
      sourceType() {
        return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
      }
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const effect = this._def.effect || null;
        const checkCtx = {
          addIssue: (arg) => {
            addIssueToContext(ctx, arg);
            if (arg.fatal) {
              status.abort();
            } else {
              status.dirty();
            }
          },
          get path() {
            return ctx.path;
          }
        };
        checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
        if (effect.type === "preprocess") {
          const processed = effect.transform(ctx.data, checkCtx);
          if (ctx.common.async) {
            return Promise.resolve(processed).then(async (processed2) => {
              if (status.value === "aborted")
                return INVALID;
              const result = await this._def.schema._parseAsync({
                data: processed2,
                path: ctx.path,
                parent: ctx
              });
              if (result.status === "aborted")
                return INVALID;
              if (result.status === "dirty")
                return DIRTY(result.value);
              if (status.value === "dirty")
                return DIRTY(result.value);
              return result;
            });
          } else {
            if (status.value === "aborted")
              return INVALID;
            const result = this._def.schema._parseSync({
              data: processed,
              path: ctx.path,
              parent: ctx
            });
            if (result.status === "aborted")
              return INVALID;
            if (result.status === "dirty")
              return DIRTY(result.value);
            if (status.value === "dirty")
              return DIRTY(result.value);
            return result;
          }
        }
        if (effect.type === "refinement") {
          const executeRefinement = (acc) => {
            const result = effect.refinement(acc, checkCtx);
            if (ctx.common.async) {
              return Promise.resolve(result);
            }
            if (result instanceof Promise) {
              throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
            }
            return acc;
          };
          if (ctx.common.async === false) {
            const inner = this._def.schema._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (inner.status === "aborted")
              return INVALID;
            if (inner.status === "dirty")
              status.dirty();
            executeRefinement(inner.value);
            return { status: status.value, value: inner.value };
          } else {
            return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
              if (inner.status === "aborted")
                return INVALID;
              if (inner.status === "dirty")
                status.dirty();
              return executeRefinement(inner.value).then(() => {
                return { status: status.value, value: inner.value };
              });
            });
          }
        }
        if (effect.type === "transform") {
          if (ctx.common.async === false) {
            const base = this._def.schema._parseSync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (!isValid(base))
              return INVALID;
            const result = effect.transform(base.value, checkCtx);
            if (result instanceof Promise) {
              throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
            }
            return { status: status.value, value: result };
          } else {
            return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
              if (!isValid(base))
                return INVALID;
              return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
                status: status.value,
                value: result
              }));
            });
          }
        }
        util.assertNever(effect);
      }
    };
    ZodEffects.create = (schema, effect, params) => {
      return new ZodEffects({
        schema,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect,
        ...processCreateParams(params)
      });
    };
    ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
      return new ZodEffects({
        schema,
        effect: { type: "preprocess", transform: preprocess },
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        ...processCreateParams(params)
      });
    };
    ZodOptional = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.undefined) {
          return OK(void 0);
        }
        return this._def.innerType._parse(input);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodOptional.create = (type, params) => {
      return new ZodOptional({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodOptional,
        ...processCreateParams(params)
      });
    };
    ZodNullable = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.null) {
          return OK(null);
        }
        return this._def.innerType._parse(input);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodNullable.create = (type, params) => {
      return new ZodNullable({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodNullable,
        ...processCreateParams(params)
      });
    };
    ZodDefault = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        let data = ctx.data;
        if (ctx.parsedType === ZodParsedType.undefined) {
          data = this._def.defaultValue();
        }
        return this._def.innerType._parse({
          data,
          path: ctx.path,
          parent: ctx
        });
      }
      removeDefault() {
        return this._def.innerType;
      }
    };
    ZodDefault.create = (type, params) => {
      return new ZodDefault({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodDefault,
        defaultValue: typeof params.default === "function" ? params.default : () => params.default,
        ...processCreateParams(params)
      });
    };
    ZodCatch = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const newCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          }
        };
        const result = this._def.innerType._parse({
          data: newCtx.data,
          path: newCtx.path,
          parent: {
            ...newCtx
          }
        });
        if (isAsync(result)) {
          return result.then((result2) => {
            return {
              status: "valid",
              value: result2.status === "valid" ? result2.value : this._def.catchValue({
                get error() {
                  return new ZodError(newCtx.common.issues);
                },
                input: newCtx.data
              })
            };
          });
        } else {
          return {
            status: "valid",
            value: result.status === "valid" ? result.value : this._def.catchValue({
              get error() {
                return new ZodError(newCtx.common.issues);
              },
              input: newCtx.data
            })
          };
        }
      }
      removeCatch() {
        return this._def.innerType;
      }
    };
    ZodCatch.create = (type, params) => {
      return new ZodCatch({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodCatch,
        catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
        ...processCreateParams(params)
      });
    };
    ZodNaN = class extends ZodType {
      _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.nan) {
          const ctx = this._getOrReturnCtx(input);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.nan,
            received: ctx.parsedType
          });
          return INVALID;
        }
        return { status: "valid", value: input.data };
      }
    };
    ZodNaN.create = (params) => {
      return new ZodNaN({
        typeName: ZodFirstPartyTypeKind.ZodNaN,
        ...processCreateParams(params)
      });
    };
    BRAND = /* @__PURE__ */ Symbol("zod_brand");
    ZodBranded = class extends ZodType {
      _parse(input) {
        const { ctx } = this._processInputParams(input);
        const data = ctx.data;
        return this._def.type._parse({
          data,
          path: ctx.path,
          parent: ctx
        });
      }
      unwrap() {
        return this._def.type;
      }
    };
    ZodPipeline = class _ZodPipeline extends ZodType {
      _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.common.async) {
          const handleAsync = async () => {
            const inResult = await this._def.in._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: ctx
            });
            if (inResult.status === "aborted")
              return INVALID;
            if (inResult.status === "dirty") {
              status.dirty();
              return DIRTY(inResult.value);
            } else {
              return this._def.out._parseAsync({
                data: inResult.value,
                path: ctx.path,
                parent: ctx
              });
            }
          };
          return handleAsync();
        } else {
          const inResult = this._def.in._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inResult.status === "aborted")
            return INVALID;
          if (inResult.status === "dirty") {
            status.dirty();
            return {
              status: "dirty",
              value: inResult.value
            };
          } else {
            return this._def.out._parseSync({
              data: inResult.value,
              path: ctx.path,
              parent: ctx
            });
          }
        }
      }
      static create(a, b) {
        return new _ZodPipeline({
          in: a,
          out: b,
          typeName: ZodFirstPartyTypeKind.ZodPipeline
        });
      }
    };
    ZodReadonly = class extends ZodType {
      _parse(input) {
        const result = this._def.innerType._parse(input);
        const freeze = (data) => {
          if (isValid(data)) {
            data.value = Object.freeze(data.value);
          }
          return data;
        };
        return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
      }
      unwrap() {
        return this._def.innerType;
      }
    };
    ZodReadonly.create = (type, params) => {
      return new ZodReadonly({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodReadonly,
        ...processCreateParams(params)
      });
    };
    late = {
      object: ZodObject.lazycreate
    };
    (function(ZodFirstPartyTypeKind2) {
      ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
      ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
      ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
      ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
      ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
      ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
      ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
      ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
      ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
      ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
      ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
      ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
      ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
      ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
      ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
      ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
      ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
      ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
      ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
      ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
      ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
      ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
      ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
      ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
      ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
      ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
      ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
      ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
      ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
      ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
      ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
      ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
      ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
      ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
      ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
      ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
    })(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
    instanceOfType = (cls, params = {
      message: `Input not instance of ${cls.name}`
    }) => custom((data) => data instanceof cls, params);
    stringType = ZodString.create;
    numberType = ZodNumber.create;
    nanType = ZodNaN.create;
    bigIntType = ZodBigInt.create;
    booleanType = ZodBoolean.create;
    dateType = ZodDate.create;
    symbolType = ZodSymbol.create;
    undefinedType = ZodUndefined.create;
    nullType = ZodNull.create;
    anyType = ZodAny.create;
    unknownType = ZodUnknown.create;
    neverType = ZodNever.create;
    voidType = ZodVoid.create;
    arrayType = ZodArray.create;
    objectType = ZodObject.create;
    strictObjectType = ZodObject.strictCreate;
    unionType = ZodUnion.create;
    discriminatedUnionType = ZodDiscriminatedUnion.create;
    intersectionType = ZodIntersection.create;
    tupleType = ZodTuple.create;
    recordType = ZodRecord.create;
    mapType = ZodMap.create;
    setType = ZodSet.create;
    functionType = ZodFunction.create;
    lazyType = ZodLazy.create;
    literalType = ZodLiteral.create;
    enumType = ZodEnum.create;
    nativeEnumType = ZodNativeEnum.create;
    promiseType = ZodPromise.create;
    effectsType = ZodEffects.create;
    optionalType = ZodOptional.create;
    nullableType = ZodNullable.create;
    preprocessType = ZodEffects.createWithPreprocess;
    pipelineType = ZodPipeline.create;
    ostring = () => stringType().optional();
    onumber = () => numberType().optional();
    oboolean = () => booleanType().optional();
    coerce = {
      string: ((arg) => ZodString.create({ ...arg, coerce: true })),
      number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
      boolean: ((arg) => ZodBoolean.create({
        ...arg,
        coerce: true
      })),
      bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
      date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
    };
    NEVER = INVALID;
  }
});

// node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});
var init_external = __esm({
  "node_modules/zod/v3/external.js"() {
    init_errors();
    init_parseUtil();
    init_typeAliases();
    init_util();
    init_types();
    init_ZodError();
  }
});

// node_modules/zod/index.js
var init_zod = __esm({
  "node_modules/zod/index.js"() {
    init_external();
    init_external();
  }
});

// src/pace/schema.ts
var PaceSourceSchema, PaceEventTypeSchema, PaceEvidenceLevelSchema, PaceToolCategorySchema, PaceBlockerCategorySchema, PaceModelFamilySchema, PaceApprovalModeSchema, PacePermissionModeSchema, PaceDurationBucketSchema, PaceExitCodeBucketSchema, OptionalOpaqueId, LegacyAttributesSchema, LegacyEventBaseSchema, PaceEventV1Schema, PaceEventV2Schema, PaceEventV3Schema, PaceLegacyEventSchema, PaceEventSchema, PaceBatchSchema;
var init_schema = __esm({
  "src/pace/schema.ts"() {
    "use strict";
    init_zod();
    PaceSourceSchema = external_exports.enum([
      "codex",
      "claude_code",
      "cursor",
      "gemini_cli",
      "openrouter",
      "chatgpt",
      "claude_desktop",
      "claude_web",
      "gemini_web",
      "local_filesystem",
      "unknown"
    ]);
    PaceEventTypeSchema = external_exports.enum([
      "session.started",
      "session.ended",
      "model.completed",
      "tool.completed",
      "tool.failed",
      "workflow.stopped",
      "artifact.created",
      "artifact.modified",
      "desktop.activity",
      "unknown.observed"
    ]);
    PaceEvidenceLevelSchema = external_exports.enum(["exact", "correlated", "inferred"]);
    PaceToolCategorySchema = external_exports.enum([
      "file_read",
      "file_write",
      "code_search",
      "shell",
      "version_control",
      "web",
      "connector",
      "agent",
      "skill",
      "other",
      "unknown"
    ]);
    PaceBlockerCategorySchema = external_exports.enum([
      "authentication",
      "authorization_permission",
      "approval_required",
      "missing_dependency_tool",
      "configuration",
      "rate_limit_quota",
      "tool_failure",
      "model_provider_unavailable",
      "workflow_stopped",
      "unknown"
    ]);
    PaceModelFamilySchema = external_exports.enum([
      "openai_gpt",
      "anthropic_claude",
      "google_gemini",
      "meta_llama",
      "mistral",
      "other",
      "unknown"
    ]);
    PaceApprovalModeSchema = external_exports.enum(["none", "manual", "automatic", "unknown"]);
    PacePermissionModeSchema = external_exports.enum([
      "read_only",
      "workspace_write",
      "elevated",
      "unrestricted",
      "unknown"
    ]);
    PaceDurationBucketSchema = external_exports.enum([
      "under_1s",
      "1s_to_10s",
      "10s_to_60s",
      "1m_to_5m",
      "over_5m",
      "unknown"
    ]);
    PaceExitCodeBucketSchema = external_exports.enum(["success", "failure", "signal", "unknown"]);
    OptionalOpaqueId = external_exports.string().trim().regex(/^[A-Za-z0-9_-]{1,128}$/).optional();
    LegacyAttributesSchema = external_exports.object({
      hook_event: external_exports.string().max(128),
      approval_mode: external_exports.string().max(128).optional(),
      permission_mode: external_exports.string().max(128).optional(),
      status: external_exports.string().max(128).optional(),
      success: external_exports.boolean().optional(),
      exit_code: external_exports.number().int().optional(),
      duration_ms: external_exports.number().nonnegative().optional(),
      input_tokens: external_exports.number().int().nonnegative().optional(),
      output_tokens: external_exports.number().int().nonnegative().optional(),
      cached_tokens: external_exports.number().int().nonnegative().optional(),
      error_type: external_exports.string().max(128).optional(),
      stop_reason: external_exports.string().max(128).optional(),
      root_label: external_exports.string().max(128).optional(),
      path_fingerprint: external_exports.string().regex(/^[a-f0-9]{64}$/).optional(),
      file_extension: external_exports.string().max(32).optional(),
      file_name: external_exports.string().max(255).optional(),
      size_bytes: external_exports.number().int().nonnegative().optional(),
      files_changed: external_exports.number().int().nonnegative().optional(),
      local_signal: external_exports.enum(["approved_output", "app_state_change"]).optional(),
      source_app: external_exports.enum(["chatgpt", "claude_desktop", "other"]).optional()
    }).strict();
    LegacyEventBaseSchema = external_exports.object({
      event_id: external_exports.string().uuid(),
      installation_id: external_exports.string().uuid().optional(),
      occurred_at: external_exports.string().datetime(),
      source: PaceSourceSchema,
      event_type: PaceEventTypeSchema,
      evidence_level: PaceEvidenceLevelSchema,
      session_id: external_exports.string().trim().min(1).max(512).optional(),
      model: external_exports.string().trim().min(1).max(512).optional(),
      tool: external_exports.string().trim().min(1).max(512).optional(),
      skill: external_exports.string().trim().min(1).max(512).optional(),
      cwd: external_exports.string().trim().min(1).max(512).optional(),
      repository: external_exports.string().trim().min(1).max(512).optional(),
      branch: external_exports.string().trim().min(1).max(512).optional(),
      commit_sha: external_exports.string().regex(/^[a-f0-9]{7,64}$/i).optional(),
      artifact_type: external_exports.enum([
        "code",
        "pull_request",
        "document",
        "deck",
        "spreadsheet",
        "analysis",
        "workflow",
        "decision",
        "other"
      ]).optional(),
      attributes: LegacyAttributesSchema
    });
    PaceEventV1Schema = LegacyEventBaseSchema.extend({ schema_version: external_exports.literal(1) }).strict();
    PaceEventV2Schema = LegacyEventBaseSchema.extend({
      schema_version: external_exports.literal(2),
      workflow_id: external_exports.string().uuid().optional(),
      initiative_id: external_exports.string().trim().min(1).max(512).optional(),
      playbook_id: external_exports.string().trim().min(1).max(512).optional(),
      playbook_version: external_exports.string().trim().min(1).max(512).optional()
    }).strict();
    PaceEventV3Schema = external_exports.object({
      schema_version: external_exports.literal(3),
      collection_policy_version: external_exports.literal("metadata-v3"),
      event_id: external_exports.string().uuid(),
      installation_id: external_exports.string().uuid().optional(),
      occurred_at: external_exports.string().datetime(),
      source: PaceSourceSchema,
      event_type: PaceEventTypeSchema,
      evidence_level: PaceEvidenceLevelSchema,
      session_id: OptionalOpaqueId,
      workflow_id: external_exports.string().uuid().optional(),
      initiative_id: OptionalOpaqueId,
      playbook_id: OptionalOpaqueId,
      playbook_version: OptionalOpaqueId,
      repository_id: external_exports.string().uuid().optional(),
      commit_sha: external_exports.string().regex(/^[a-f0-9]{40}$/i).optional(),
      model_family: PaceModelFamilySchema.optional(),
      tool_category: PaceToolCategorySchema.optional(),
      blocker_category: PaceBlockerCategorySchema.optional(),
      artifact_type: external_exports.enum([
        "code",
        "pull_request",
        "document",
        "deck",
        "spreadsheet",
        "analysis",
        "workflow",
        "decision",
        "other"
      ]).optional(),
      attributes: external_exports.object({
        client_event: external_exports.enum([
          "session_start",
          "session_end",
          "before_agent",
          "after_agent",
          "stop",
          "tool_success",
          "tool_failure",
          "model_complete",
          "local_output",
          "local_activity",
          "unknown"
        ]),
        approval_mode: PaceApprovalModeSchema.optional(),
        permission_mode: PacePermissionModeSchema.optional(),
        success: external_exports.boolean().optional(),
        exit_code_bucket: PaceExitCodeBucketSchema.optional(),
        duration_bucket: PaceDurationBucketSchema.optional(),
        input_tokens: external_exports.number().int().nonnegative().optional(),
        output_tokens: external_exports.number().int().nonnegative().optional(),
        cached_tokens: external_exports.number().int().nonnegative().optional(),
        files_changed_bucket: external_exports.enum(["one", "two_to_five", "six_to_twenty", "over_twenty", "unknown"]).optional(),
        local_signal: external_exports.enum(["approved_output", "app_state_change"]).optional()
      }).strict()
    }).strict().superRefine((event, context) => {
      if (event.commit_sha && !event.repository_id) {
        context.addIssue({ code: external_exports.ZodIssueCode.custom, path: ["commit_sha"], message: "commit_sha requires an approved repository_id" });
      }
    });
    PaceLegacyEventSchema = external_exports.discriminatedUnion("schema_version", [PaceEventV1Schema, PaceEventV2Schema]);
    PaceEventSchema = PaceEventV3Schema;
    PaceBatchSchema = external_exports.object({ events: external_exports.array(PaceEventV3Schema).min(1).max(250) }).strict();
  }
});

// src/pace/identity.ts
import { createHash } from "node:crypto";
function deterministicWorkflowId(input) {
  const bytes = createHash("sha256").update(`${input.installationId}\0${input.source}\0${input.sessionId}`, "utf8").digest().subarray(0, 16);
  bytes[6] = bytes[6] & 15 | 80;
  bytes[8] = bytes[8] & 63 | 128;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
var init_identity = __esm({
  "src/pace/identity.ts"() {
    "use strict";
  }
});

// src/pace/repository.ts
var repository_exports = {};
__export(repository_exports, {
  approvedRepositoryId: () => approvedRepositoryId,
  canonicalRemote: () => canonicalRemote,
  parseRepositoryPolicy: () => parseRepositoryPolicy,
  readRepositoryPolicy: () => readRepositoryPolicy,
  repositoryPolicyPath: () => repositoryPolicyPath,
  repositoryRemoteFingerprint: () => repositoryRemoteFingerprint,
  resolveApprovedRepository: () => resolveApprovedRepository,
  sessionCommitShas: () => sessionCommitShas,
  surviving: () => surviving
});
import { createHash as createHash2 } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs2 from "node:fs";
import os2 from "node:os";
import path2 from "node:path";
function repositoryPolicyPath() {
  return process.env.UNFAIRLY_PACE_REPOSITORY_POLICY ?? path2.join(os2.homedir(), ".unfairly", "pace", "repository-policy.json");
}
function canonicalRemote(remote) {
  const match = /^(?:[a-z+]+:\/\/)?(?:[^@/\s]+@)?([^/:\s]+)(?::\d+)?[:/](.+?)(?:\.git)?\/?$/i.exec(remote.trim());
  return match ? `${match[1].toLowerCase()}/${match[2].toLowerCase()}` : null;
}
function repositoryRemoteFingerprint(remote) {
  return createHash2("sha256").update(canonicalRemote(remote) ?? remote.trim().toLowerCase()).digest("hex");
}
function git(cwd, args) {
  try {
    return execFileSync("git", ["-C", cwd, ...args], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 750
    }).trim() || void 0;
  } catch {
    return void 0;
  }
}
function parseRepositoryPolicy(value) {
  return policySchema.parse(value);
}
function readRepositoryPolicy() {
  return readPolicy();
}
function readPolicy() {
  try {
    return policySchema.parse(JSON.parse(fs2.readFileSync(repositoryPolicyPath(), "utf8")));
  } catch {
    return void 0;
  }
}
function surviving(cwd) {
  let current = cwd ? path2.resolve(cwd) : void 0;
  while (current && !fs2.existsSync(current)) {
    const parent = path2.dirname(current);
    if (parent === current) return void 0;
    current = parent;
  }
  return current && git(current, ["rev-parse", "--is-inside-work-tree"]) === "true" ? current : void 0;
}
function approvedRepositoryId(cwd, policy = readPolicy()) {
  const checkout = surviving(cwd);
  if (!checkout || !policy?.mappings.length) return void 0;
  const remote = git(checkout, ["config", "--get", "remote.origin.url"]);
  if (!remote) return void 0;
  return policy.mappings.find((candidate) => candidate.remote_fingerprint === repositoryRemoteFingerprint(remote))?.repository_id;
}
function sessionCommitShas(cwd, window) {
  const checkout = surviving(cwd);
  if (!checkout) return [];
  const author = git(checkout, ["config", "--get", "user.email"]);
  if (!author) return [];
  const worktreeAlive = path2.resolve(cwd) === checkout;
  let ref = worktreeAlive ? "HEAD" : void 0;
  if (window.branch && /^[\w./-]{1,200}$/.test(window.branch) && !window.branch.startsWith("-")) {
    for (const candidate of [`refs/heads/${window.branch}`, `refs/remotes/origin/${window.branch}`]) {
      if (git(checkout, ["rev-parse", "--verify", "--quiet", candidate])) {
        ref = candidate;
        break;
      }
    }
  }
  if (!ref) return [];
  const until = new Date(Date.parse(window.endedAt) + 5 * 6e4).toISOString();
  const output = git(checkout, ["log", ref, "--fixed-strings", `--author=${author}`, `--since=${window.startedAt}`, `--until=${until}`, "--format=%H", "-n", "50"]);
  return (output ?? "").split("\n").filter((sha) => /^[a-f0-9]{40}$/i.test(sha));
}
function resolveApprovedRepository(cwd) {
  const repositoryId = approvedRepositoryId(cwd);
  if (!cwd || !repositoryId) return void 0;
  const mapping = { repository_id: repositoryId };
  const commit = git(cwd, ["rev-parse", "HEAD"]);
  if (!commit || !/^[a-f0-9]{40}$/i.test(commit)) return void 0;
  return { repository_id: mapping.repository_id, commit_sha: commit };
}
var policySchema;
var init_repository = __esm({
  "src/pace/repository.ts"() {
    "use strict";
    init_zod();
    policySchema = external_exports.object({
      version: external_exports.literal(1),
      mappings: external_exports.array(external_exports.object({
        remote_fingerprint: external_exports.string().regex(/^[a-f0-9]{64}$/),
        repository_id: external_exports.string().uuid()
      }).strict()).max(500),
      /** Skills and playbooks the organization has published. Only these, plus published plugin skills, are reported by name. */
      skills: external_exports.array(external_exports.string().regex(/^[a-z0-9][a-z0-9:_.-]{0,119}$/)).max(2e3).optional()
    }).strict();
  }
});

// src/pace/local-sessions.ts
import fs5 from "node:fs/promises";
import { createReadStream } from "node:fs";
import os5 from "node:os";
import path5 from "node:path";
import readline from "node:readline";
function topKey(counts) {
  let best = null;
  for (const [key, value] of Object.entries(counts)) if (best === null || value > counts[best]) best = key;
  return best;
}
async function* jsonLines(file) {
  const lines = readline.createInterface({ input: createReadStream(file, { encoding: "utf8" }), crlfDelay: Infinity });
  for await (const line of lines) {
    if (!line) continue;
    try {
      const parsed = JSON.parse(line);
      if (parsed && typeof parsed === "object") yield parsed;
    } catch {
    }
  }
}
function asRecord(value) {
  return value && typeof value === "object" ? value : {};
}
function num(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}
async function readClaudeCodeSession(file) {
  const models = {};
  const branches = {};
  const skills = /* @__PURE__ */ new Set();
  const tokens = emptyTokens();
  const seenMessages = /* @__PURE__ */ new Set();
  let startedAt = null;
  let endedAt = null;
  let cwd = null;
  let sessionId = path5.basename(file, ".jsonl");
  let userTurns = 0;
  let toolCalls = 0;
  let toolErrors = 0;
  let approvalDenials = 0;
  const delegated = file.includes(`${path5.sep}subagents${path5.sep}`);
  for await (const line of jsonLines(file)) {
    const ts = typeof line.timestamp === "string" ? line.timestamp : null;
    if (ts) {
      startedAt ??= ts;
      endedAt = ts;
    }
    if (typeof line.sessionId === "string" && !delegated) sessionId = line.sessionId;
    if (typeof line.cwd === "string") cwd ??= line.cwd;
    if (typeof line.gitBranch === "string" && line.gitBranch && line.gitBranch !== "HEAD") branches[line.gitBranch] = (branches[line.gitBranch] ?? 0) + 1;
    const message = asRecord(line.message);
    if (line.type === "user") {
      const content = message.content;
      if (typeof content === "string") userTurns += 1;
      else if (Array.isArray(content)) {
        for (const block of content.map(asRecord)) {
          if (block.type === "text") userTurns += 1;
          if (block.type === "tool_result" && block.is_error === true) {
            toolErrors += 1;
            if (DENIAL.test(JSON.stringify(block.content ?? "").slice(0, 400))) approvalDenials += 1;
          }
        }
      }
    }
    if (line.type === "assistant") {
      const model = typeof message.model === "string" ? message.model : null;
      if (!model || model === "<synthetic>") continue;
      for (const block of Array.isArray(message.content) ? message.content.map(asRecord) : []) {
        if (block.type !== "tool_use") continue;
        toolCalls += 1;
        const input = asRecord(block.input);
        const name = typeof block.name === "string" ? block.name : "";
        const skill = name === "Skill" ? input.skill : RUN_SKILL_TOOL.test(name) ? input.name ?? input.skill ?? input.slug : void 0;
        if (typeof skill === "string" && skill.trim()) skills.add(skill.trim().toLowerCase().slice(0, 120));
      }
      const messageId = typeof message.id === "string" ? message.id : null;
      if (messageId && seenMessages.has(messageId)) continue;
      if (messageId) seenMessages.add(messageId);
      models[model] = (models[model] ?? 0) + 1;
      const usage = asRecord(message.usage);
      tokens.input += num(usage.input_tokens);
      tokens.output += num(usage.output_tokens);
      tokens.cacheRead += num(usage.cache_read_input_tokens);
      tokens.cacheWrite += num(usage.cache_creation_input_tokens);
    }
  }
  if (!startedAt || !endedAt || !Object.keys(models).length) return null;
  return {
    sessionId,
    client: "claude_code",
    delegated,
    launchedBy: null,
    startedAt,
    endedAt,
    models,
    primaryModel: topKey(models),
    tokens,
    userTurns,
    toolCalls,
    toolErrors,
    approvalDenials,
    cwd,
    branch: topKey(branches),
    skills: [...skills]
  };
}
async function readCodexSession(file) {
  const models = {};
  let tokens = emptyTokens();
  let startedAt = null;
  let endedAt = null;
  let cwd = null;
  let branch = null;
  let sessionId = path5.basename(file, ".jsonl");
  let delegated = false;
  let launchedBy = null;
  let userTurns = 0;
  let toolCalls = 0;
  let toolErrors = 0;
  const skills = /* @__PURE__ */ new Set();
  for await (const line of jsonLines(file)) {
    const ts = typeof line.timestamp === "string" ? line.timestamp : null;
    if (ts) {
      startedAt ??= ts;
      endedAt = ts;
    }
    const payload = asRecord(line.payload);
    if (line.type === "response_item" && payload.type === "function_call" && typeof payload.name === "string" && RUN_SKILL_TOOL.test(payload.name)) {
      try {
        const args = asRecord(JSON.parse(String(payload.arguments ?? "{}")));
        const skill = args.name ?? args.skill ?? args.slug;
        if (typeof skill === "string" && skill.trim()) skills.add(skill.trim().toLowerCase().slice(0, 120));
      } catch {
      }
    }
    if (line.type === "session_meta") {
      if (typeof payload.id === "string") sessionId = payload.id;
      if (typeof payload.cwd === "string") cwd = payload.cwd;
      const git2 = asRecord(payload.git);
      if (typeof git2.branch === "string" && git2.branch && git2.branch !== "HEAD") branch = git2.branch;
      if (payload.originator === "Claude Code") launchedBy = "claude_code";
      if (payload.source && typeof payload.source === "object") delegated = true;
    }
    if (line.type === "turn_context" && typeof payload.model === "string") models[payload.model] = (models[payload.model] ?? 0) + 1;
    if (line.type === "event_msg" && payload.type === "user_message") userTurns += 1;
    if (line.type === "event_msg" && payload.type === "token_count") {
      const total = asRecord(asRecord(payload.info).total_token_usage);
      if (Object.keys(total).length) {
        const cached = num(total.cached_input_tokens);
        tokens = { input: Math.max(0, num(total.input_tokens) - cached), output: num(total.output_tokens), cacheRead: cached, cacheWrite: num(total.cache_write_input_tokens) };
      }
    }
    if (line.type === "response_item" && (payload.type === "function_call" || payload.type === "custom_tool_call")) toolCalls += 1;
    if (line.type === "event_msg" && payload.type === "exec_command_end" && num(payload.exit_code) !== 0) toolErrors += 1;
  }
  if (!startedAt || !endedAt || !Object.keys(models).length) return null;
  return {
    sessionId,
    client: "codex",
    delegated: delegated || launchedBy !== null,
    launchedBy,
    startedAt,
    endedAt,
    models,
    primaryModel: topKey(models),
    tokens,
    userTurns,
    toolCalls,
    toolErrors,
    approvalDenials: 0,
    cwd,
    branch,
    skills: [...skills]
  };
}
async function listJsonl(root, maxDepth, since) {
  const found = [];
  const walk = async (dir2, depth) => {
    let entries;
    try {
      entries = await fs5.readdir(dir2, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path5.join(dir2, entry.name);
      if (entry.isDirectory() && depth < maxDepth) await walk(full, depth + 1);
      else if (entry.isFile() && entry.name.endsWith(".jsonl")) {
        const stat = await fs5.stat(full).catch(() => null);
        if (stat && stat.mtimeMs >= since) found.push(full);
      }
    }
  };
  await walk(root, 0);
  return found;
}
async function collectLocalSessions(options) {
  const home = options.home ?? os5.homedir();
  const since = options.since;
  const [claudeFiles, codexFiles] = await Promise.all([
    listJsonl(path5.join(home, ".claude", "projects"), 4, since),
    listJsonl(path5.join(home, ".codex", "sessions"), 4, since)
  ]);
  const results = await Promise.all([
    ...claudeFiles.map((file) => readClaudeCodeSession(file).catch(() => null)),
    ...codexFiles.map((file) => readCodexSession(file).catch(() => null))
  ]);
  return results.filter((item) => item !== null);
}
var RUN_SKILL_TOOL, emptyTokens, DENIAL;
var init_local_sessions = __esm({
  "src/pace/local-sessions.ts"() {
    "use strict";
    RUN_SKILL_TOOL = /^mcp__.+__(run_skill|get_playbook)$/;
    emptyTokens = () => ({ input: 0, output: 0, cacheRead: 0, cacheWrite: 0 });
    DENIAL = /doesn't want to proceed|user denied|permission denied|was rejected|not allowed/i;
  }
});

// src/pace/session-summary.ts
var session_summary_exports = {};
__export(session_summary_exports, {
  SessionSummaryUploadSchema: () => SessionSummaryUploadSchema,
  allowlistedModelId: () => allowlistedModelId,
  queueSessionSummaries: () => queueSessionSummaries,
  readSessionSpool: () => readSessionSpool,
  removeSessionSummaries: () => removeSessionSummaries,
  reportableSkills: () => reportableSkills,
  sessionSpoolPath: () => sessionSpoolPath,
  sweepLocalSessions: () => sweepLocalSessions,
  toSessionUpload: () => toSessionUpload
});
import fs6 from "node:fs/promises";
import os6 from "node:os";
import path6 from "node:path";
function readPolicySkills() {
  return readRepositoryPolicy()?.skills ?? [];
}
function reportableSkills(skills, orgCatalog = []) {
  const catalog = new Set(orgCatalog);
  const reportable = [...new Set(skills)].filter((skill) => SKILL_ID.test(skill) && (PUBLIC_SKILL.test(skill) || catalog.has(skill)));
  return { skills: reportable.slice(0, 20), unlisted: new Set(skills).size - reportable.length };
}
function allowlistedModelId(model) {
  if (!model) return null;
  const normalized = model.trim().toLowerCase();
  return MODEL_ID.test(normalized) ? normalized : null;
}
function toSessionUpload(session, context) {
  const repositoryId = approvedRepositoryId(session.cwd, context.policy) ?? null;
  const commits = repositoryId && session.cwd ? sessionCommitShas(session.cwd, session).map((sha) => sha.toLowerCase()) : [];
  const skillReport = reportableSkills(session.skills ?? [], context.policy?.skills ?? readPolicySkills());
  return SessionSummaryUploadSchema.parse({
    schema_version: 1,
    collection_policy_version: "metadata-v3",
    installation_id: context.installationId,
    session_id: session.sessionId.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 128) || "unknown",
    source: session.client,
    collected_via: context.collectedVia,
    started_at: new Date(session.startedAt).toISOString(),
    ended_at: new Date(session.endedAt).toISOString(),
    model_id: allowlistedModelId(session.primaryModel),
    tokens: { input: session.tokens.input, output: session.tokens.output, cache_read: session.tokens.cacheRead, cache_write: session.tokens.cacheWrite },
    user_turns: session.userTurns,
    tool_calls: session.toolCalls,
    tool_errors: session.toolErrors,
    approval_denials: session.approvalDenials,
    delegated: session.delegated,
    launched_by: session.launchedBy,
    repository_id: repositoryId,
    commit_shas: commits,
    skills: skillReport.skills,
    unlisted_skills: skillReport.unlisted
  });
}
function sessionSpoolPath() {
  return process.env.UNFAIRLY_PACE_SESSION_SPOOL ?? path6.join(os6.homedir(), ".unfairly", "pace", "sessions.json");
}
async function readSessionSpool() {
  try {
    const parsed = JSON.parse(await fs6.readFile(sessionSpoolPath(), "utf8"));
    const valid = {};
    for (const [key, value] of Object.entries(parsed)) {
      const summary = SessionSummaryUploadSchema.safeParse(value);
      if (summary.success) valid[key] = summary.data;
    }
    return valid;
  } catch {
    return {};
  }
}
async function writeSessionSpool(spool) {
  const file = sessionSpoolPath();
  await fs6.mkdir(path6.dirname(file), { recursive: true, mode: 448 });
  await fs6.writeFile(file, `${JSON.stringify(spool)}
`, { encoding: "utf8", mode: 384 });
}
async function queueSessionSummaries(summaries) {
  const spool = await readSessionSpool();
  for (const summary of summaries) spool[spoolKey(summary)] = summary;
  await writeSessionSpool(spool);
  return Object.keys(spool).length;
}
async function removeSessionSummaries(sent) {
  const spool = await readSessionSpool();
  for (const summary of sent) {
    const current = spool[spoolKey(summary)];
    if (current && current.ended_at === summary.ended_at) delete spool[spoolKey(summary)];
  }
  await writeSessionSpool(spool);
}
async function sweepLocalSessions(input) {
  const sessions = await collectLocalSessions({ since: input.since, home: input.home });
  const summaries = sessions.map((session) => toSessionUpload(session, input));
  const queued = summaries.length ? await queueSessionSummaries(summaries) : Object.keys(await readSessionSpool()).length;
  return { summarized: summaries.length, queued };
}
var MODEL_ID, Count, SKILL_ID, PUBLIC_SKILL, SessionSummaryUploadSchema, spoolKey;
var init_session_summary = __esm({
  "src/pace/session-summary.ts"() {
    "use strict";
    init_zod();
    init_local_sessions();
    init_repository();
    MODEL_ID = /^(claude-[a-z0-9.-]{1,48}|gpt-[a-z0-9.-]{1,32}|o[1-9][a-z0-9-]{0,20}|gemini-[a-z0-9.-]{1,40}|codex-[a-z0-9.-]{1,32})$/;
    Count = external_exports.number().int().nonnegative();
    SKILL_ID = /^[a-z0-9][a-z0-9:_.-]{0,119}$/;
    PUBLIC_SKILL = /^[a-z0-9][a-z0-9-]{0,40}:[a-z0-9][a-z0-9-]{0,78}$/;
    SessionSummaryUploadSchema = external_exports.object({
      schema_version: external_exports.literal(1),
      collection_policy_version: external_exports.literal("metadata-v3"),
      installation_id: external_exports.string().uuid(),
      session_id: external_exports.string().regex(/^[A-Za-z0-9_-]{1,128}$/),
      source: external_exports.enum(["claude_code", "codex"]),
      collected_via: external_exports.enum(["hook", "backfill"]),
      started_at: external_exports.string().datetime(),
      ended_at: external_exports.string().datetime(),
      model_id: external_exports.string().regex(MODEL_ID).nullable(),
      tokens: external_exports.object({ input: Count, output: Count, cache_read: Count, cache_write: Count }).strict(),
      user_turns: Count,
      tool_calls: Count,
      tool_errors: Count,
      approval_denials: Count,
      delegated: external_exports.boolean(),
      launched_by: external_exports.enum(["claude_code"]).nullable(),
      repository_id: external_exports.string().uuid().nullable(),
      commit_shas: external_exports.array(external_exports.string().regex(/^[a-f0-9]{40}$/)).max(50),
      skills: external_exports.array(external_exports.string().regex(SKILL_ID)).max(20),
      unlisted_skills: Count
    }).strict().superRefine((summary, context) => {
      if (summary.commit_shas.length && !summary.repository_id) {
        context.addIssue({ code: external_exports.ZodIssueCode.custom, path: ["commit_shas"], message: "commit_shas require an approved repository_id" });
      }
    });
    spoolKey = (summary) => `${summary.source}:${summary.session_id}`;
  }
});

// src/pace/enroll.ts
var enroll_exports = {};
__export(enroll_exports, {
  acquireApprovalLock: () => acquireApprovalLock,
  awaitApproval: () => awaitApproval,
  collectorAuthorization: () => collectorAuthorization,
  collectorCredentialPath: () => collectorCredentialPath,
  ensureEnrolled: () => ensureEnrolled,
  pollPendingEnrollment: () => pollPendingEnrollment,
  readCollectorCredential: () => readCollectorCredential,
  releaseApprovalLock: () => releaseApprovalLock,
  sessionStartOutput: () => sessionStartOutput
});
import fs7 from "node:fs/promises";
import os7 from "node:os";
import path7 from "node:path";
async function readJson(file, schema) {
  try {
    const parsed = schema.safeParse(JSON.parse(await fs7.readFile(file, "utf8")));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
async function writeJson(file, value) {
  await fs7.mkdir(path7.dirname(file), { recursive: true, mode: 448 });
  await fs7.writeFile(file, `${JSON.stringify(value)}
`, { encoding: "utf8", mode: 384 });
}
function collectorAuthorization(credential) {
  return `Collector ${credential.installation_id}.${credential.secret}`;
}
async function ensureEnrolled(input) {
  const existing = await readCollectorCredential();
  if (existing) return { status: "connected", orgId: existing.org_id };
  const call = input.fetchImpl ?? fetch;
  const now = input.now ?? /* @__PURE__ */ new Date();
  const polled = await pollPendingEnrollment({ apiUrl: input.apiUrl, fetchImpl: call, now });
  if (polled.status === "connected" || polled.status === "waiting") return polled;
  const clients = input.clients.filter((client) => ["codex", "claude_code", "cursor", "gemini_cli"].includes(client));
  const response = await call(`${input.apiUrl}/api/ai-pace/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ installation_id: input.installationId, platform: input.platform, arch: input.arch, clients, ...input.orgHint ? { org_hint: input.orgHint } : {} })
  });
  if (!response.ok) return { status: "unavailable" };
  const started = await response.json();
  await writeJson(pendingPath(), { device_code: started.device_code, user_code: started.user_code, verification_uri: started.verification_uri, expires_at: new Date(now.getTime() + started.expires_in * 1e3).toISOString() });
  return { status: "waiting", link: started.verification_uri, code: started.user_code };
}
async function pollPendingEnrollment(input) {
  const existing = await readCollectorCredential();
  if (existing) return { status: "connected", orgId: existing.org_id };
  const pending = await readJson(pendingPath(), PendingSchema);
  if (!pending || Date.parse(pending.expires_at) <= (input.now ?? /* @__PURE__ */ new Date()).getTime()) return { status: "none" };
  const call = input.fetchImpl ?? fetch;
  const response = await call(`${input.apiUrl}/api/ai-pace/enroll/poll`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ device_code: pending.device_code }) });
  const body = await response.json().catch(() => ({}));
  if (body.status === "approved" && body.installation_id && body.secret && body.org_id) {
    await writeJson(collectorCredentialPath(), CredentialSchema.parse({ installation_id: body.installation_id, secret: body.secret, org_id: body.org_id }));
    await fs7.unlink(pendingPath()).catch(() => void 0);
    return { status: "connected", orgId: body.org_id };
  }
  if (body.status === "pending") return { status: "waiting", link: pending.verification_uri, code: pending.user_code };
  return { status: "none" };
}
async function awaitApproval(input) {
  const clock = input.clock ?? Date.now;
  const sleep = input.sleep ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  const deadline = clock() + (input.deadlineMs ?? 16 * 6e4);
  while (clock() < deadline) {
    const state = await pollPendingEnrollment({ apiUrl: input.apiUrl, fetchImpl: input.fetchImpl, now: new Date(clock()) }).catch(() => ({ status: "waiting" }));
    if (state.status === "connected") return true;
    if (state.status === "none") return false;
    await sleep(input.intervalMs ?? 5e3);
  }
  return false;
}
async function acquireApprovalLock(now = Date.now()) {
  const file = approvalLockPath();
  try {
    const lock = JSON.parse(await fs7.readFile(file, "utf8"));
    const fresh = typeof lock.started_at === "number" && now - lock.started_at < 17 * 6e4;
    let alive = false;
    try {
      if (typeof lock.pid === "number") {
        process.kill(lock.pid, 0);
        alive = true;
      }
    } catch {
      alive = false;
    }
    if (fresh && alive) return false;
  } catch {
  }
  await writeJson(file, { pid: process.pid, started_at: now });
  return true;
}
function sessionStartOutput(state, hookEventName = "SessionStart") {
  if (state.status !== "waiting") return "";
  const message = `Connect Unfairly Intelligence to your team: open ${state.link} and approve code ${state.code}. It shares session metadata only, never prompts or code.`;
  return JSON.stringify({
    systemMessage: message,
    hookSpecificOutput: {
      hookEventName,
      additionalContext: `The Unfairly Intelligence plugin is installed but this machine is not connected yet. At a natural point, tell the user once: "${message}" Do not repeat it after they connect.`
    }
  });
}
var CredentialSchema, PendingSchema, dir, collectorCredentialPath, pendingPath, readCollectorCredential, approvalLockPath, releaseApprovalLock;
var init_enroll = __esm({
  "src/pace/enroll.ts"() {
    "use strict";
    init_zod();
    CredentialSchema = external_exports.object({ installation_id: external_exports.string().uuid(), secret: external_exports.string().regex(/^[A-Za-z0-9_-]{43}$/), org_id: external_exports.string().uuid() }).strict();
    PendingSchema = external_exports.object({ device_code: external_exports.string(), user_code: external_exports.string(), verification_uri: external_exports.string().url(), expires_at: external_exports.string() }).strict();
    dir = () => path7.join(os7.homedir(), ".unfairly", "pace");
    collectorCredentialPath = () => process.env.UNFAIRLY_PACE_COLLECTOR ?? path7.join(dir(), "collector.json");
    pendingPath = () => process.env.UNFAIRLY_PACE_ENROLLMENT ?? path7.join(dir(), "enrollment.json");
    readCollectorCredential = () => readJson(collectorCredentialPath(), CredentialSchema);
    approvalLockPath = () => path7.join(path7.dirname(pendingPath()), "approval-wait.json");
    releaseApprovalLock = () => fs7.unlink(approvalLockPath()).catch(() => void 0);
  }
});

// src/pace-runtime.ts
import { spawn } from "node:child_process";
import os8 from "node:os";

// src/sync/credentials.ts
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
var SERVICE = "unfairly";
var ACCOUNT = "default";
var FILE_FALLBACK = path.join(os.homedir(), ".unfairly", "credentials");
async function getToken() {
  try {
    const keytar = (await import("keytar")).default;
    const t = await keytar.getPassword(SERVICE, ACCOUNT);
    if (t) return t;
  } catch {
  }
  try {
    return (await fs.readFile(FILE_FALLBACK, "utf8")).trim();
  } catch {
    return null;
  }
}

// src/cmd/pace.ts
import fs8 from "node:fs/promises";
init_schema();
import path8 from "node:path";

// src/pace/normalize.ts
init_schema();
init_identity();
init_repository();
import { randomUUID } from "node:crypto";
var EVENT_TYPES = {
  SessionStart: "session.started",
  SessionEnd: "session.ended",
  BeforeAgent: "session.started",
  AfterAgent: "session.ended",
  Stop: "workflow.stopped",
  PostToolUse: "tool.completed",
  AfterTool: "tool.completed",
  PostToolUseFailure: "tool.failed",
  AfterModel: "model.completed",
  sessionStart: "session.started",
  sessionEnd: "session.ended",
  postToolUse: "tool.completed",
  postToolUseFailure: "tool.failed",
  stop: "workflow.stopped"
};
var CLIENT_EVENTS = {
  SessionStart: "session_start",
  SessionEnd: "session_end",
  BeforeAgent: "before_agent",
  AfterAgent: "after_agent",
  Stop: "stop",
  PostToolUse: "tool_success",
  AfterTool: "tool_success",
  PostToolUseFailure: "tool_failure",
  AfterModel: "model_complete",
  sessionStart: "session_start",
  sessionEnd: "session_end",
  postToolUse: "tool_success",
  postToolUseFailure: "tool_failure",
  stop: "stop"
};
function shortString(value) {
  if (typeof value !== "string") return void 0;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, 512) : void 0;
}
function firstString(payload, keys) {
  for (const key of keys) {
    const value = shortString(payload[key]);
    if (value) return value;
  }
  return void 0;
}
function opaqueId(value) {
  const candidate = shortString(value);
  return candidate && /^[A-Za-z0-9_-]{1,128}$/.test(candidate) ? candidate : void 0;
}
function number(payload, keys) {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
  }
  return void 0;
}
function boolean(payload, keys) {
  for (const key of keys) if (typeof payload[key] === "boolean") return payload[key];
  return void 0;
}
function modelFamily(value) {
  const model = value?.toLowerCase();
  if (!model) return void 0;
  if (/gpt|o[1-9]|codex/.test(model)) return "openai_gpt";
  if (/claude/.test(model)) return "anthropic_claude";
  if (/gemini|gemma/.test(model)) return "google_gemini";
  if (/llama/.test(model)) return "meta_llama";
  if (/mistral|mixtral|codestral/.test(model)) return "mistral";
  return "other";
}
function toolCategory(value) {
  const tool = value?.toLowerCase();
  if (!tool) return void 0;
  if (/skill/.test(tool)) return "skill";
  if (/read|view|open_file/.test(tool)) return "file_read";
  if (/write|edit|patch|notebook/.test(tool)) return "file_write";
  if (/grep|glob|search|find/.test(tool)) return "code_search";
  if (/git|github|pull_request|commit/.test(tool)) return "version_control";
  if (/bash|shell|terminal|exec|command/.test(tool)) return "shell";
  if (/web|browser|fetch|http/.test(tool)) return "web";
  if (/mcp|connector|slack|notion|drive|linear/.test(tool)) return "connector";
  if (/agent|task|delegate/.test(tool)) return "agent";
  return "other";
}
function blockerCategory(input) {
  const failed = ["PostToolUseFailure", "postToolUseFailure", "Stop", "stop"].includes(input.hookEvent) || input.payload.success === false;
  if (!failed) return void 0;
  const signal = [
    firstString(input.payload, ["error_type", "errorType"]),
    firstString(input.payload, ["stop_reason", "stopReason"]),
    firstString(input.payload, ["status"])
  ].filter(Boolean).join(" ").toLowerCase();
  if (/authenticat|login|credential|token expired/.test(signal)) return "authentication";
  if (/authoriz|permission|forbidden|denied|access/.test(signal)) return "authorization_permission";
  if (/approval|confirm|consent/.test(signal)) return "approval_required";
  if (/missing|not found|dependency|executable|command not found/.test(signal)) return "missing_dependency_tool";
  if (/config|setting|environment|invalid option/.test(signal)) return "configuration";
  if (/rate.?limit|quota|too many requests/.test(signal)) return "rate_limit_quota";
  if (/provider|model unavailable|overloaded|capacity/.test(signal)) return "model_provider_unavailable";
  if (input.hookEvent === "Stop" || input.hookEvent === "stop") return "workflow_stopped";
  if (input.hookEvent === "PostToolUseFailure" || input.hookEvent === "postToolUseFailure") return signal ? "tool_failure" : "unknown";
  return "unknown";
}
function approvalMode(value) {
  const mode = value?.toLowerCase();
  if (!mode) return void 0;
  if (/none|never|disabled/.test(mode)) return "none";
  if (/manual|ask|confirm|prompt/.test(mode)) return "manual";
  if (/auto|always|pre.?approved/.test(mode)) return "automatic";
  return "unknown";
}
function permissionMode(value) {
  const mode = value?.toLowerCase();
  if (!mode) return void 0;
  if (/read.?only|readonly/.test(mode)) return "read_only";
  if (/workspace|project.?write|write/.test(mode)) return "workspace_write";
  if (/elevated|escalat|admin|sudo/.test(mode)) return "elevated";
  if (/unrestricted|danger|full.?access/.test(mode)) return "unrestricted";
  return "unknown";
}
function durationBucket(durationMs) {
  if (durationMs === void 0) return void 0;
  if (durationMs < 1e3) return "under_1s";
  if (durationMs < 1e4) return "1s_to_10s";
  if (durationMs < 6e4) return "10s_to_60s";
  if (durationMs < 3e5) return "1m_to_5m";
  return "over_5m";
}
function exitCodeBucket(exitCode) {
  if (exitCode === void 0) return void 0;
  if (exitCode === 0) return "success";
  if (exitCode >= 128) return "signal";
  return "failure";
}
function normalizeHookEvent(input) {
  const source = PaceSourceSchema.catch("unknown").parse(input.source);
  const payload = input.payload && typeof input.payload === "object" && !Array.isArray(input.payload) ? input.payload : {};
  const sessionId = opaqueId(firstString(payload, ["session_id", "sessionId", "conversation_id"]));
  const suppliedWorkflowId = firstString(payload, ["workflow_id", "workflowId"]);
  const workflowId = suppliedWorkflowId && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(suppliedWorkflowId) ? suppliedWorkflowId : input.installationId && sessionId ? deterministicWorkflowId({ installationId: input.installationId, source, sessionId }) : void 0;
  const exitCode = number(payload, ["exit_code", "exitCode"]);
  const durationMs = number(payload, ["duration_ms", "durationMs"]);
  const repository = resolveApprovedRepository(firstString(payload, ["cwd", "workspace_path", "workspacePath"]));
  return PaceEventSchema.parse({
    schema_version: 3,
    collection_policy_version: "metadata-v3",
    event_id: randomUUID(),
    installation_id: input.installationId,
    workflow_id: workflowId,
    initiative_id: opaqueId(firstString(payload, ["initiative_id", "initiativeId"])),
    playbook_id: opaqueId(firstString(payload, ["playbook_id", "playbookId"])),
    playbook_version: opaqueId(firstString(payload, ["playbook_version", "playbookVersion"])),
    occurred_at: (input.now ?? /* @__PURE__ */ new Date()).toISOString(),
    source,
    event_type: EVENT_TYPES[input.hookEvent] ?? "unknown.observed",
    evidence_level: "exact",
    session_id: sessionId,
    repository_id: repository?.repository_id,
    commit_sha: repository?.commit_sha,
    model_family: modelFamily(firstString(payload, ["model", "model_name", "modelName"])),
    tool_category: toolCategory(firstString(payload, ["tool_name", "toolName", "tool"])),
    blocker_category: blockerCategory({ hookEvent: input.hookEvent, payload }),
    attributes: {
      client_event: CLIENT_EVENTS[input.hookEvent] ?? "unknown",
      approval_mode: approvalMode(firstString(payload, ["approval_mode", "approvalMode"])),
      permission_mode: permissionMode(firstString(payload, ["permission_mode", "permissionMode"])),
      success: boolean(payload, ["success"]),
      exit_code_bucket: exitCodeBucket(exitCode),
      duration_bucket: durationBucket(durationMs),
      input_tokens: number(payload, ["input_tokens", "inputTokens"]),
      output_tokens: number(payload, ["output_tokens", "outputTokens"]),
      cached_tokens: number(payload, ["cached_tokens", "cachedTokens"])
    }
  });
}
function migrateLegacyEvent(event) {
  const attributes = event.attributes;
  const hookEvent = attributes.hook_event;
  const migrated = PaceEventSchema.parse({
    schema_version: 3,
    collection_policy_version: "metadata-v3",
    event_id: event.event_id,
    installation_id: event.installation_id,
    occurred_at: event.occurred_at,
    source: event.source,
    event_type: event.event_type,
    evidence_level: event.evidence_level,
    session_id: opaqueId(event.session_id),
    workflow_id: event.schema_version === 2 ? event.workflow_id : void 0,
    initiative_id: event.schema_version === 2 ? opaqueId(event.initiative_id) : void 0,
    playbook_id: event.schema_version === 2 ? opaqueId(event.playbook_id) : void 0,
    playbook_version: event.schema_version === 2 ? opaqueId(event.playbook_version) : void 0,
    model_family: modelFamily(event.model),
    tool_category: toolCategory(event.tool ?? event.skill),
    blocker_category: blockerCategory({
      hookEvent,
      payload: {
        success: attributes.success,
        error_type: attributes.error_type,
        stop_reason: attributes.stop_reason,
        status: attributes.status
      }
    }),
    artifact_type: event.artifact_type,
    attributes: {
      client_event: event.source === "local_filesystem" ? "local_output" : event.event_type === "desktop.activity" ? "local_activity" : CLIENT_EVENTS[hookEvent] ?? "unknown",
      approval_mode: approvalMode(attributes.approval_mode),
      permission_mode: permissionMode(attributes.permission_mode),
      success: attributes.success,
      exit_code_bucket: exitCodeBucket(attributes.exit_code),
      duration_bucket: durationBucket(attributes.duration_ms),
      input_tokens: attributes.input_tokens,
      output_tokens: attributes.output_tokens,
      cached_tokens: attributes.cached_tokens,
      files_changed_bucket: filesChangedBucket(attributes.files_changed),
      local_signal: attributes.local_signal
    }
  });
  return migrated;
}
function filesChangedBucket(value) {
  if (value === void 0) return void 0;
  if (value <= 1) return "one";
  if (value <= 5) return "two_to_five";
  if (value <= 20) return "six_to_twenty";
  return "over_twenty";
}

// src/pace/spool.ts
import fs3 from "node:fs/promises";
import os3 from "node:os";
import path3 from "node:path";
init_schema();
function paceSpoolPath() {
  return process.env.UNFAIRLY_PACE_SPOOL ?? path3.join(os3.homedir(), ".unfairly", "pace", "events.jsonl");
}
async function appendPaceEvent(event) {
  const parsed = PaceEventSchema.parse(event);
  const spool = paceSpoolPath();
  await fs3.mkdir(path3.dirname(spool), { recursive: true, mode: 448 });
  await fs3.appendFile(spool, `${JSON.stringify(parsed)}
`, { encoding: "utf8", mode: 384 });
  await fs3.chmod(spool, 384).catch(() => void 0);
  return spool;
}
async function readPaceEvents(limit = 250) {
  let raw;
  try {
    raw = await fs3.readFile(paceSpoolPath(), "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  const events = [];
  let needsMigration = false;
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    let candidate;
    try {
      candidate = JSON.parse(line);
    } catch {
      needsMigration = true;
      continue;
    }
    const parsed = PaceEventSchema.safeParse(candidate);
    if (parsed.success) {
      events.push(parsed.data);
    } else {
      const legacy = PaceLegacyEventSchema.safeParse(candidate);
      if (legacy.success) events.push(migrateLegacyEvent(legacy.data));
      needsMigration = true;
    }
  }
  if (needsMigration) {
    const spool = paceSpoolPath();
    await fs3.writeFile(spool, events.length ? `${events.map((event) => JSON.stringify(event)).join("\n")}
` : "", {
      encoding: "utf8",
      mode: 384
    });
  }
  return events.slice(0, limit);
}
async function removePaceEvents(ids) {
  const spool = paceSpoolPath();
  let raw;
  try {
    raw = await fs3.readFile(spool, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }
  const remaining = raw.split("\n").filter((line) => {
    if (!line.trim()) return false;
    try {
      const event = JSON.parse(line);
      return !event.event_id || !ids.has(event.event_id);
    } catch {
      return true;
    }
  });
  await fs3.writeFile(spool, remaining.length ? `${remaining.join("\n")}
` : "", {
    encoding: "utf8",
    mode: 384
  });
}

// src/pace/device.ts
import { randomUUID as randomUUID2 } from "node:crypto";
init_zod();
import fs4 from "node:fs/promises";
import os4 from "node:os";
import path4 from "node:path";
var PaceClientIdSchema = external_exports.enum([
  "codex",
  "claude_code",
  "cursor",
  "claude_desktop",
  "gemini_cli",
  "openrouter",
  "chatgpt_desktop"
]);
var PaceClientCoverageSchema = external_exports.object({
  client: PaceClientIdSchema,
  installed: external_exports.boolean(),
  configured: external_exports.boolean(),
  version: external_exports.string().max(200).optional()
}).strict();
var IntelligenceInstallSchema = external_exports.object({
  version: external_exports.string().min(1).max(100),
  runtime_entrypoint: external_exports.string().min(1),
  marketplace_root: external_exports.string().min(1),
  owned_paths: external_exports.array(external_exports.string().min(1)).max(20),
  activated_clients: external_exports.array(PaceClientIdSchema).max(10),
  installed_at: external_exports.string().datetime()
}).strict();
var DeviceStateSchema = external_exports.object({
  installation_id: external_exports.string().uuid(),
  attestation: external_exports.string().min(1).optional(),
  attestation_expires_at: external_exports.string().datetime().optional(),
  paused: external_exports.boolean().optional(),
  last_upload_at: external_exports.string().datetime().optional(),
  last_session_sweep_at: external_exports.string().datetime().optional(),
  history_backfilled_at: external_exports.string().datetime().optional(),
  repository_policy_refreshed_at: external_exports.string().datetime().optional(),
  collection_policy_version: external_exports.literal("metadata-v3").optional(),
  managed_files: external_exports.array(external_exports.string().min(1)).max(20).optional(),
  intelligence_install: IntelligenceInstallSchema.optional()
}).strict();
function paceDevicePath() {
  return process.env.UNFAIRLY_PACE_DEVICE_STATE ?? path4.join(os4.homedir(), ".unfairly", "pace", "device.json");
}
async function readOrCreatePaceDevice() {
  const file = paceDevicePath();
  try {
    return DeviceStateSchema.parse(JSON.parse(await fs4.readFile(file, "utf8")));
  } catch (error) {
    if (error.code !== "ENOENT" && error instanceof SyntaxError) throw error;
  }
  const state = { installation_id: randomUUID2() };
  await writePaceDevice(state);
  return state;
}
async function writePaceDevice(state) {
  const parsed = DeviceStateSchema.parse(state);
  const file = paceDevicePath();
  await fs4.mkdir(path4.dirname(file), { recursive: true, mode: 448 });
  await fs4.writeFile(file, `${JSON.stringify(parsed, null, 2)}
`, { encoding: "utf8", mode: 384 });
  await fs4.chmod(file, 384).catch(() => void 0);
}

// src/cmd/pace.ts
var DEFAULT_API = "https://app.unfairly.ai";
async function readStdin() {
  if (process.stdin.isTTY) return {};
  let raw = "";
  for await (const chunk of process.stdin) raw += String(chunk);
  if (!raw.trim()) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
async function runPaceCapture(source, hookEvent) {
  const device = await readOrCreatePaceDevice();
  if (device.paused) return;
  const event = normalizeHookEvent({
    source,
    hookEvent,
    payload: await readStdin(),
    installationId: device.installation_id
  });
  await appendPaceEvent(event);
  const boundary = event.event_type === "session.started" || event.event_type === "session.ended" || event.event_type === "workflow.stopped";
  if (boundary) await runPaceSync({ flush: process.env.UNFAIRLY_PACE_NO_FLUSH !== "1" }).catch(() => void 0);
}
var SWEEP_OVERLAP_MS = 15 * 6e4;
var FIRST_SWEEP_LOOKBACK_MS = 2 * 864e5;
var HISTORY_BACKFILL_DAYS = 90;
async function runPaceSync(options = {}) {
  if (!await paceAuthorization()) return null;
  const device = await readOrCreatePaceDevice();
  const firstSync = !device.history_backfilled_at;
  await refreshRepositoryPolicy({ force: firstSync }).catch(() => null);
  const sweep = firstSync ? await runPaceSweep({ sinceMs: Date.now() - HISTORY_BACKFILL_DAYS * 864e5, collectedVia: "backfill" }) : await runPaceSweep();
  if (firstSync) await writePaceDevice({ ...await readOrCreatePaceDevice(), history_backfilled_at: (/* @__PURE__ */ new Date()).toISOString() });
  if (options.flush !== false) await runPaceFlush().catch(() => void 0);
  return { summarized: sweep.summarized, backfilled: firstSync };
}
async function runPaceSweep(options = {}) {
  const { sweepLocalSessions: sweepLocalSessions2 } = await Promise.resolve().then(() => (init_session_summary(), session_summary_exports));
  const device = await readOrCreatePaceDevice();
  const startedAt = Date.now();
  const last = device.last_session_sweep_at ? Date.parse(device.last_session_sweep_at) : startedAt - FIRST_SWEEP_LOOKBACK_MS;
  const result = await sweepLocalSessions2({
    since: options.sinceMs ?? last - SWEEP_OVERLAP_MS,
    installationId: device.installation_id,
    collectedVia: options.collectedVia ?? "hook"
  });
  await writePaceDevice({ ...await readOrCreatePaceDevice(), last_session_sweep_at: new Date(startedAt).toISOString() });
  return result;
}
async function paceAuthorization() {
  const { collectorAuthorization: collectorAuthorization2, readCollectorCredential: readCollectorCredential2 } = await Promise.resolve().then(() => (init_enroll(), enroll_exports));
  const credential = await readCollectorCredential2();
  if (credential) return collectorAuthorization2(credential);
  const token = await getToken();
  return token ? `Bearer ${token}` : null;
}
function apiBase() {
  return (process.env.UNFAIRLY_API_URL ?? DEFAULT_API).replace(/\/$/, "");
}
async function refreshRepositoryPolicy(options = {}) {
  const device = await readOrCreatePaceDevice();
  const fresh = device.repository_policy_refreshed_at && Date.now() - Date.parse(device.repository_policy_refreshed_at) < 36e5;
  if (fresh && !options.force) return null;
  const authorization = await paceAuthorization();
  if (!authorization) return null;
  const response = await fetch(`${apiBase()}/api/ai-pace/repository-policy`, { headers: { Authorization: authorization } });
  if (!response.ok) return null;
  const { parseRepositoryPolicy: parseRepositoryPolicy2, repositoryPolicyPath: repositoryPolicyPath2 } = await Promise.resolve().then(() => (init_repository(), repository_exports));
  const policy = parseRepositoryPolicy2(await response.json());
  const file = repositoryPolicyPath2();
  await fs8.mkdir(path8.dirname(file), { recursive: true, mode: 448 });
  await fs8.writeFile(file, `${JSON.stringify(policy, null, 2)}
`, { encoding: "utf8", mode: 384 });
  await writePaceDevice({ ...await readOrCreatePaceDevice(), repository_policy_refreshed_at: (/* @__PURE__ */ new Date()).toISOString() });
  return { repositories: policy.mappings.length };
}
async function uploadSessionSummaries(authorization) {
  const { readSessionSpool: readSessionSpool2, removeSessionSummaries: removeSessionSummaries2 } = await Promise.resolve().then(() => (init_session_summary(), session_summary_exports));
  let sent = 0;
  for (let round = 0; round < 50; round += 1) {
    const pending = Object.values(await readSessionSpool2()).slice(0, 100);
    if (!pending.length) break;
    const response = await fetch(`${apiBase()}/api/ai-pace/sessions`, {
      method: "POST",
      headers: { Authorization: authorization, "Content-Type": "application/json" },
      body: JSON.stringify({ sessions: pending })
    });
    if (!response.ok) throw new Error(`Unfairly Intelligence session upload failed (${response.status})`);
    await removeSessionSummaries2(pending);
    sent += pending.length;
  }
  return { sent, remaining: Object.keys(await readSessionSpool2()).length };
}
async function runPaceFlush() {
  const authorization = await paceAuthorization();
  if (!authorization) throw new Error("Unfairly Intelligence is not enrolled. Run `unfairly setup` first.");
  await refreshRepositoryPolicy().catch(() => null);
  const sessions = await uploadSessionSummaries(authorization);
  const events = await readPaceEvents();
  if (!events.length) return { sent: 0, remaining: 0, sessions_sent: sessions.sent };
  const apiUrl2 = (process.env.UNFAIRLY_API_URL ?? DEFAULT_API).replace(/\/$/, "");
  const device = await readOrCreatePaceDevice();
  const attributedEvents = events.map((event) => ({
    ...event,
    installation_id: event.installation_id ?? device.installation_id
  }));
  const response = await fetch(`${apiUrl2}/api/ai-pace/events`, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
      ...device.attestation ? { "X-AI-Pace-Attestation": device.attestation } : {}
    },
    body: JSON.stringify({ events: attributedEvents })
  });
  if (!response.ok) throw new Error(`Unfairly Intelligence upload failed (${response.status})`);
  await removePaceEvents(new Set(events.map((event) => event.event_id)));
  const remaining = (await readPaceEvents()).length;
  await writePaceDevice({ ...await readOrCreatePaceDevice(), last_upload_at: (/* @__PURE__ */ new Date()).toISOString(), collection_policy_version: "metadata-v3" });
  return { sent: events.length, remaining, sessions_sent: sessions.sent };
}

// src/pace-runtime.ts
init_enroll();
var DEFAULT_API2 = "https://app.unfairly.ai";
var apiUrl = () => (process.env.UNFAIRLY_API_URL ?? DEFAULT_API2).replace(/\/$/, "");
async function connect(source, event) {
  const device = await readOrCreatePaceDevice();
  if (device.paused) return;
  const platform = os8.platform();
  const arch = os8.arch();
  if (platform !== "darwin" && platform !== "linux" && platform !== "win32" || arch !== "x64" && arch !== "arm64") return;
  const state = await ensureEnrolled({
    apiUrl: apiUrl(),
    installationId: device.installation_id,
    platform,
    arch,
    // The calling client identifies itself; probing every installed tool is too slow for a session start.
    clients: [source],
    orgHint: process.env.UNFAIRLY_ORG
  });
  const output = sessionStartOutput(state, event === "sessionStart" ? "sessionStart" : "SessionStart");
  if (output) process.stdout.write(`${output}
`);
  if (state.status === "waiting") {
    const child = spawn(process.execPath, [process.argv[1], "await-approval"], { detached: true, stdio: "ignore", env: process.env });
    child.on("error", () => void 0);
    child.unref();
  }
}
async function awaitApprovalAndSync() {
  if (!await acquireApprovalLock()) return;
  try {
    if (await awaitApproval({ apiUrl: apiUrl() })) await runPaceSync();
  } finally {
    await releaseApprovalLock();
  }
}
async function main() {
  const [command, source = "unknown", event = "Unknown"] = process.argv.slice(2);
  if (command === "connect") await connect(source, event);
  else if (command === "await-approval") await awaitApprovalAndSync();
  else if (command === "capture") await runPaceCapture(source, event);
}
main().catch(() => void 0).finally(() => process.exit(0));
