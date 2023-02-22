const expect = require('chai').expect
const { transform_json } = require('../src/transform.js')

describe('etl', () => {
    it('etl should correctly transform json', function(done) {
        const result = transform_json(
            JSON.stringify({
                "ts": 1669976028340,
                "u": "https://www.example.org/ho/ez#w;#n?r?h",
                "e": [{
                    "et": "dl",
                    "n": "digitalData",
                    "u": {
                        "page_name": "store",
                        "store_id": 153
                    }
                }]
            })
        )
        console.log(result)
        expect(result).to.equal(
            JSON.stringify({
                "timestamp": 1669976028340,
                "url_object": {
                    "domain": "www.example.org",
                    "path": "/ho/ez",
                    "query_object": {

                    },
                    "hash": "#w;#n?r?h"
                },
                "ec": [{
                    "et": "dl",
                    "n": "digitalData",
                    "u": {
                        "page_name": "store",
                        "store_id": 153
                    }
                }]
            })
        )
        done()
    })
})