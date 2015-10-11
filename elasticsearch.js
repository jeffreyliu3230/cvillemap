/**
 * Created by jliu3230 on 10/10/15.
 */

/*https://docs.google.com/spreadsheets/d/11aIxy4FbfcqwUprsP4FB5tnVXmEu_TRoK6ffLz7s7Rk/edit#gid=66432575*/

var elasticsearch = require('elasticsearch');
var GoogleSpreadsheet = require("google-spreadsheet");


var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace',
});

client.ping({
    requestTimeout: 30000,

    // undocumented params are appended to the query string
    hello: "elasticsearch"
}, function (error) {
    if (error) {
        console.error('elasticsearch cluster is down!');
    } else {
        console.log('All is well');
    }
});

var creds = require('./cvillemap-googledrive-key.json');
var my_sheet = new GoogleSpreadsheet('11aIxy4FbfcqwUprsP4FB5tnVXmEu_TRoK6ffLz7s7Rk');
//my_sheet.getRows( 1, function(err, row_data){
//    console.log( 'pulled in '+row_data.length + ' rows');
//});


my_sheet.useServiceAccountAuth(creds, function(err) {
    // getInfo returns info about the sheet and an array or "worksheet" objects
    my_sheet.getRows(1, function(err, row_data) {
        console.log( 'pulled in '+row_data.length + ' rows');
        for (var ind in row_data) {
            var row = row_data[ind];
            var doc = {};
            doc['timestamp'] = row['timestamp'];
            doc['name'] = row['name'];
            doc['uvaorcharlottesvillemetroarea'] = row['uvaorcharlottesvillemetroarea'];
            doc['whattypeofcompanyareyou'] = row['whattypeofcompanyareyou'];
            doc['onelinedescriptionofyourcompany'] = row['timestamp'];
            doc['whatarethegpscoordinatesofyourcompany'] = row['whatarethegpscoordinatesofyourcompany'];
            doc['website'] = row['website'];
            doc['physicaladdress'] = row['physicaladdress'];
            doc['contactemailaddress'] = row['contactemailaddress'];
            doc['nameofprimarycontact'] = row['nameofprimarycontact'];
            doc['isthisaplaceincville'] = row['isthisaplaceincville'];
            doc['isthisanorganizationincville'] = row['isthisanorganizationincville'];
            doc['numberofemployees'] = row['numberofemployees'];
            doc['nowhiring'] = row['nowhiring'];
            doc['hiringwebpage'] = row['hiringwebpage'];
            doc['longerdescription'] = row['longerdescription'];
            doc['anythingelseyoudliketotellus'] = row['anythingelseyoudliketotellus'];
            doc['isthisassociatedwithaplaceordepartmentatuva'] = row['isthisassociatedwithaplaceordepartmentatuva'];
            doc['isthisassociatedwithatypeofpersonatuva'] = row['isthisassociatedwithatypeofpersonatuva'];
            doc['isthisatypeofgroupatuva'] = row['isthisatypeofgroupatuva'];
            doc['checked'] = row['checked'];

            client.create({
                index: 'cvillemap',
                type: 'companyinfo',
                id: ind,
                body: doc
            }, function (error, response) {
                if (error) console.error()
            });
        }
    });

});