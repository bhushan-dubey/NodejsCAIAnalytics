const express = require('express')
const bodyParser = require('body-parser')
const  request =  require('request')
const turl = require('turl')
const app = express() 
const port =  process.env.PORT || 3000
app.use(bodyParser.json())
app.post('/salesbyregion',(req,res)=>{
    var typeofChart = req.body.ctype;
    var demourl = 'https://dev01xxxxxtrial.hanatrial.ondemand.com/sap/hana/democontent/epm/services/salesByRegion.xsodata/SalesByRegion';
 var headers = {
       'Content-Type': 'application/json',
       'Accept': 'application/json',
       'Authorization': 'Basic c3lzdGVtOld42GNvbWUx',
   };
   var options = { method: 'GET',
     url: demourl,
     headers: headers 
      };
      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body)
            var resultData = JSON.parse(body);
            var datalength = resultData.d.results.length;
            var labels1 = new Array(),
                datapt = new Array();
            for (i=0;i<datalength;i++){
                labels1.push(resultData.d.results[i].REGION);
                datapt.push(resultData.d.results[i].SALES);

            }

            var chartjson = {type:typeofChart,data:{labels:labels1, datasets:[{data:datapt}]}}
              var shrturl;
              var imageUrl = 'https://quickcdocker.cfapps.eu10.hana.ondemand.com/chart?c='+JSON.stringify(chartjson).toString();
              turl.shorten(imageUrl).then((res1) => {
  console.log(res1);
  finalJson = {
    replies: [{
      type: 'picture',
      content: res1
    }], 
    conversation: {
      memory: { key: 'value' }
    }
  }
  // var str = JSON.stringify(finalJson);
  res.send(finalJson);

}).catch((err) => {
  console.log(err);
});
} else {
            res.send('Error happened')
        }
    })
})
app.listen(port, () => { 
    console.log('Server is running on port '+port) 
  })
