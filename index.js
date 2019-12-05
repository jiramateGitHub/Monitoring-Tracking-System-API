require('dotenv').config()
const express = require('express')
const app = express()
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials','true')
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

var mysql = require('mysql');
var db = mysql.createConnection({
  host: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE
});
db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/hr_person', (req, res) => {
 let sql = 'SELECT ps_id,pf_name,ps_fname,ps_lname FROM hr_person as per LEFT JOIN hr_prefix as pre ON per.ps_pf_id = pre.pf_id' 
    let query = db.query(sql,(err,results) => { 
       if(err) throw err  
       res.json(results)   
    })
})

app.get('/process_group', (req, res) => {
 let sql = 'SELECT pcsg_id,ps_id,ps_fname,ps_lname,pcsg_th,pcsg_en,pcsg_code '+
			'FROM mts_process_manager '+
			'INNER JOIN hr_person '+
			'ON pcsm_ps_id = ps_id '+
			'INNER JOIN mts_process_group '+
			'ON pcsm_pcsg_id = pcsg_id '+
			'WHERE pcsg_active = "Y" '+
			'ORDER BY pcsm_last_update DESC ' 
    let query = db.query(sql,(err,results) => { 
       if(err) throw err  
       res.json(results)   
    })
})
   
app.post('/process_group', (req, res) => {
    let sql = "INSERT INTO mts_process_group(" + 
                "pcsg_code," +
                "pcsg_th," + 
                "pcsg_en," + 
                "pcsg_active," +
                "pcsg_editor" + 
            ") VALUES('" +
                req.body.pcsg_code + "','" +
                req.body.pcsg_th + "','" +
                req.body.pcsg_en + "','" +
                req.body.pcsg_active + "','" +
                req.body.pcsg_editor + "'"+
            ");"
    let query = db.query(sql,(err,result) => {
        if(err) throw err
        res.json(result)
    })
})

app.post('/process_manager', (req, res) => {
    let sql = "INSERT INTO mts_process_manager(" + 
                "pcsm_pcsg_id," +
                "pcsm_ps_id," + 
                "pcsm_active," + 
                "pcsm_editor" +
            ") VALUES('" +
                req.body.pcsm_pcsg_id + "','" +
                req.body.pcsm_ps_id + "','" +
                req.body.pcsm_active + "','" +
                req.body.pcsm_editor + "'" +
            ");"
    let query = db.query(sql,(err,result) => {
        if(err) throw err
        res.json(result)
    })
})

app.put('/process_group_active_update/:id', (req, res) => {
    let sql = "UPDATE mts_process_group SET pcsg_active = '"+ req.body.pcsg_active + "',"+
							"pcsg_editor = '"+ req.body.pcsg_editor + "' "+
							"WHERE pcsg_id = "+ req.params.id + ";"

    let query = db.query(sql,(err,result) => {
        if(err) throw err	
        res.json(result)
    })
})

app.put('/process_group/:id', (req, res) => {
    let sql = "UPDATE mts_process_group SET pcsg_code = '"+ req.body.pcsg_code + "',"+
							"pcsg_th = '"+ req.body.pcsg_th + "',"+
							"pcsg_en = '"+ req.body.pcsg_en + "',"+
							"pcsg_editor = '"+ req.body.pcsg_editor + "' "+
							"WHERE pcsg_id = "+ req.params.id + ";"

    let query = db.query(sql,(err,result) => {
        if(err) throw err	
        res.json(result)
    })
})

app.put('/process_manager/:id', (req, res) => {
    let sql = "UPDATE mts_process_manager SET pcsm_pcsg_id = '"+ req.body.pcsm_pcsg_id + "',"+
							"pcsm_ps_id = '"+ req.body.pcsm_ps_id + "' "+
							"WHERE pcsm_pcsg_id = "+ req.params.id + ";"

    let query = db.query(sql,(err,result) => {
        if(err) throw err	
        res.json(result)
    })
})

app.get('/process', (req, res) => {
 let sql = 'SELECT * '+
			'FROM mts_process '+
			'INNER JOIN mts_process_group '+
			'ON pcs_pcsg_id = pcsg_id '+
			'WHERE pcs_active = "Y" '+
			'AND pcs_pcsg_id = ' + req.body.pcsg_id + ";";
    let query = db.query(sql,(err,results) => { 
       if(err) throw err  
       res.json(results)   
    })
})

app.get('/procedure/:pcs_id', (req, res) => {
 let sql = 'SELECT * '+
			'FROM mts_procedure '+
			'INNER JOIN mts_process '+
			'ON pcd_pcs_id = pcs_id '+
			'WHERE pcd_active = "Y" '+
			'AND pcs_id = ' + req.params.pcs_id + ";";
    let query = db.query(sql,(err,results) => { 
       if(err) throw err  
       res.json(results)   
    })
})

app.listen(3000, () => {
 console.log('Start server at port 3000.')
})
