const archiver = require('archiver-promise')
const extract = require('extract-zip')
const fs = require("fs");
const path = require('node:path');

module.exports = {
    unzip: async(file_paths) => {
        unzip_file_paths = []

        for await (file_path of file_paths) {
            zip = file_path.endsWith('.zip')
            if (!zip) {
                continue
            }

            try {
                parsed_path = path.parse(file_path);
                name = parsed_path.name
                dir = parsed_path.dir
                unzip_dir = `${dir}/${name}`

                extract(file_path, { dir: `${dir}` })

                unzip_file_paths.push(unzip_dir)

                console.log('unzip complete')

                return unzip_file_paths
            } catch (err) {
                // handle any errors
                console.error(err)
            }
        }

        console.log('unzip done')
    },
    zip: async(gzip_file_path, output_dir) => {
        try {
            return new Promise((resolve, reject) => {
                parsed_path = path.parse(gzip_file_path);
                name = parsed_path.name
                dir = parsed_path.dir

                output_path = path.join(output_dir, name)
                output_zip = output_dir + '.zip'

                output = fs.createWriteStream(output_zip);
                archive = archiver(output_zip);

                output.on('close', () => {
                    console.log(archive.pointer() + ' total bytes');
                    console.log('archiver has been finalized and the output file descriptor has closed.');
                });

                archive.on('error', (err) => {
                    throw err;
                });

                archive.pipe(output);

                // append files from a sub-directory, putting its contents at the root of archive
                archive.directory(gzip_file_path, false);

                archive.finalize()
                    .then(() => {
                        console.log(`${archive.pointer()} total bytes`)

                        // Resolve with a status object.
                        resolve('zip done')
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        } catch (err) {
            // handle any errors
            console.error(err)
        }
    }
}