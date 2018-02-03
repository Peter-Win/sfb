/**
 * Created by PeterWin on 03.02.2018.
 */
const fs = require('fs')
const path = require('path')
/**
 * Загрузка SSD
 * @param {string} ssdId	Описатель SSD, который используется в Counter.ssd
 * @return {Promise}	then(ssdJson:Object)
 */
const loadSsd = (ssdId) => {
	return new Promise((resolve, reject) => {
		const fullName = path.normalize(`${__dirname}/../ssd/${ssdId}.json`)
		console.log('loadSsd: ', fullName)
		fs.readFile(fullName, {encoding: 'utf8'}, (err, data) => {
			if (err) {
				reject(err)
			} else {
				try {
					resolve(JSON.parse(data))
				} catch (e) {
					reject(e)
				}
			}
		})
	})
}

module.exports = {loadSsd}
