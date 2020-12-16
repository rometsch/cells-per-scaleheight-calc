var grid_type = "spherical";
var spacing_type = "log"


var parameter_accessible = [
    "x1N", "x1min", "x1max", "x1extent",
    "x2N", "x2min", "x2max", "x2extent",
    "x3N", "x3min", "x3max", "x3extent",
    "aspect-ratio", "flaring-index", "radius"
]

init();


function init() {
    apply_parameter_values();

    register_events("input", function (e) { calc_domain_extent(this.id.substring(0, 2)) },
        ["x1min", "x1max", "x2min", "x2max", "x3min", "x3max"]
    )
    register_events("input", function (e) { calc_cps(this.id.substring(0, 2)) },
        ["x1N", "x1extent", "x1min", "x1max", "x2N", "x2extent", "x2min", "x2max", "x3N", "x3extent", "x3min", "x3max"]
    )
    register_events("input", function (e) { sort_minmax(this.id.substring(0, 2)) },
        ["x1min", "x1max", "x2min", "x2max", "x3min", "x3max"]
    )
    register_events("input", calc_cps_all, ["aspect-ratio", "flaring-index", "radius"]
    )
    register_events("change", function (e) { calc_number_of_cells(this.id.substring(0, 2)) },
        ["x1cps", "x2cps", "x3cps"]
    )

    register_events("click", copy_share_link, ["button-share-link"])

    update_selection();

    register_events("click", function (e) { grid_type = "spherical"; update_selection(); }, ["button-spherical-grid"]);
    register_events("click", function (e) { grid_type = "cylindrical"; update_selection(); }, ["button-cylindrical-grid"]);

    register_events("click", function (e) { spacing_type = "log"; update_selection(); }, ["button-log-spacing"]);
    register_events("click", function (e) { spacing_type = "uniform"; update_selection(); }, ["button-uniform-spacing"]);
}

function update_selection() {
    if (grid_type == "spherical") {
        set_labels_spherical();
    }
    else if (grid_type == "cylindrical") {
        set_labels_cylindrical();
    }
    calc_cps_all();
    hide_inactive_buttons();
}

function hide_inactive_buttons() {
    if (grid_type == "spherical") {
        get_elem("button-spherical-grid").classList.remove("hidden");
        get_elem("button-cylindrical-grid").classList.add("hidden");
    }
    else if (grid_type == "cylindrical") {
        get_elem("button-spherical-grid").classList.add("hidden");
        get_elem("button-cylindrical-grid").classList.remove("hidden");
    }
    if (spacing_type == "log") {
        get_elem("button-log-spacing").classList.remove("hidden");
        get_elem("button-uniform-spacing").classList.add("hidden");
    }
    else if (spacing_type == "uniform") {
        get_elem("button-log-spacing").classList.add("hidden");
        get_elem("button-uniform-spacing").classList.remove("hidden");
    }
}

function sort_minmax(axis) {
    var xmin = get_number_from_input(axis+"min");
    var xmax = get_number_from_input(axis+"max");
    if (is_not_set(xmin) || is_not_set(xmax)) {
        return;
    }
    if (xmin > xmax) {
        set_element_value(axis+"min", xmax);
        set_element_value(axis+"max", xmin);
    }
}

function calc_cps_all() {
    calc_cps("x1");
    calc_cps("x2");
    calc_cps("x3");
}

function calc_cps(axis) {
    calc_domain_extent(axis);
    var domain_extent = get_number_from_input(axis + "extent");
    var number_of_cells = get_number_from_input(axis + "N");
    var aspect_ratio = get_number_from_input("aspect-ratio");
    var flaring_index = parseFloat(get_number_from_input("flaring-index"));
    if (!flaring_index) { flaring_index = 0.0; }
    var radius = get_number_from_input("radius");
    if (!domain_extent || !number_of_cells || !aspect_ratio || !radius) {
        set_element_value(axis + "cps", null);
        return;
    }
    var H = aspect_ratio * Math.pow(radius, 1.0 + flaring_index);
    var dx = calc_dx(radius, axis);
    var cps = H / dx;
    set_element_value(axis + "cps", cps);
    update_plot();
}

function calc_dx(radius, axis) {
    if (grid_type == "spherical") {
        return calc_dx_spherical(radius, axis);
    }
    else if (grid_type == "cylindrical") {
        return calc_dx_cylindrical(radius, axis);
    }
    else {
        console.log("Invalid grid type " + grid_type);
    }
}

function calc_dx_spherical(radius, axis) {
    var extent;
    var N;
    var dx;
    if (axis == "x1") {
        dx = calc_dr(radius);
    }
    else if (axis == "x2") {
        extent = get_number_from_input(axis + "extent");
        N = get_number_from_input(axis + "N");
        dx = radius * extent / N;
    }
    else if (axis == "x3") {
        extent = get_number_from_input(axis + "extent");
        N = get_number_from_input(axis + "N");
        dx = radius * extent / N;
    }
    return dx;
}

function calc_dx_cylindrical(radius, axis) {
    var extent;
    var N;
    var dx;
    if (axis == "x1") {
        dx = calc_dr(radius);
    }
    else if (axis == "x2") {
        extent = get_number_from_input(axis + "extent");
        N = get_number_from_input(axis + "N");
        dx = radius * extent / N;
    }
    else if (axis == "x3") {
        extent = get_number_from_input(axis + "extent");
        N = get_number_from_input(axis + "N");
        dx = extent / N;
    }
    return dx;
}

function calc_dr(radius) {
    var extent = get_number_from_input("x1extent");
    var N = get_number_from_input("x1N");
    var dr;
    if (spacing_type == "uniform") {
        dx = extent / N;
    }
    else if (spacing_type == "log") {
        var r1 = get_number_from_input("x1max");
        var r2 = get_number_from_input("x1min");
        var rmax = Math.max(r1, r2)
        var rmin = Math.min(r1, r2)
        dx = radius * (Math.pow(rmax / rmin, 1.0 / N) - 1);
    }
    else {
        console.log("Invalid spacing type " + spacing_type);
    }
    return dx;
}

function calc_domain_extent(axis) {
    var xmin = get_number_from_input(axis + "min");
    var xmax = get_number_from_input(axis + "max");
    if ((!xmin && xmin != 0) || (!xmax && xmax != 0) || xmin == xmax) {
        return;
    }
    var extent = Math.abs(xmax - xmin);
    set_element_value(axis + "extent", extent);
}

function calc_number_of_cells(axis) {
    var radius = get_number_from_input("radius");
    var aspect_ratio = get_number_from_input("aspect-ratio");
    var flaring_index = get_number_from_input("flaring-index")
    var xmin = get_number_from_input(axis + "min");
    var xmax = get_number_from_input(axis + "max");
    var cps = get_number_from_input(axis + "cps");
    if (is_not_set(radius) || is_not_set(aspect_ratio) || is_not_set(flaring_index)
        || is_not_set(xmin) || is_not_set(xmax) || is_not_set(cps)) {
        return;
    }
    var N;
    var H = aspect_ratio * Math.pow(radius, 1.0 + flaring_index);
    if (axis == "x1") {
        if (spacing_type == "uniform") {
            N = calc_N_uniform(xmin, xmax, radius, H, cps);
        }
        if (spacing_type == "log") {
            N = calc_N_logarithmic(xmin, xmax, radius, H, cps);
        }
    }
    if (axis == "x2") {
        xmin *= radius;
        xmax *= radius;
        N = calc_N_uniform(xmin, xmax, radius, H, cps);
    }
    if (axis == "x3") {
        if (grid_type=="spherical") {
            xmin *= radius;
            xmax *= radius;
        }
        N = calc_N_uniform(xmin, xmax, radius, H, cps);
    }
    set_element_value(axis+"N", N);
    calc_cps(axis);
}

function calc_N_uniform(xmin, xmax, r, H, cps) {
    var N = cps * (xmax - xmin) / H;
    return parseInt(Math.round(N));
}

function calc_N_logarithmic(xmin, xmax, r, H, cps) {
    var N = Math.log(xmax / xmin) / Math.log(1 + H / (cps * r));
    return parseInt(Math.round(N));
}

function is_not_set(val) {
    return !val && val != 0;
}

function get_number_from_input(id) {
    var element = document.getElementById(id);
    var value = parseFloat(element.value);
    return value;
}

function set_element_value(id, v) {
    var element = document.getElementById(id);
    element.value = v;
}

function register_events(event_name, func, id_list) {
    for (var i = 0; i < id_list.length; i++) {
        element = document.getElementById(id_list[i]);
        element.addEventListener(event_name, func);

    }
}

function get_axis_name(axis) {
    if (axis == "x1") {
        return "r";
    }
    if (axis == "x2") {
        return "phi";
    }
    if (axis == "x3") {
        if (grid_type == "spherical") {
            return "theta";
        }
        if (grid_type == "cylindrical") {
            return "z";
        }
    }
}


function set_labels_spherical() {
    get_elem("table-row-x1").innerHTML = "r";
    get_elem("table-cps-x1").innerHTML = "r";

    get_elem("table-row-x2").innerHTML = "phi";
    get_elem("table-cps-x2").innerHTML = "phi";

    get_elem("table-row-x3").innerHTML = "theta";
    get_elem("table-cps-x3").innerHTML = "theta";
}

function set_labels_cylindrical() {
    get_elem("table-row-x1").innerHTML = "r";
    get_elem("table-cps-x1").innerHTML = "r";

    get_elem("table-row-x2").innerHTML = "phi";
    get_elem("table-cps-x2").innerHTML = "phi";

    get_elem("table-row-x3").innerHTML = "z";
    get_elem("table-cps-x3").innerHTML = "z";
}

function get_elem(id) {
    return document.getElementById(id);
}


function initialize_value(id) {
    var val = getQueryVariable(id);
    if (val != "") {
        set_element_value(id, val);
    }
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return "";
}

function apply_parameter_values() {
    parameter_accessible.forEach(initialize_value);
    var val = getQueryVariable("spacing-type");
    if (val && val != "") {
        spacing_type = val;
    }
    val = getQueryVariable("grid-type");
    if (val && val != "") {
        grid_type = val;
    }
}

function generate_share_link() {
    var N_params = parameter_accessible.length;
    var param_str = "?grid-type=" + grid_type;
    param_str += "&spacing-type=" + spacing_type;
    for (i = 0; i < N_params; i++) {
        var id = parameter_accessible[i];
        var val = get_number_from_input(id);
        if (val) {
            param_str += "&" + id + "=" + val;
        }
    }
    var url = window.location.href.split('?')[0];
    var link = url + param_str;
    return link;
}

function copy_share_link() {
    var link = generate_share_link();
    copyToClip(link);
}

function copyToClip(str) {
    function listener(e) {
        e.clipboardData.setData("text/html", str);
        e.clipboardData.setData("text/plain", str);
        e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
};

function update_plot() {
    // Assign the specification to a local variable vlSpec.
    var axis = "x1";
    var aspect_ratio = get_number_from_input("aspect-ratio");
    var flaring_index = parseFloat(get_number_from_input("flaring-index"));
    if (!flaring_index) { flaring_index = 0.0; }
    if (!aspect_ratio) {
        return;
    }
    var active_axis = []
    for (var i = 1; i < 4; i++) {
        if (calc_dx(1, "x" + i)) {
            active_axis.push(i);
        }
    }
    var N_axis = active_axis.length;

    var N = get_number_from_input("x1N");
    if (N > 200) { N = 200 }
    var x1min = get_number_from_input("x1min");
    var x1max = get_number_from_input("x1max");
    var vals = new Array(N_axis * N);
    for (var i = 0; i < N; i++) {
        var radius = x1min + (x1max - x1min) / N * i;
        var H = aspect_ratio * Math.pow(radius, 1.0 + flaring_index);
        for (var k = 0; k < N_axis; k++) {
            var axis = "x" + active_axis[k];
            var axis_name = get_axis_name(axis);
            var dx = calc_dx(radius, axis);
            var cps = H / dx;
            vals[N_axis * i + k] = { r: radius, cps: cps, axis: axis_name };
        }
    }
    var vlSpec = {
        $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
        data: {
            values: vals
        },
        mark: 'line',
        encoding: {
            x: { field: 'r', type: 'quantitative' },
            y: { field: 'cps', type: 'quantitative' },
            color: {
                field: "axis", "type": "nominal"
            }
        }
    };

    // Embed the visualization in the container with id `vis`
    vegaEmbed('#vis', vlSpec);
}
