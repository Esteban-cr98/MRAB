const { query } = require('express');
const dbconnection = require('../config/dbConnection');

module.exports = app =>{
    const connection = dbconnection();

    //----------------------- Tablas -----------------------------------------------------------------
    app.get('/', (req, res) => {
        connection.query('SELECT * FROM Servicio', (err, result) =>{
            res.render('services/services', { servicios: result});
        });
    });

    app.get('/apps', (req, res) => {
        var aplicaciones;
        var rela;
        var relobj;
        connection.query('SELECT * FROM Aplicacion', (err,result) =>{
            aplicaciones = result;
            connection.query('SELECT * FROM Nivel_Aplicacion', (err, result) => {
                rela = result;
                connection.query('SELECT * FROM Nivel_Aplicacion_Objetivo', (err,result) =>{
                    relobj = result;
                    connection.query('SELECT * FROM Aplicacion_Objetivo', (err,result) =>{
                        res.render('services/aplis', { apli: aplicaciones, apliNiv: rela, apliobj: result, apliNivobj: relobj});
                    });
                });
            });
        });
    });

    app.get('/levels',(req, res) =>{
        connection.query('SELECT * FROM Nivel', (err,result) =>{
            res.render('services/niveles', { niveles: result});
        });
    });
    //----------------------------------Arbol--------------------------------------------------------------------
    app.get('/arbol', (req, res) =>{
        var serv;
        var niv;
        var apl;
        connection.query('SELECT * FROM Servicio', (err, result) =>{
            serv= result;
            connection.query('SELECT * FROM Nivel', (err,result) =>{
                niv = result;
                connection.query('SELECT * FROM Aplicacion', (err,result) =>{
                    apl = result;
                    connection.query('SELECT * FROM Nivel_Aplicacion', (err,result) =>{
                        res.render('tree/arbol',{ servicios: serv, niveles:niv, apli:apl, ids:result});
                    });
                    
                });
            });
        });
        
    });
    
    //------------------------------Métodos tablas----------------------------------------------------




    //POST
    app.post('/services', (req, res)=>{
        const {serv} = req.body;
        connection.query('INSERT INTO Servicio SET?', {Serv_name: serv}, (err, result) => {
            res.redirect('/');
        });
    });

    app.post('/noservices', (req, res)=>{
        const {idS} = req.body;
        connection.query('DELETE FROM Servicio WHERE?', {id: idS}, (err, result) => {
            res.redirect('/');
        });
    });

    app.post('/addlevels', (req, res)=>{
        const {nivs, idsup, idserv} = req.body;
        connection.query('INSERT INTO Nivel SET?', {Nivel_name: nivs, id_suplevel: idsup, id_servicio: idserv}, (err, result) => {
            res.redirect('/levels');
        });
    });

    app.post('/nolevels', (req, res)=>{
        const {idN} = req.body;
        connection.query('DELETE FROM Nivel WHERE?', {id: idN}, (err, result) => {
            res.redirect('/levels');
        });
    });

    app.post('/addapps', (req, res)=>{
        const {aplis, link} = req.body;
        connection.query('INSERT INTO Aplicacion SET?', {apli_name: aplis, link: link}, (err, result) => {
            res.redirect('/apps');
        });
    });

    app.post('/noapps', (req, res)=>{
        const {idA} = req.body;
        connection.query('DELETE FROM Aplicacion WHERE?', {id: idA}, (err, result) => {
            res.redirect('/apps');
        });
    });

    app.post('/addids', (req, res)=>{
        const {idnivs, idapps} = req.body;
        connection.query('INSERT INTO Nivel_Aplicacion SET?', {id_lvl: idnivs, id_apli: idapps}, (err, result) => {
            res.redirect('/apps');
        });
    });

    app.post('/noids', (req, res)=>{
        const {idni, idap} = req.body;
        connection.query('DELETE FROM Nivel_Aplicacion WHERE id_lvl=? and id_apli=?',[idni,idap],(err, result) => {    
            res.redirect('/apps');
        });
    });

    app.post('/addappsobj', (req, res)=>{
        const {aplis, link} = req.body;
        connection.query('INSERT INTO Aplicacion_Objetivo SET?', {apli_name: aplis, link: link}, (err, result) => {
            res.redirect('/apps');
        });
    });

    app.post('/noappsobj', (req, res)=>{
        const {idA} = req.body;
        connection.query('DELETE FROM Aplicacion_Objetivo WHERE?', {id: idA}, (err, result) => {
            res.redirect('/apps');
        });
    });

    app.post('/addidsobj', (req, res)=>{
        const {idnivs, idapps} = req.body;
        connection.query('INSERT INTO Nivel_Aplicacion_Objetivo SET?', {id_lvl: idnivs, id_apli: idapps}, (err, result) => {
            res.redirect('/apps');
        });
    });

    app.post('/noidsobj', (req, res)=>{
        const {idni, idap} = req.body;
        connection.query('DELETE FROM Nivel_Aplicacion_Objetivo WHERE id_lvl=? and id_apli=?',[idni,idap],(err, result) => {    
            res.redirect('/apps');
        });
    });




    //----------------- ANGULAR REQUESTS ---------------------------------------------------------------------------------------

    app.get('/api/dominios', (req, res) =>{
        connection.query('SELECT * FROM Servicio', (err, result) =>{
            res.json(result);
        });
    });

    app.get('/api/niveles', (req, res) =>{
        connection.query('SELECT * FROM Nivel', (err, result) =>{
            res.json(result);
        });
    });

    app.get('/api/apliRela', (req, res) =>{
        connection.query('SELECT * FROM Nivel_Aplicacion', (err, result) =>{
            res.json(result);
        });
    });

    app.get('/api/relas', (req, res) =>{
        connection.query('SELECT * FROM Nivel_Aplicacion', (err, result) =>{
            res.json(result);
        });
    });

    app.get('/api/subdo/:id', (req, res) =>{
        const {id} = req.params; 
        connection.query('SELECT * FROM Nivel WHERE id_suplevel=0 and id_servicio='+id, (err, result) =>{
            res.json(result);
        });
    });

    app.get('/api/sec_subdo/:id', (req, res) =>{
        const {id} = req.params; 
        connection.query('SELECT * FROM Nivel WHERE id_suplevel='+id, (err, result) =>{
            res.json(result);
        });
    });

    app.get('/api/apli/:id', (req, res) =>{
        const {id} = req.params;
        connection.query('SELECT apli_name,link,Aplicacion.id FROM Aplicacion inner join Nivel_Aplicacion on Nivel_Aplicacion.id_apli=Aplicacion.id inner join Nivel on Nivel.id=Nivel_Aplicacion.id_lvl where Nivel.id='+id, (err, result) =>{
            res.json(result);
        });
    });

    app.get('/api/aplio/:id', (req, res) =>{
        const {id} = req.params;
        connection.query('SELECT apli_name,link,Aplicacion_Objetivo.id FROM Aplicacion_Objetivo inner join Nivel_Aplicacion_Objetivo on Nivel_Aplicacion_Objetivo.id_apli=Aplicacion_Objetivo.id inner join Nivel on Nivel.id=Nivel_Aplicacion_Objetivo.id_lvl where Nivel.id='+id, (err, result) =>{
            res.json(result);
        });
    });

    app.get('/api/apliAll', (req, res) =>{
        connection.query('SELECT * FROM Aplicacion', (err, result) =>{
            res.json(result);
        });
    });

    app.get('/api/aplioAll', (req, res) =>{
        connection.query('SELECT * FROM Aplicacion_Objetivo', (err, result) =>{
            res.json(result);
        });
    });


    //*************************** post ***************************************************************************
    app.post('/api/addService', (req, res)=>{
        const {name} = req.body;
        connection.query('INSERT INTO Servicio SET?', {Serv_name: name}, (err, result) => {
            res.json("Ok!");
        });
    });

    app.delete('/api/delService/:id', (req, res)=>{
        const { id } = req.params;
        connection.query('DELETE FROM Servicio WHERE id=?',[id], (err, result) => {
            res.json("Delete ok!");
        });
    });

    app.put('/api/editService/:id', (req, res)=>{
        const { id } = req.params;
        const  {nameEdi}  = req.body;
        connection.query('UPDATE Servicio SET Serv_name=? WHERE id=?',[nameEdi,id] , (err, result) => { 
            res.json("edit ok!");
        });
    });


    app.post('/api/addSubdo', (req, res)=>{
        const {id, subdo} = req.body;
        connection.query('INSERT INTO Nivel SET ?',{Nivel_name:subdo, id_suplevel:0, id_servicio:id}, (err, result) => {
            res.json("Add ok!");
        });
    });

    app.delete('/api/delSubdo/:id', (req, res)=>{
        const { id } = req.params;
        connection.query('DELETE FROM Nivel WHERE id=?',[id], (err, result) => {
            res.json("Delete ok!");
        });
    });

    app.put('/api/editSubdo/:id', (req, res)=>{
        const { id } = req.params;
        const  {nameEdi}  = req.body;
        connection.query('UPDATE Nivel SET Nivel_name=? WHERE id=?',[nameEdi,id] , (err, result) => { 
            res.json("edit ok!");
        });
    });

    app.post('/api/addSecSubdo', (req, res)=>{
        const {idA,idB, secSubdo} = req.body;
        connection.query('INSERT INTO Nivel SET ?',{Nivel_name:secSubdo, id_suplevel:idB, id_servicio:idA}, (err, result) => {
            res.json("Add ok!");
        });
    });

    app.delete('/api/delSecSubdo/:id', (req, res)=>{
        const { id } = req.params;
        connection.query('DELETE FROM Nivel WHERE id=?',[id], (err, result) => {
            res.json("Delete ok!");
        });
    });

    app.put('/api/editSecSubdo/:id', (req, res)=>{
        const { id } = req.params;
        const  {nameEdi}  = req.body;
        connection.query('UPDATE Nivel SET Nivel_name=? WHERE id=?',[nameEdi,id] , (err, result) => { 
            res.json("edit ok!");
        });
    });


    app.post('/api/addrela', (req, res)=>{
        const {idNiv, idApp} = req.body;
        connection.query('INSERT INTO Nivel_Aplicacion SET?', {id_lvl: idNiv, id_apli: idApp}, (err, result) => {
            res.json("Add ok!");
        });
    });

    app.post('/api/addrelao', (req, res)=>{
        const {idNiv, idApp} = req.body;
        connection.query('INSERT INTO Nivel_Aplicacion_Objetivo SET?', {id_lvl: idNiv, id_apli: idApp}, (err, result) => {
            res.json("Add ok!");
        });
    });


    app.post('/api/delrela', (req, res)=>{
        const {idNiv, idApp} = req.body;
        connection.query('DELETE FROM Nivel_Aplicacion WHERE id_lvl=? and id_apli=?',[idNiv,idApp],(err, result) => {    
            res.json("Delete ok!");
        });
    });

    app.post('/api/delrelao', (req, res)=>{
        const {idNiv, idApp} = req.body;
        connection.query('DELETE FROM Nivel_Aplicacion_Objetivo WHERE id_lvl=? and id_apli=?',[idNiv,idApp],(err, result) => {    
            res.json("Delete ok!");
        });
    });

    app.post('/api/addApp', (req, res)=>{
        const {idA, App, link} = req.body;
        connection.query('INSERT INTO Aplicacion SET?', {apli_name: App, link: link}, (err, result) => {
            connection.query('INSERT INTO Nivel_Aplicacion SET?', {id_lvl: idA, id_apli: result.insertId}, (err, result) => {
                res.json("Add ok!");
            });
        });
    });

    app.post('/api/addAppo', (req, res)=>{
        const {idA, Appo, linko} = req.body;
        connection.query('INSERT INTO Aplicacion_Objetivo SET?', {apli_name: Appo, link: linko}, (err, result) => {
            connection.query('INSERT INTO Nivel_Aplicacion_Objetivo SET?', {id_lvl: idA, id_apli: result.insertId}, (err, result) => {
                res.json("Add ok!");
            });
        });
    });

    app.delete('/api/delApp/:id', (req, res)=>{
        const { id } = req.params;
        connection.query('DELETE FROM Nivel_Aplicacion WHERE?', {id_apli: id}, (err, result) => {
            connection.query('DELETE FROM Aplicacion WHERE?', {id: id}, (err, result) => {
                res.json("Delete ok!");
            });
        });
    });

    app.delete('/api/delAppo/:id', (req, res)=>{
        const { id } = req.params;
        connection.query('DELETE FROM Nivel_Aplicacion_Objetivo WHERE?', {id_apli: id}, (err, result) => {
            connection.query('DELETE FROM Aplicacion_Objetivo WHERE?', {id: id}, (err, result) => {
                res.json("Delete ok!");
            });
        });
    });
}