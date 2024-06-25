document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelector('.menu-item.active').classList.remove('active');
        this.classList.add('active');
    });
});

google.charts.load('current', { 'packages': ['corechart', 'bar'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    const data = google.visualization.arrayToDataTable([
        ['Categoria', 'Mhl'],
        ['Flashcards', 50],
        ['Matérias', 12],
        ['Agenda Futura', 33],
    ]);

    const options = {
        title: 'Gráfico de Progresso',
        hAxis: {
            title: 'Quantidade',
        },
        vAxis: {
            title: 'Categoria'
        },
        bars: 'horizontal', // Required for Material Bar Charts.
        colors: ['#8C52FF'] // Custom color
    };

    const chart = new google.visualization.BarChart(document.getElementById('myChart'));
    chart.draw(data, options);
}
