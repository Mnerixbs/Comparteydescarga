// init Isotope
var $grid = $('.grid').isotope({
    itemSelector: '.element-item',
});

var filtroActual = '*';
var textoBusqueda = '';

function aplicarFiltros() {
    $grid.isotope({
        filter: function () {
            var $elemento = $(this);
            // Filtro por categoría
            var coincideFiltro =
                filtroActual === '*' ||
                $elemento.is(filtroActual);
            // Texto completo del elemento
            var texto = $elemento.text().toLowerCase();
            // Filtro por búsqueda
            var coincideBusqueda =
                texto.includes(textoBusqueda);
            // Debe cumplir ambos filtros
            return coincideFiltro && coincideBusqueda;
        }
    });

}

// bind filter button click
/* $('#filters').on('click', 'button', function () {
    var filterValue = $(this).attr('data-filter');
    $grid.isotope({ filter: filterValue });
});
 */

// Click en botones
$('#filters').on('click', 'button', function () {

    filtroActual = $(this).attr('data-filter');

    aplicarFiltros();

});


// Buscador
$('#buscador').on('input', function () {

    textoBusqueda = $(this).val().toLowerCase().trim();

    aplicarFiltros();

});

