const net = require("net");

async function main() {
  const request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: 8000,

    headers: {
      "My-Header": "some value",
    },
    body: {
      name: "plus7wist",
    },
  });

  const response = await request.send();

  console.log("response:", response);
}

class Request {
  constructor(option) {
    this.method = option.method || "GET";
    this.host = option.host;
    this.port = option.port || 80;
    this.path = option.path || "/";
    this.body = option.body || {};

    this.headers = option.headers || {};

    let contentType = this.headers["Content-Type"];
    if (!contentType) {
      contentType = "application/x-www-form-urlencoded";
    }

    if (contentType === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    } else if (contentType === "application/x-www-form-urlencoded") {
      this.bodyText = xWwwFormUrlencoded(this.body);
    }

    this.headers["Content-Type"] = contentType;
    this.headers["Content-Length"] = this.bodyText.length;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();

      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port,
          },
          () => {
            connection.write(this.toString());
          }
        );
      }

      connection.on("data", (data) => {
        const dataString = data.toString();

        console.log("==== Response Begin ====");
        console.log(dataString);
        console.log("==== Response End ====");

        parser.receive(dataString);
        if (parser.isEnd) {
          resolve(parser.response);
          connection.end();
        }
      });

      connection.on("error", (error) => {
        reject(error);
        connection.end();
      });
    });
  }

  toString() {
    const lines = [`${this.method} ${this.path} HTTP/1.1`];
    for (const key of Object.keys(this.headers)) {
      lines.push(`${key}: ${this.headers[key]}`);
    }
    lines.push("");
    lines.push(this.bodyText);
    return lines.join("\r\n");
  }
}

function xWwwFormUrlencoded(body) {
  return Object.keys(body)
    .map((key) => xWwwFormUrlencodedKeyValue(key, body[key]))
    .join("&");
}

function xWwwFormUrlencodedKeyValue(key, value) {
  return `${key}=${encodeURIComponent(value)}`;
}

function makeIota() {
  let count = -1;
  return () => {
    count += 1;
    return count;
  };
}

// Create a parser:
//
//   const parser = ResponseParser()
//
// Receive a some data:
//
//   parser.receive(data: string)
//
// Is current message is a complete HTTP response:
//
//   parser.isEnd
//
// Get parserd HTTP response:
//
//   parser.response
//
class ResponseParser {
  constructor() {
    this.current = responseStateMachine(this);

    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";

    this.bodyParser = null;
    this.isEnd = false;
  }

  get body() {
    return this.bodyParser && this.bodyParser.getBody();
  }

  get response() {
    return {
      statusLine: this.statusLine,
      headers: this.headers,
      body: this.body,
    };
  }

  receive(string) {
    for (let i = 0; i < string.length; i++) {
      // console.log(this.current, string[i]);
      const next = this.current(string[i]);

      if (next === stateContinue) continue;

      // TODO return some error data when error happend.
      if (next === stateError) throw new Error("response parse error");

      if (next === stateEnd) {
        if (i != string.length - 1) throw new Error("more data after response");
        this.isEnd = true;
        return;
      }

      this.current = next;
    }
  }
}

const stateContinue = Symbol("stateContinue");
const stateError = Symbol("stateError");
const stateEnd = Symbol("stateEnd");

function responseStateMachine(parser) {
  const sContinue = stateContinue;

  const sError = (c) => sError;

  function sStatusLine(c) {
    if (c == "\r") return sStatusLineEnd;
    parser.statusLine += c;
    return sContinue;
  }

  function sStatusLineEnd(c) {
    if (c != "\n") return sError;
    return sHeaderName;
  }

  function sHeaderName(c) {
    if (c == ":") return sHeaderSpace;
    if (c == "\r") return sHeaderBlockEnd;
    parser.headerName += c;
    return sContinue;
  }

  function sHeaderSpace(c) {
    if (c != " ") return sError;
    return sHeaderValue;
  }

  function sHeaderValue(c) {
    if (c == "\r") return sHeaderEnd;
    parser.headerValue += c;
    return sContinue;
  }

  function sHeaderEnd(c) {
    if (c != "\n") return sError;

    parser.headers[parser.headerName] = parser.headerValue;
    parser.headerName = "";
    parser.headerValue = "";

    return sHeaderName;
  }

  function sHeaderBlockEnd(c) {
    if (c != "\n") return sError;

    if (parser.headers["Transfer-Encoding"] == "chunked") {
      this.bodyParser = new ChunkedBodyParser();

      // States of state machine of body parser is states of response parser.
      return bodyStateMachine(this.bodyParser);
    }

    return sError;
  }

  return sStatusLine;
}

class ChunkedBodyParser {
  constructor() {
    this.length = 0;
    this.chunk = [];
  }

  getBody() {
    return this.chunk.join("");
  }
}

function bodyStateMachine(p) {
  const sContinue = stateContinue;
  const sError = stateError;
  const sEnd = stateEnd;

  function sLength(c) {
    if (c == "\r") return sLengthEnd;
    p.length *= 16;
    p.length += parseInt(c, 16);
    return sContinue;
  }

  function sLengthEnd(c) {
    if (c != "\n") return sError;

    // End of all chunks.
    if (this.length == 0) return sChunkNewLine;

    // One new chunk.
    return sChunk;
  }

  // A chunk with non-zero size.
  function sChunk(c) {
    p.chunk.push(c);
    p.length -= 1;

    if (p.length == 0) return sChunkNewLine;
    return sContinue;
  }

  function sChunkNewLine(c) {
    return c == "\r" ? sChunkEnd : sError;
  }

  function sChunkEnd(c) {
    if (c != "\n") return sError;

    // When length is 0, the end of current chunk is the end of all chunks, and
    // the end of HTTP response.
    if (this.length == 0) return sEnd;

    // A new line contains the length of a new chunk.
    this.length = 0;
    return sLength;
  }

  return sLength;
}

main();
