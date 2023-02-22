const fs = require('fs');
const { gunzip, gzip } = require('./compress/gz.js');
const { unzip, zip } = require('./compress/zip.js');
const { split } = require('./exec.js');
const { file_paths, read_dir } = require('./file_system.js');
const path = require('node:path');
const { transform_json } = require('./transform.js');

const DATA_DIR = __dirname + '/../data'
const GUNZIP_DIR = DATA_DIR + '/gunzip'
const TRANSFORM_DIR = DATA_DIR + '/transform'
const GZIP_DIR = DATA_DIR + '/gzip'
const OUTPUT_DIR = DATA_DIR + '/output'

async function process_etl() {
    try {
        // decompress: unzip, gunzip
        zip_filenames = await read_dir(DATA_DIR)
        zip_file_paths = await file_paths(DATA_DIR, zip_filenames)
        gunzip_file_paths = await unzip(zip_file_paths);

        for (gunzip_file_path of gunzip_file_paths) {
            gunzip_filenames = await read_dir(gunzip_file_path)
            gunzip_file_paths = await file_paths(gunzip_file_path, gunzip_filenames)
            json_file_paths = await gunzip(gunzip_file_paths, GUNZIP_DIR);
            await etl(json_file_paths, GZIP_DIR, TRANSFORM_DIR);
        }


        gzip_file_paths = await read_dir(GZIP_DIR)

        // compress all gz files
        await zip(GZIP_DIR, OUTPUT_DIR)

        await split(OUTPUT_DIR + '.zip')

        console.log('etl process done')

        /*
        combine all files and decompress them on CLI

          mkdir -p data/output-combine/
          cat data/output.zip.* > data/output-combine.zip/output-combine.zip
          unzip data/output-combine.zip -d data/output-combine
        */
    } catch (err) {
        console.error(err);
    }
}

async function etl(json_file_paths, gzip_dir, transform_dir) {
    // extract, transform, load, gzip

    console.log(json_file_paths)

    for (json_file_path of json_file_paths) {
        if (!json_file_path.endsWith(".json")) {
            continue
        }

        file_data = fs.readFileSync(json_file_path, { encoding: 'utf8' })

        console.log(file_data)

        json = await transform_json(file_data)

        console.log(json)

        basename = path.basename(json_file_path)
        transform_file_path = `${transform_dir}/${basename}`
        gzip_file_path = `${gzip_dir}/${basename}.gz`

        if (!fs.existsSync(transform_dir)) {
            fs.mkdirSync(transform_dir);
        }
        fs.writeFileSync(transform_file_path, json);

        if (!fs.existsSync(gzip_dir)) {
            fs.mkdirSync(gzip_dir);
        }
        await gzip(transform_file_path, gzip_file_path)
    }

    console.log('extract, transform, load done')
}

process_etl()