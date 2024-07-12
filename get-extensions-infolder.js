const fs = require('fs');
const path = require('path');

function getExtensions(dirPath, extensions, callback) {
    fs.readdir(dirPath, { withFileTypes: true }, (err, entries) => {
        if (err) {
            return callback(err);
        }

        let count = entries.length;
        if (count === 0) {
            return callback(null);
        }

        entries.forEach((entry) => {
            let fullPath = path.join(dirPath, entry.name);
            if (entry.isDirectory()) {
                getExtensions(fullPath, extensions, (err) => {
                    if (err) {
                        return callback(err);
                    }
                    if (--count === 0) {
                        callback(null);
                    }
                });
            } else {
                let ext = path.extname(entry.name);
                if (ext && !extensions.includes(ext)) {
                    extensions.push(ext);
                }
                if (--count === 0) {
                    callback(null);
                }
            }
        });
    });
}

const extensions = [];

getExtensions('.', extensions, (err) => {
    if (err) {
        console.error('Error reading directories:', err);
        return;
    }
    console.log('Extensions found:', extensions);
});
