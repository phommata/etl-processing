const fs = require('fs');
const path = require('node:path');
const zlib = require('zlib');

module.exports = {
    gunzip: async(input_file_paths, gunzip_dir) => {
        if (!fs.existsSync(gunzip_dir)) {
            fs.mkdirSync(gunzip_dir);
        }

        json_file_paths = [];
        for await (input_file_path of input_file_paths) {
            if (!input_file_path.endsWith('.gz')) {
                continue;
            }
            basename = path.basename(input_file_path);
            json_file_path = `${gunzip_dir}/${basename.slice(0, -3)}`;
            json_file_paths.push(json_file_path);
            fileContents = fs.readFileSync(input_file_path, 'utf8')
            fileContents = fs.createReadStream(`${input_file_path}`);
            writeStream = fs.createWriteStream(json_file_path);
            gunzip = zlib.createGunzip();
            fileContents.pipe(gunzip).pipe(writeStream);
        }
        console.log('gunzip done')

        return json_file_paths
    },
    gzip: async(transform_file_path, output_file_path) => {
        return new Promise((resolve, reject) => {
            try {
                fileContents = fs.createReadStream(transform_file_path);
                writeStream = fs.createWriteStream(output_file_path);
                gzip_file_path = zlib.createGzip();
                fileContents.pipe(gzip_file_path).pipe(writeStream)

                console.log('gzip done')

                resolve()
            } catch (err) {
                console.error(err)
                reject(err)
            }
        })
    }
}