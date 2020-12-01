const express = require('express');
const app = express();
const path = require('path');
app.use(express.json());
app.listen(3000);

const ejs = require('ejs');
app.set('view engine', 'ejs'); 

const unirest = require('unirest');
const fetch = require('node-fetch');

var date = require('unix-date');

app.get('/server/:server', async (req, res) => {
	
	let server = req.params.server
	const info = await unirest.get(`https://api.minehut.com/server/${server}?byName=true`)
	
	const lastOnline = date.parseDay(info.body.server.last_online)

	const plugins = [];
	unirest.get('https://api.minehut.com/plugins_public').then(o => {
    const all = o.body.all;
    const list = info.body.server.active_plugins;
    
    all.filter(x => list.includes(x._id)).forEach(x => plugins.push(x.name));
		console.log(plugins)
	})
	
	res.render('server', {data: info.body.server, date: lastOnline, plugins: plugins});

});


