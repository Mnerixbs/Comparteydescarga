        // init Isotope
        var $grid = $('.grid').isotope({
            itemSelector: '.element-item',
        });

        // bind filter button click
        $('#filters').on('click', 'button', function () {
            var filterValue = $(this).attr('data-filter');
            $grid.isotope({ filter: filterValue });
        });
