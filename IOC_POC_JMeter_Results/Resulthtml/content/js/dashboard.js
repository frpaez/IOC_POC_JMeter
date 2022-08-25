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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8269230769230769, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.83, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-1"], "isController": false}, {"data": [0.36, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-2"], "isController": false}, {"data": [0.19, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-0"], "isController": false}, {"data": [0.905, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F"], "isController": false}, {"data": [0.81, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-28"], "isController": false}, {"data": [0.61, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-27"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.82, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-24"], "isController": false}, {"data": [0.0, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/"], "isController": false}, {"data": [0.89, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-23"], "isController": false}, {"data": [0.86, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-26"], "isController": false}, {"data": [0.79, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-25"], "isController": false}, {"data": [0.85, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-20"], "isController": false}, {"data": [0.89, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-22"], "isController": false}, {"data": [0.93, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-21"], "isController": false}, {"data": [0.995, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-8"], "isController": false}, {"data": [0.975, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-7"], "isController": false}, {"data": [0.985, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-6"], "isController": false}, {"data": [0.985, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-5"], "isController": false}, {"data": [0.985, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-4"], "isController": false}, {"data": [0.98, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-3"], "isController": false}, {"data": [0.97, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-2"], "isController": false}, {"data": [0.98, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-1"], "isController": false}, {"data": [0.98, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-0"], "isController": false}, {"data": [0.91, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-17"], "isController": false}, {"data": [0.89, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-16"], "isController": false}, {"data": [0.85, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-19"], "isController": false}, {"data": [0.85, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-18"], "isController": false}, {"data": [0.68, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-5"], "isController": false}, {"data": [0.91, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-13"], "isController": false}, {"data": [0.63, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-6"], "isController": false}, {"data": [0.89, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-12"], "isController": false}, {"data": [0.59, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-3"], "isController": false}, {"data": [0.91, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-15"], "isController": false}, {"data": [0.64, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-4"], "isController": false}, {"data": [0.86, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-14"], "isController": false}, {"data": [0.87, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-9"], "isController": false}, {"data": [0.67, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-7"], "isController": false}, {"data": [0.87, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-11"], "isController": false}, {"data": [1.0, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/ShoppingCart/CartSummary?cart=True&wishlist=True&compare=True"], "isController": false}, {"data": [0.87, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-8"], "isController": false}, {"data": [0.8, 500, 1500, "https://services.smartbear.com/samples/TestComplete12/smartstore/-10"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2550, 0, 0.0, 469.81176470588457, 12, 7144, 156.0, 1106.9, 1789.0, 5456.339999999986, 74.8898678414097, 5529.715549284141, 93.33700440528635], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-1", 50, 0, 0.0, 476.56, 57, 1683, 399.0, 1060.3, 1220.0, 1683.0, 5.759041695461875, 380.71539895761344, 3.970589293941488], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-2", 50, 0, 0.0, 1392.8599999999994, 284, 3829, 1298.5, 2257.6, 3201.899999999995, 3829.0, 5.48185505975222, 2314.6811787358843, 3.3886857937726127], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-0", 50, 0, 0.0, 2466.0799999999995, 617, 6105, 1973.0, 4828.9, 5059.299999999999, 6105.0, 5.529138560212319, 278.21178155755837, 2.904957563861551], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F", 100, 0, 0.0, 314.7399999999998, 109, 3103, 168.5, 794.0, 1181.099999999999, 3093.319999999995, 3.45458942204719, 137.112451743704, 22.81749566017204], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-28", 50, 0, 0.0, 415.9800000000001, 12, 1706, 135.0, 1260.0, 1580.8999999999996, 1706.0, 6.948304613674263, 18.16465961992774, 4.349475837270706], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-27", 50, 0, 0.0, 850.1800000000003, 90, 2790, 606.0, 2159.7, 2693.45, 2790.0, 6.797172376291463, 3581.7845869868133, 4.679693872349103], "isController": false}, {"data": ["Test", 50, 0, 0.0, 6023.58, 3881, 7555, 5956.0, 7275.599999999999, 7531.4, 7555.0, 4.698364968990791, 8848.142971246007, 150.7422682531479], "isController": true}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-24", 50, 0, 0.0, 433.84, 16, 1935, 138.0, 1684.8, 1890.1499999999999, 1935.0, 6.790710308298248, 63.377752359771826, 4.277351707863643], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/", 50, 0, 0.0, 5357.1, 3495, 7144, 5417.5, 6596.4, 7019.4, 7144.0, 4.981568197668626, 8982.35357302979, 91.0060510486201], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-23", 50, 0, 0.0, 334.14000000000004, 18, 1955, 148.0, 1024.5, 1879.8999999999999, 1955.0, 6.75310642895732, 60.35588870880605, 4.4515105854943275], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-26", 50, 0, 0.0, 387.2400000000002, 18, 1973, 144.5, 1319.4999999999995, 1913.8, 1973.0, 6.846501437765302, 81.8838897542106, 4.292435471723949], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-25", 50, 0, 0.0, 463.77999999999986, 15, 1984, 219.0, 1722.3, 1916.1, 1984.0, 6.8296680781314025, 57.53195004097801, 4.295220939762328], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-20", 50, 0, 0.0, 421.05999999999983, 59, 2306, 183.0, 1274.2, 1681.3499999999985, 2306.0, 6.607638430025109, 88.49976666776794, 4.20720728161755], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-22", 50, 0, 0.0, 300.06000000000006, 17, 1938, 138.5, 732.2, 1342.3499999999976, 1938.0, 6.6711140760507, 91.0893720813876, 4.215049616410941], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-21", 50, 0, 0.0, 250.13999999999993, 29, 1577, 133.0, 587.3, 926.5999999999976, 1577.0, 6.664889362836577, 392.45393936616904, 4.178573213809651], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-8", 100, 0, 0.0, 70.56000000000002, 12, 613, 37.0, 162.8, 256.44999999999965, 611.3999999999992, 3.644447683953497, 1.2171885819454062, 2.671052721491308], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-7", 100, 0, 0.0, 103.04999999999997, 37, 1597, 41.0, 168.60000000000002, 434.69999999999993, 1589.6399999999962, 3.6441820633358843, 1.1210130370613316, 2.7740624202835176], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-6", 100, 0, 0.0, 68.03000000000003, 13, 638, 23.5, 187.90000000000023, 367.549999999999, 637.6899999999998, 3.5794824068439706, 1.6918647313598454, 2.591978715502738], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-5", 100, 0, 0.0, 63.899999999999984, 12, 698, 21.5, 174.80000000000018, 275.64999999999947, 697.1299999999995, 3.5794824068439706, 1.1954911944732791, 2.640916951533808], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-4", 100, 0, 0.0, 65.29, 12, 609, 19.0, 167.8, 438.9499999999984, 608.7099999999998, 3.5803795202291444, 1.1957908163265307, 2.550670761725743], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-3", 100, 0, 0.0, 86.17999999999998, 14, 1262, 34.5, 188.8, 344.69999999999925, 1256.3799999999972, 3.578457684737878, 1.1007950885668276, 2.7240310207550547], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-2", 100, 0, 0.0, 113.31000000000004, 29, 813, 51.5, 351.40000000000015, 566.6999999999995, 811.8299999999994, 3.5762820971318217, 2.189774291896145, 2.516319581038552], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-1", 100, 0, 0.0, 85.51000000000002, 13, 1061, 36.5, 259.20000000000005, 480.5499999999983, 1057.049999999998, 3.578201595877912, 1.1007163112319749, 2.7273304156081153], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/login?returnUrl=%2Fsamples%2FTestComplete12%2Fsmartstore%2F-0", 100, 0, 0.0, 144.1, 56, 964, 88.0, 302.00000000000017, 401.9, 963.6099999999998, 3.4610459280794657, 126.95177302893434, 2.455517447997785], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-17", 50, 0, 0.0, 341.9, 26, 2340, 239.0, 707.5, 1338.3499999999995, 2340.0, 6.362942224484602, 187.51416748854672, 3.9830527010689747], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-16", 50, 0, 0.0, 317.12, 25, 1504, 270.5, 665.2, 816.049999999999, 1504.0, 6.109481915933529, 71.27331149193549, 3.812459906524927], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-19", 50, 0, 0.0, 393.3599999999999, 28, 1895, 209.0, 1286.099999999999, 1787.0999999999992, 1895.0, 6.571165724799579, 58.59503343080563, 4.171150118280983], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-18", 50, 0, 0.0, 396.7999999999997, 25, 1990, 221.0, 1146.5, 1837.4999999999993, 1990.0, 6.4053292339226235, 74.7246709262106, 4.059627610171662], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-5", 50, 0, 0.0, 694.3399999999999, 113, 1768, 648.5, 1159.2, 1488.0999999999979, 1768.0, 5.786367318597384, 18.87915352679088, 3.6503840701307717], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-13", 50, 0, 0.0, 311.99999999999994, 19, 1789, 189.5, 816.2999999999995, 1259.949999999997, 1789.0, 6.23208276205908, 27.83744780630687, 3.870707652997632], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-6", 50, 0, 0.0, 766.4800000000001, 130, 2334, 669.0, 1616.2999999999997, 1998.4499999999994, 2334.0, 5.8472693252251196, 64.70254758215414, 3.614571760612794], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-12", 50, 0, 0.0, 378.3399999999998, 67, 1762, 248.5, 719.6999999999999, 1511.899999999998, 1762.0, 6.207324643078834, 324.75097959342025, 3.891701582867784], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-3", 50, 0, 0.0, 761.9200000000001, 75, 2094, 704.0, 1282.2, 1648.1999999999996, 2094.0, 5.8186896310950775, 655.676540861748, 4.006031435470732], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-15", 50, 0, 0.0, 344.6599999999998, 29, 1632, 271.5, 747.9, 1238.5499999999997, 1632.0, 6.104260774020267, 69.04252762178, 3.8032405994384075], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-4", 50, 0, 0.0, 688.7399999999999, 138, 1787, 679.5, 1117.8, 1431.2999999999986, 1787.0, 5.817335660267597, 198.3972785776614, 3.5222149505526468], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-14", 50, 0, 0.0, 393.78000000000003, 90, 1816, 285.0, 904.7, 1184.9999999999984, 1816.0, 6.065752759917506, 748.601085769744, 3.779248301589227], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-9", 50, 0, 0.0, 377.78000000000003, 42, 1390, 268.0, 842.0, 1077.4999999999986, 1390.0, 6.129704548240775, 59.83046578092436, 3.831065342650484], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-7", 50, 0, 0.0, 624.6200000000001, 44, 1705, 622.5, 981.9, 1593.45, 1705.0, 5.722133211261157, 86.36286013675898, 3.598685339894713], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-11", 50, 0, 0.0, 403.82000000000005, 42, 1908, 292.0, 1083.8999999999999, 1319.9999999999995, 1908.0, 6.226650062266501, 200.73649595267747, 3.879494863013699], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/ShoppingCart/CartSummary?cart=True&wishlist=True&compare=True", 50, 0, 0.0, 37.0, 28, 123, 30.0, 47.999999999999986, 99.19999999999993, 123.0, 2.9032632679131347, 2.151930488619208, 1.7578351817442803], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-8", 50, 0, 0.0, 404.02000000000004, 52, 1409, 321.0, 932.0999999999997, 1142.349999999999, 1409.0, 5.88650812338121, 75.78304354544385, 3.6618219478455383], "isController": false}, {"data": ["https://services.smartbear.com/samples/TestComplete12/smartstore/-10", 50, 0, 0.0, 545.3599999999999, 148, 1708, 436.5, 1297.5999999999995, 1546.0499999999988, 1708.0, 6.125199068969742, 771.6863151568051, 3.8342310578218792], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2550, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
