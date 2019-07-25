const axios = require('axios')
const fs = require('fs')
const config = require('./config.json')
const {repo, token} = config
const moment = require('moment');
moment.locale('zh-cn');

var log4js = require('log4js')
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'app.log', category: 'GithubPicBed' }
  ]
})
var log = log4js.getLogger('GithubPicBed')

/**
 * @param  {[String]} file {picture path}
 * @return {[String]} {picture pid}
 */
async function getImgUrl(file){
	if (repo.length == 0 || repo.length == 0)
		throw 'config error'
	try{
		let bitmap = fs.readFileSync(file)
		let base64Img = Buffer.from(bitmap).toString('base64')
		let timestamp = moment().format('YYYYMMDDHHmmss')+'.jpg'
		let imageUrl = 'https://api.github.com/repos/'+repo+'/contents/'+timestamp
		let body = {
			'branch': 'master',
			'message': 'upload image',
			'content': base64Img,
			'path': timestamp,
		}
		let upImgResp = await axios.put(imageUrl, body, {
			headers: {
				'Authorization':'token '+token,
				'Content-Type': 'application/json; charset=utf-8',
			}
		})
		imgUrl = upImgResp.data['content']['download_url']
		if (imgUrl) {
			log.info('success upload a pic to: '+imgUrl)
			return imgUrl
		} else {
			throw 'no img url '
		}
	}
	catch(e){
		log.error('upload failed with error: '+e)
		throw 'no img url '
	}
}

module.exports = getImgUrl