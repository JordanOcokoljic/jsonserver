const http = require("http");
const fs = require("fs");

const port = (() => {
    const defaultPort = 3001;

    if (process.env.PORT === undefined) {
        return defaultPort;
    }

    const num = Number(process.env.PORT);
    if (isNaN(num) || num % 1 !== 0) {
        return defaultPort;
    }

    return num;
})();

const cfgFile = (() => {
    let file;
    try {
        file = fs.readFileSync("config.json",  "utf-8");
    } catch (e) {
        const err = e.message;
        console.error(`an error occurred while reading config.json: ${err}`);
        process.exit(1);
    }

    return file;
})();

const config = (() => {
    let cfg;
    try {
        cfg = JSON.parse(cfgFile);
    } catch (e) {
        const err = e.message;
        console.error(`an error occurred while parsing config.json: ${err}`);
        process.exit(1);
    }

    return cfg;
})();

const server = http.createServer((req, res) => {
    if (req.method !== "GET") {
        console.log(`WARN: unsupported method: ${req.method}`);
        res.statusCode = 404;
        res.end();
        return;
    }

    const { url } = req;
    const response = config[url];
    const body = (() => {
        let content;
        try {
            content = JSON.stringify(response);
        } catch {
            return null;
        }

        return content;
    })();

    if (body === null) {
        res.statusCode = 500;
        res.end();
        return;
    }

    if (response === undefined) {
        console.log(`WARN: undefined path: ${url}`);
        res.statusCode = 404;
        res.end();
        return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.write(JSON.stringify(response));
    res.end();
});

server.listen(port, () => {
    console.log(`server listening on port ${port}`);
});