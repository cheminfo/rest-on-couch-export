'use strict';

const request = require('request-promise');
const path = require('path');
const fs = require('fs-extra');
const filenamify = require('filenamify');

const logger = require('./logger');

async function exportData(options) {
    const {
        url,
        email,
        token,
        out
    } = options;

    const type = email ? 'user' : 'all';

    const outDir = path.resolve(out);
    const jsonPath = path.join(outDir, 'roc-export.json');

    let json;
    try {
        const jsonData = await fs.readFile(jsonPath, 'utf8');
        json = JSON.parse(jsonData);
    } catch (e) {
        if (e.code === 'ENOENT') {
            json = {
                type,
                email,
                last: 0
            };
        } else {
            throw e;
        }
    }

    if (json.type !== type || (type === 'user' && json.email !== email)) {
        throw new Error('Cannot mix different exports in the same directory');
    }

    const entries = await req('/entry/_all', {
        qs: {
            owner: email,
            includeDocs: false,
            includeDate: true,
            from: json.last
        }
    });

    logger.info(`${entries.length} entries to export`);

    for (const {id: uuid, date} of entries) {
        logger.info(`exporting entry ${uuid}`);
        const entry = await req(`/entry/${uuid}`);

        let dataPath = uuid;
        if (entry.$id) {
            if (Array.isArray(entry.$id)) {
                dataPath = entry.$id.map(filenamify).join('/');
            } else {
                dataPath = filenamify(String(entry.$id));
            }
        }
        dataPath = path.join(outDir, entry.$owners[0], dataPath);

        // save raw JSON
        logger.debug('saving index.json');
        await fs.outputJson(path.join(dataPath, 'index.json'), entry, {spaces: 2});

        if (entry._attachments) {
            logger.debug('saving attachments');
            const attPath = path.join(dataPath, 'attachments');
            for (const attachment in entry._attachments) {
                logger.info(`downloading attachment ${attachment}`);
                const attachmentPath = path.join(attPath, attachment);
                const attachmentDir = path.parse(attachmentPath).dir;
                await fs.ensureDir(attachmentDir);
                await downloadFile(`/entry/${uuid}/${attachment}`, attachmentPath);
            }
        }

        json.last = date;
        await fs.outputJson(jsonPath, json, {spaces: 2});
    }

    function req(path, options) {
        options = Object.assign({json: true}, options);
        options.qs = Object.assign({token}, options.qs);
        return request(`${url}${path}`, options);
    }

    function downloadFile(urlPath, localPath) {
        return new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(localPath);
            writeStream.on('error', reject);
            writeStream.on('close', resolve);
            req(urlPath).pipe(writeStream);
        });
    }
}

module.exports = {
    exportData
};
