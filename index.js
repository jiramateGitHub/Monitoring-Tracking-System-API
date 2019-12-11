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
 let sql = 'SELECT ps_id,pf_name,ps_fname,ps_lname,CONCAT(pf_name,ps_fname," ",ps_lname) as name FROM hr_person as per LEFT JOIN hr_prefix as pre ON per.ps_pf_id = pre.pf_id' 
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

app.get('/process/:pcs_pcsg_id', (req, res) => {
 let sql = 'SELECT * '+
			'FROM mts_process '+
			'INNER JOIN mts_process_group '+
			'ON pcs_pcsg_id = pcsg_id '+
			'INNER JOIN mts_case_manager '+
			'ON cmgr_pcs_id = pcs_id '+
			'INNER JOIN hr_person '+
			'ON cmgr_ps_id = ps_id '+
			'WHERE pcs_active = "Y" '+
			'AND pcs_pcsg_id = ' + req.params.pcs_pcsg_id + ";";
    let query = db.query(sql,(err,results) => { 
       if(err) throw err  
       res.json(results)   
    })
})

app.post('/process', (req, res) => {
    let sql = "INSERT INTO mts_process(" + 
                "pcs_code," +
                "pcs_th," + 
                "pcs_en," + 
                "pcs_pcsg_id," +
                "pcs_year_type," + 
                "pcs_year," + 
                "pcs_seq," + 
                "pcs_enforce," + 
                "pcs_skip," + 
                "pcs_free," + 
                "pcs_active," + 
                "pcs_editor" + 
            ") VALUES('" +
                req.body.pcs_code + "','" +
                req.body.pcs_th + "','" +
                req.body.pcs_en + "','" +
                req.body.pcs_pcsg_id + "','" +
                req.body.pcs_year_type + "','" +
                req.body.pcs_year + "','" +
                req.body.pcs_seq + "','" +
                req.body.pcs_enforce + "','" +
                req.body.pcs_skip + "','" +
                req.body.pcs_free + "','" +
                req.body.pcs_active + "','" +
                req.body.pcs_editor + "'"+
            ");"
    let query = db.query(sql,(err,result) => {
        if(err) throw err
        res.json(result)
    })
})

app.post('/case_manager', (req, res) => {
    let sql = "INSERT INTO mts_case_manager(" + 
                "cmgr_pcs_id," +
                "cmgr_ps_id," + 
                "cmgr_active," + 
                "cmgr_editor" +
            ") VALUES('" +
                req.body.cmgr_pcs_id + "','" +
                req.body.cmgr_ps_id + "','" +
                req.body.cmgr_active + "','" +
                req.body.cmgr_editor + "'" +
            ");"
    let query = db.query(sql,(err,result) => {
        if(err) throw err
        res.json(result)
    })
})

app.put('/process_active_update/:id', (req, res) => {
    let sql = "UPDATE mts_process SET pcs_active = '"+ req.body.pcs_active + "',"+
							"pcs_editor = '"+ req.body.pcs_editor + "' "+
							"WHERE pcs_id = "+ req.params.id + ";"

    let query = db.query(sql,(err,result) => {
        if(err) throw err	
        res.json(result)
    })
})

app.put('/process/:id', (req, res) => {
    let sql = "UPDATE mts_process SET pcs_code = '"+ req.body.pcs_code + "',"+
							"pcs_th = '"+ req.body.pcs_th + "',"+
							"pcs_en = '"+ req.body.pcs_en + "',"+
							"pcs_pcsg_id = '"+ req.body.pcs_pcsg_id + "',"+
							"pcs_year_type = '"+ req.body.pcs_year_type + "',"+
							"pcs_year = '"+ req.body.pcs_year + "',"+
							"pcs_seq = '"+ req.body.pcs_seq + "',"+
							"pcs_enforce = '"+ req.body.pcs_enforce + "',"+
							"pcs_skip = '"+ req.body.pcs_skip + "',"+
							"pcs_free = '"+ req.body.pcs_free + "',"+
							"pcs_active = '"+ req.body.pcs_active + "',"+
							"pcs_editor = '"+ req.body.pcs_editor + "' "+
							"WHERE pcs_id = "+ req.params.id + ";"

    let query = db.query(sql,(err,result) => {
        if(err) throw err	
        res.json(result)
    })
})

app.put('/case_manager/:id', (req, res) => {
    let sql = "UPDATE mts_case_manager SET cmgr_pcs_id = '"+ req.body.cmgr_pcs_id + "',"+
							"cmgr_ps_id = '"+ req.body.cmgr_ps_id + "' "+
							"WHERE cmgr_pcs_id = "+ req.params.id + ";"

    let query = db.query(sql,(err,result) => {
        if(err) throw err	
        res.json(result)
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
app.get('/procedure_state/:pcds_pcd_id', (req, res) => {
 let sql = 'SELECT * '+
			'FROM mts_procedure_state '+
			'INNER JOIN mts_state '+
			'ON pcds_st_id = st_id '+
			'WHERE pcds_active = "Y" '+
			'AND pcds_pcd_id = ' + req.params.pcds_pcd_id + ";";
    let query = db.query(sql,(err,results) => { 
       if(err) throw err  
       res.json(results)   
    })
})

app.get('/case/:case_pcs_id', (req, res) => {
 let sql = 'SELECT * '+
			'FROM mts_case '+
			'INNER JOIN mts_task_manager '+
			'ON case_id = tmgr_cpcd_id '+
			'INNER JOIN hr_person '+
			'ON tmgr_ps_id = ps_id '+
			'WHERE case_active = "Y" '+
			'AND case_pcs_id = ' + req.params.case_pcs_id + ' ' +
			'GROUP BY case_id '+";";
	console.log(sql)
    let query = db.query(sql,(err,results) => { 
       if(err) throw err  
       res.json(results)   
    })
})

app.post('/case', (req, res) => {
    let sql = "INSERT INTO mts_case (" + 
                "case_pcs_id," +
                "case_code," +
                "case_th," + 
                "case_en," + 
                "case_seq," + 
                "case_percentage," + 
                "case_active," +
                "case_editor" + 
            ") VALUES('" +
                req.body.case_pcs_id + "','" +
                req.body.case_code + "','" +
                req.body.case_th + "','" +
                req.body.case_en + "','" +
                req.body.case_seq + "','" +
                req.body.case_percentage + "','" +
                req.body.case_active + "','" +
                req.body.case_editor + "'"+
            ");"
    let query = db.query(sql,(err,result) => {
        if(err) throw err
        res.json(result)
    })
})

app.put('/case/:id', (req, res) => {
    let sql = "UPDATE mts_case SET case_code = '"+ req.body.case_code + "',"+
							"case_th = '"+ req.body.case_th + "',"+
							"case_en = '"+ req.body.case_en + "',"+
							"case_active = '"+ req.body.case_active + "',"+
							"case_editor = '"+ req.body.case_editor + "' "+
							"WHERE pcs_id = "+ req.params.id + ";"

    let query = db.query(sql,(err,result) => {
        if(err) throw err	
        res.json(result)
    })
})

app.post('/case_procedure', (req, res) => {
    let sql = "INSERT INTO mts_case_procedure(" + 
                "cpcd_case_id," +
                "cpcd_pcd_id," + 
                "cpcd_seq," + 
                "cpcd_th," +
                "cpcd_en," + 
                "cpcd_abbr," + 
                "cpcd_ratio," + 
                "cpcd_skip," + 
                "cpcd_active," + 
                "cpcd_editor" + 
            ") VALUES('" +
                req.body.cpcd_case_id + "','" +
                req.body.cpcd_pcd_id + "','" +
                req.body.cpcd_seq + "','" +
                req.body.cpcd_th + "','" +
                req.body.cpcd_en + "','" +
                req.body.cpcd_abbr + "','" +
                req.body.cpcd_ratio + "','" +
                req.body.cpcd_skip + "','" +
                req.body.cpcd_active + "','" +
                req.body.cpcd_editor + "'"+
            ");"
    let query = db.query(sql,(err,result) => {
        if(err) throw err
        res.json(result)
    })
})

app.post('/task_manager', (req, res) => {
    let sql = "INSERT INTO mts_task_manager(" + 
                "tmgr_cpcd_id," +
                "tmgr_ps_id," + 
                "tmgr_active," + 
                "tmgr_editor" +
            ") VALUES('" +
                req.body.tmgr_cpcd_id + "','" +
                req.body.tmgr_ps_id + "','" +
                req.body.tmgr_active + "','" +
                req.body.tmgr_editor + "'" +
            ");"
    let query = db.query(sql,(err,result) => {
        if(err) throw err
        res.json(result)
    })
})

app.put('/task_manager/:id', (req, res) => {
    let sql = "UPDATE mts_task_manager SET tmgr_cpcd_id = '"+ req.body.tmgr_cpcd_id + "',"+
							"tmgr_ps_id = '"+ req.body.tmgr_ps_id + "' "+
							"WHERE tmgr_cpcd_id = "+ req.params.id + ";"

    let query = db.query(sql,(err,result) => {
        if(err) throw err	
        res.json(result)
    })
})

app.get('/case_procedure/:case_id', (req, res) => {
 let sql = 'SELECT * '+
			'FROM mts_case '+
			'INNER JOIN mts_process '+
			'ON pcs_id = case_pcs_id '+
			'INNER JOIN mts_procedure '+
			'ON pcs_id = pcd_pcs_id '+
			'WHERE case_id = ' + req.params.case_id + ';'
	console.log(sql)
    let query = db.query(sql,(err,results) => { 
       if(err) throw err  
       res.json(results)   
    })
})



app.listen(3000, () => {
 console.log('Start server at port 3000.')
})
