const fs = require('fs');
const path = require('path');

module.exports = {
    read_dir: async(dir) => {
        // read dir

        return new Promise((resolve, reject) => {
            fs.readdir(dir, (err, filenames) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(
                        filenames
                    )
                }
            })

            console.log('read dir done')
        })
    },
    file_paths: async(dir, filenames) => {
        file_paths = []

        for await (filename of filenames) {
            file_path = path.join(dir, filename)
            file_paths.push(file_path)
        }

        return file_paths
    }
}