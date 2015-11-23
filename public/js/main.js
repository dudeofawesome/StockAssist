google.load('visualization', '1.0', {'packages':['corechart']});

var results = [];

jQuery(document).ready(function($) {


    var ctx = document.getElementById("leftChart").getContext("2d");
    // var chart = new Chart(ctx);
    var myPieChart;

    var open = false;


    function sendData(){

        $.ajax({
            url: "/twitter?q="+$("#input-23").val(),
            type: 'GET'
        })
        .done(function(data) {

            results.push(data);

            updateCharts();

            $("#twoThirds")
            .transition({height: "50vh"});
            $("#oneThird")
            .transition({display: "block"})
            .transition({height: "50vh"});

            $("#left-bottom").transition({display: "block", delay: 1000});
            $("#right-bottom").transition({display: "block", delay: 1000});

            var options = {};
            var datas = [
            {
                value: data.positive,
                color: "#1e7b75",
                highlight: "#26a69a",
                label: "positive"
            },
            {
                value: data.negative,
                color: "#808080",
                highlight: "#b3b3b3",
                label: "negative"
            }
            ]

            if(myPieChart !== undefined){
                myPieChart.destroy();
            }


            myPieChart = new Chart(ctx).Doughnut(datas,options);

            // console.log(data);

            $("#prediction").text(data.prediction);


            myPieChart.update();


            // $("#good").text(data.positive);
            // $("#bad").text(data.negative);
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });

        // $("#title").transition({top: "1vh"});
        // $("#input").transition({top: "-6vh"});
    }

    $("#input-23").keydown(function(e) {
        if (e.keyCode == 13) {
            console.log("sent");
            sendData();

        }
    });

    $("#click").click(function(event) {
        sendData();
    });



});

function updateCharts () {
    var label = ['Results', 'Positive', 'Negative'];
    var data = [];

    for (var i = 0; i < results.length; i++) {
        data.push([results[i].query, results[i].positive, results[i].negative]);
    }

    data.sort(function (a, b) {
        if (a[0] < b[0]) {
            return -1;
        } else if (a[0] > b[0]) {
            return 1;
        } else {
            return 0;
        }
    })

    data.splice(0, 0, label);

    var dataTable = google.visualization.arrayToDataTable(data);

    var options = {
        width: 600,
        height: 400,
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },
        isStacked: true,
        backgroundColor: '#FAF8F7'
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('chart-louis'));
    chart.draw(dataTable, options);
}
