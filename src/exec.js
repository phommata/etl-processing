const { exec } = require("child_process");

module.exports = {
    split: function(output_zip) {
        /*
        split files into 8Kb

          split -b 8K data/output.zip data/output.zip.
        */
        exec(`split -b 8K "${output_zip}" "${output_zip}."`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });

        console.log('split done')
    }
}