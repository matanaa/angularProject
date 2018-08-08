

function Graph(jsonUrl,divChartName) {
    (function (d3) {
        'use strict';

        var width = 600;
        var height = 360;
        var radius = Math.min(width, height) / 2;
        var donutWidth = 75;
        var legendRectSize = 18;
        var legendSpacing = 4;

        var color = d3.scaleOrdinal(d3.schemeCategory20b);

        var svg = d3.select('#' + divChartName)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + (width / 2) +
                ',' + (height / 2) + ')');

        var arc = d3.arc()
            .innerRadius(radius - donutWidth)
            .outerRadius(radius);

        var pie = d3.pie()
            .value(function (d) { return d.count; })
            .sort(null);

        var tooltip = d3.select('#' + divChartName)
            .append('div')
            .attr('class', 'tooltipchart');

        tooltip.append('div')
            .attr('class', 'label');

        tooltip.append('div')
            .attr('class', 'count');

        tooltip.append('div')
            .attr('class', 'percent');

        d3.json(jsonUrl, function (error, dataset) {
            dataset.forEach(function (d) {
                d.enabled = true;

            });

            var path = svg.selectAll('path')
                .data(pie(dataset))
                .enter()
                .append('path')
                .attr('d', arc)
                .attr('fill', function (d, i) {
                    return color(d.data.label);
                })                                                        // UPDATED (removed semicolon)
                .each(function (d) { this._current = d; });

            path.on('mouseover', function (d) {
                var total = d3.sum(dataset.map(function (d) {
                    return (d.enabled) ? d.count : 0;                       // UPDATED
                }));
                var percent = Math.round(1000 * d.data.count / total) / 10;
                tooltip.select('.label').html(d.data.label);
                tooltip.select('.count').html(d.data.count);
                tooltip.select('.percent').html(percent + '%');
                tooltip.style('display', 'block');
            });

            path.on('mouseout', function () {
                tooltip.style('display', 'none');
            });

            /* OPTIONAL */
            path.on('mousemove', function (d) {
                tooltip.style('top', (d3.event.layerY + 10) + 'px')
                    .style('left', (d3.event.layerX + 10) + 'px');
            });


            var legend = svg.selectAll('.legend')
                .data(color.domain())
                .enter()
                .append('g')
                .attr('class', 'legend')
                .attr('transform', function (d, i) {
                    var height = legendRectSize + legendSpacing;
                    var offset = height * color.domain().length / 2;
                    var horz = -16 * legendRectSize;
                    var vert = i * height - offset;
                    return 'translate(' + horz + ',' + vert + ')';
                });

            legend.append('rect')
                .attr('width', legendRectSize)
                .attr('height', legendRectSize)
                .style('fill', color)
                .style('stroke', color)                                   // UPDATED (removed semicolon)
                .on('click', function (label) {
                    var rect = d3.select(this);
                    var enabled = true;
                    var totalEnabled = d3.sum(dataset.map(function (d) {
                        return (d.enabled) ? 1 : 0;
                    }));

                    if (rect.attr('class') === 'disabled') {
                        rect.attr('class', '');
                    } else {
                        if (totalEnabled < 2) return;
                        rect.attr('class', 'disabled');
                        enabled = false;
                    }

                    pie.value(function (d) {
                        if (d.label === label) d.enabled = enabled;
                        return (d.enabled) ? d.count : 0;
                    });

                    path = path.data(pie(dataset));

                    path.transition()
                        .duration(750)
                        .attrTween('d', function (d) {
                            var interpolate = d3.interpolate(this._current, d);
                            this._current = interpolate(0);
                            return function (t) {
                                return arc(interpolate(t));
                            };
                        });
                });

            legend.append('text')
                .attr('x', legendRectSize + legendSpacing)
                .attr('y', legendRectSize - legendSpacing)
                .style('fill', "#1277ff")
                .text(function (d) { return d; });

        });

    })(window.d3);
};