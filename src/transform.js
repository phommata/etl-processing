const url = require('url');
const { ValidationError } = require('jsonschema');
const Validator = require('jsonschema').Validator;

module.exports = {
    validate_json: async(json) => {
        // input
        var input_schema = {
            "id": "/input",
            "type": "object",
            "properties": {
                "ts": { "type": "integer" },
                "u": { "type": "string" },
                "e": { "type": "array" },
            },
            "required": ["ts", "u", "e"],
        };

        v = new Validator()

        valid = v.validate(json, input_schema)

        if (!valid) {
            throw new ValidationError('Invalid json: ' + JSON.stringify(json));
        }

        console.log('validated json')
    },
    transform_json: async(file_data) => {
        return new Promise((resolve, reject) => {
            try {
                json = JSON.parse(file_data)
                module.exports.validate_json(json)

                console.log("ts is:", json.ts); // => "timestamp"
                console.log("u is:", json.u); // => "url"
                console.log("e is:", json.e); // => "event"

                u = url.parse(json.u)

                console.log(u)

                const query_map = new Map(Object.entries(json.e));

                const output = {
                    timestamp: json.ts,
                    url_object: {
                        domain: u.host,
                        path: u.path,
                        query_object: query_map,
                        hash: u.hash,
                    },
                    ec: json.e,
                }

                console.log(output);
                console.log('tranformed json')

                resolve(JSON.stringify(output))
            } catch (err) {
                console.error(err)
                reject(err)
            }
        })
    },
}