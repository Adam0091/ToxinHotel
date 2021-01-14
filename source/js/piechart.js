const Chart = require( 'chart.js' );
import $ from 'jquery';
$(function() {
    var canvas = document.getElementById('myChart')
    var ctx = canvas.getContext('2d');
    
    
    ctx.canvas.parentNode.style.height = '120px';
    ctx.canvas.parentNode.style.width = '120px';
    
    var data = {
        datasets: [{
            data: [0 ,65, 65, 130],
            backgroundColor: [
                '#919191',
                '#BC9CFF',
                '#6FCF97',
                '#FFE39C',
            ],
            borderColor: [
                'white',
            ],
            borderWidth: 5,
            
        }],
        labels: [
            'Разочарован',
            'Удовлетворительно',
            'Хорошо',
            'Великолепно'
        ]
    };
    
    var options = {
        cutoutPercentage: 83,
        aspectRatio: 1,
        legend:{
            display: false,
            position: 'right',
            fontSize: 14,
            fontColor: '#1F2041',
            usePointStyle: true
        },
        layout: {
            padding: {
    
                right: 0,
                top: 0,
                bottom: 0
            }
        }
    
    }
    
    var myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options,
    });
});