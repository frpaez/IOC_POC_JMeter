/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.76470588235294, "KoPercent": 0.23529411764705882};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6390384615384616, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.26, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-0"], "isController": false}, {"data": [0.475, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F"], "isController": false}, {"data": [0.82, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-28"], "isController": false}, {"data": [0.08, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-27"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.8, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-24"], "isController": false}, {"data": [0.0, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/"], "isController": false}, {"data": [0.81, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-23"], "isController": false}, {"data": [0.85, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-26"], "isController": false}, {"data": [0.76, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-25"], "isController": false}, {"data": [0.67, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-20"], "isController": false}, {"data": [0.74, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-22"], "isController": false}, {"data": [0.54, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-21"], "isController": false}, {"data": [0.96, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-8"], "isController": false}, {"data": [0.985, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-7"], "isController": false}, {"data": [0.98, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-5"], "isController": false}, {"data": [0.99, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-4"], "isController": false}, {"data": [0.985, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-3"], "isController": false}, {"data": [0.99, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-2"], "isController": false}, {"data": [0.995, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-1"], "isController": false}, {"data": [0.98, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-0"], "isController": false}, {"data": [0.59, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-17"], "isController": false}, {"data": [0.66, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-16"], "isController": false}, {"data": [0.69, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-19"], "isController": false}, {"data": [0.63, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-18"], "isController": false}, {"data": [0.12, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-5"], "isController": false}, {"data": [0.59, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-13"], "isController": false}, {"data": [0.13, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-6"], "isController": false}, {"data": [0.4, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-12"], "isController": false}, {"data": [0.04, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-3"], "isController": false}, {"data": [0.67, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-15"], "isController": false}, {"data": [0.09, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-4"], "isController": false}, {"data": [0.24, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-14"], "isController": false}, {"data": [0.6, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-9"], "isController": false}, {"data": [0.45, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-7"], "isController": false}, {"data": [0.52, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-11"], "isController": false}, {"data": [1.0, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/ShoppingCart/CartSummary?cart=True&wishlist=True&compare=True"], "isController": false}, {"data": [0.58, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-8"], "isController": false}, {"data": [0.22, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-10"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2550, 6, 0.23529411764705882, 1286.2247058823536, 63, 19380, 419.0, 2914.000000000001, 4527.749999999997, 13223.629999999981, 60.04379665167534, 4452.047605680025, 74.72707114306905], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-1", 50, 0, 0.0, 1647.4200000000003, 422, 3826, 1519.5, 2832.5, 3398.4999999999973, 3826.0, 5.279273571956499, 348.9991652148664, 3.6398116619153202], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-2", 50, 0, 0.0, 5859.5, 2032, 15534, 4939.0, 11007.499999999998, 12085.099999999999, 15534.0, 2.9378929431811507, 1240.508081041777, 1.8160998369469419], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-0", 50, 0, 0.0, 4226.780000000001, 2092, 9881, 3925.5, 6435.299999999999, 6734.749999999998, 9881.0, 4.703668861712135, 236.67630673800562, 2.4712635230479774], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F", 100, 3, 3.0, 776.4299999999998, 518, 3457, 673.5, 1096.8000000000002, 1195.6999999999998, 3439.8499999999913, 3.528208023145045, 140.31407666796034, 23.223636843753308], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-28", 50, 0, 0.0, 598.4199999999998, 155, 2955, 330.0, 1057.1, 2028.1999999999985, 2955.0, 8.76731544800982, 22.920022904611606, 5.488133986498334], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-27", 50, 0, 0.0, 3006.420000000001, 512, 6837, 2818.5, 5137.8, 6066.099999999999, 6837.0, 6.690753378830457, 3525.7068676401714, 4.606426886792453], "isController": false}, {"data": ["Test", 50, 3, 6.0, 15027.380000000001, 11837, 21006, 14726.5, 17116.0, 18438.549999999992, 21006.0, 2.305103499147112, 4359.205899047993, 73.85222953932507], "isController": true}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-24", 50, 0, 0.0, 669.0999999999998, 196, 2557, 356.0, 1426.8, 2050.0499999999984, 2557.0, 7.79423226812159, 72.74363065081839, 4.909452942322681], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/", 50, 0, 0.0, 13364.32, 10441, 19380, 13173.0, 15362.6, 15742.849999999999, 19380.0, 2.5089066184956597, 4543.206018082945, 45.83409776581866], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-23", 50, 0, 0.0, 701.16, 212, 3535, 342.5, 1648.1, 2692.149999999995, 3535.0, 7.932730445819452, 70.89877835951134, 5.229094776297002], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-26", 50, 0, 0.0, 641.86, 166, 4240, 358.0, 1043.2, 2423.44999999999, 4240.0, 8.406186953597848, 100.53766759835239, 5.270285179892401], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-25", 50, 0, 0.0, 740.3399999999998, 139, 3579, 351.5, 1737.4, 2501.75, 3579.0, 7.653451706719731, 64.47136174039491, 4.8133036124292055], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-20", 50, 0, 0.0, 953.8600000000001, 231, 4546, 676.5, 1712.1, 2970.299999999991, 4546.0, 6.897503103876397, 92.38208502896951, 4.3917695544213], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-22", 50, 0, 0.0, 830.68, 202, 5170, 385.5, 1622.1, 2677.0999999999963, 5170.0, 7.448234768359899, 101.70040872188291, 4.706062397586772], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-21", 50, 0, 0.0, 1066.86, 291, 5548, 680.0, 2372.8, 2960.7999999999993, 5548.0, 6.470816617057073, 381.0262007409085, 4.05689869936586], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-8", 100, 3, 3.0, 286.52000000000004, 63, 574, 277.5, 386.0, 418.79999999999995, 573.2899999999996, 3.6766057575646163, 1.519400414537299, 2.611144079286003], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-7", 100, 0, 0.0, 306.26999999999987, 82, 507, 294.0, 408.1, 457.04999999999956, 506.99, 3.705075954057058, 1.1397450444609114, 2.820416705261208], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-6", 100, 0, 0.0, 238.04999999999995, 72, 3329, 124.0, 401.9, 461.8499999999995, 3300.8099999999854, 3.717472118959108, 1.757086431226766, 2.6918999767657996], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-5", 100, 0, 0.0, 178.45999999999995, 70, 496, 102.5, 377.30000000000007, 416.4999999999999, 495.5499999999998, 3.691807878318012, 1.2330061468601174, 2.723789894598885], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-4", 100, 0, 0.0, 200.87000000000003, 68, 504, 109.0, 411.00000000000006, 445.5999999999999, 504.0, 3.6923531366539897, 1.2331882546246724, 2.630441028504966], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-3", 100, 0, 0.0, 227.63000000000002, 73, 521, 219.0, 415.0, 448.89999999999975, 520.93, 3.688539707129947, 1.134658210689388, 2.807828810261517], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-2", 100, 0, 0.0, 228.86000000000007, 87, 558, 172.5, 418.1, 437.9, 557.7099999999998, 3.683512597613084, 2.2554320299837927, 2.591768385332253], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-1", 100, 0, 0.0, 214.4999999999999, 70, 505, 146.5, 401.9, 429.5499999999999, 504.81999999999994, 3.68758758020503, 1.134365320082602, 2.8107051819824473], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-0", 100, 0, 0.0, 273.5899999999999, 123, 1137, 231.5, 408.30000000000007, 480.9, 1131.6499999999974, 3.596216779947495, 131.909863635955, 2.551417471320171], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-17", 50, 0, 0.0, 1086.0, 295, 4658, 708.0, 2377.7999999999997, 2914.9999999999977, 4658.0, 6.070171178827243, 178.88628482760714, 3.7997848883088503], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-16", 50, 0, 0.0, 1008.8599999999998, 283, 4553, 535.5, 2404.0, 3240.9499999999966, 4553.0, 6.031363088057901, 70.36197602533173, 3.763711927020507], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-19", 50, 0, 0.0, 921.9600000000002, 280, 4459, 478.5, 1986.4999999999998, 3324.549999999998, 4459.0, 6.787944610371979, 60.52804905986967, 4.308753903068151], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-18", 50, 0, 0.0, 1032.1599999999996, 288, 4318, 484.5, 2379.4999999999995, 3636.2499999999973, 4318.0, 6.317917614354309, 73.70492560652009, 4.004227081753854], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-5", 50, 0, 0.0, 1929.58, 1119, 4655, 1811.5, 2541.6, 3673.2499999999923, 4655.0, 4.144562334217507, 13.522444100215518, 2.6146360038129974], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-13", 50, 0, 0.0, 1123.72, 269, 3708, 1009.5, 2453.2, 2685.449999999999, 3708.0, 6.336332530731212, 28.303110347231023, 3.935456532758839], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-6", 50, 0, 0.0, 1989.1199999999997, 301, 7273, 1799.5, 2766.1, 4612.899999999995, 7273.0, 4.2013276195277705, 46.4894953680363, 2.597109749180741], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-12", 50, 0, 0.0, 1598.8800000000003, 321, 5669, 1120.0, 3312.1, 4466.15, 5669.0, 5.809900069718801, 303.958766049849, 3.64253500464792], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-3", 50, 0, 0.0, 2744.62, 561, 5797, 2661.5, 4192.7, 5158.649999999999, 5797.0, 3.9111389236545686, 440.72500904450874, 2.6927274816176467], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-15", 50, 0, 0.0, 949.7, 275, 3025, 467.0, 2449.8999999999996, 2919.1999999999994, 3025.0, 6.4053292339226235, 72.44777655008967, 3.9908203625416347], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-4", 50, 0, 0.0, 2097.2, 550, 5151, 1954.0, 2923.2, 4164.299999999994, 5151.0, 4.109476452699926, 140.15160757581984, 2.4881595709706583], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-14", 50, 0, 0.0, 1988.08, 588, 4849, 1598.5, 3906.2999999999997, 4258.5999999999985, 4849.0, 5.480052608505042, 704.4971537976764, 3.4143296525646645], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-9", 50, 0, 0.0, 1084.0600000000002, 279, 3902, 683.0, 2322.9, 3595.7999999999993, 3902.0, 6.13421666053245, 59.87450734572445, 3.8338854128327813], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-7", 50, 0, 0.0, 1365.3200000000002, 274, 5642, 1112.5, 2544.4, 3629.9999999999955, 5642.0, 4.75827940616673, 71.8156330295965, 2.9925116577845454], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-11", 50, 0, 0.0, 1147.9400000000003, 303, 6042, 717.5, 2629.5, 3128.399999999998, 6042.0, 5.537098560354375, 178.50654069767444, 3.449871954595792], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/ShoppingCart/CartSummary?cart=True&wishlist=True&compare=True", 50, 0, 0.0, 110.20000000000002, 89, 235, 102.0, 148.8, 154.7, 235.0, 2.8146813780680024, 2.0862726230015762, 1.7042016156271111], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-8", 50, 0, 0.0, 1000.22, 284, 3528, 784.5, 2096.2, 2267.3999999999996, 3528.0, 6.456611570247934, 83.12256868220558, 4.016466377195248], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-10", 50, 0, 0.0, 2250.760000000001, 640, 7080, 1760.0, 4187.6, 4873.249999999995, 7080.0, 5.3084191527763025, 682.4325333103302, 3.3229459735640723], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, 50.0, 0.11764705882352941], "isController": false}, {"data": ["Assertion failed", 3, 50.0, 0.11764705882352941], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2550, 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "Assertion failed", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F", 100, 3, "Assertion failed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-8", 100, 3, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
