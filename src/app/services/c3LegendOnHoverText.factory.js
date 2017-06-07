/** Created by Samskrithi on 18/11/2016. */

(function () {
    'use strict';
    angular
        .module('dassimFrontendV03')
        .service('c3LegendOnHoverFactory', c3LegendOnHoverFactory);
    function c3LegendOnHoverFactory($log, $window) {
        function insertAfter(referenceNode, newNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

        function createLegendTooltip() {
            var svg = this.svg[0][0];
            var frag = document.createDocumentFragment();
            var div = document.createElement('div');
            var span = document.createElement('span');
            div.className = 'c3-legend-tooltip-container';
            span.className = 'c3-legend-tooltip';

            div.appendChild(span);
            frag.appendChild(div);
            insertAfter(svg, frag);

            this.legendHoverNode = span;
        }
        function legendFollowMouse(e) {
            var x = e[0];
            var y = e[1];
            return {
                x: x - 50 + 'px',
                y: y - 70 + 'px'
            }
        }


        return {
            generateLegendHoverLabels: function (labels) {
                createLegendTooltip.call(this);
                var obj = {};
                this.data.targets.map(function (data, i) {
                    if (typeof labels[i] !== 'undefined') {
                        obj[data.id] = labels[i];
                    }
                })
                return obj;
            },
           
            legend: function () {
                var top = {
                     item : {
                        onmouseover: function (id) {
                            // keep default behavior as well as our tooltip
                            d3.select(this.svg[0][0]).classed('c3-legend-item-focused', true);

                            if (!this.transiting && this.isTargetToShow(id)) {
                                this.api.focus(id);
                            }

                            // if we defined the long labels, display them
                            if (this.legendHoverContent.hasOwnProperty(id)) {
                                var coords = legendFollowMouse(d3.mouse(this.svg[0][0]))
                                this.legendHoverNode.parentNode.style.display = 'block';
                                this.legendHoverNode.parentNode.style.top = coords.y;
                                this.legendHoverNode.parentNode.style.left = coords.x;
                                this.legendHoverNode.innerHTML = this.legendHoverContent[id];
                            }
                        },
                        onmouseout: function (id) {
                            // keep default behavior as well
                            d3.select(this.svg[0][0]).classed('c3-legend-item-focused', false);
                            this.api.revert();

                            // just hide the tooltips
                            this.legendHoverNode.parentNode.style.display = 'none';
                        }
                    }
                }
                return top;
            }


        }
    }
})();

