register_events("input", function (e) { calc_domain_extent(this.id.substring(0, 2)) },
    ["x1min", "x1max", "x2min", "x2max", "x3min", "x3max"]
)
register_events("input", function (e) { calc_cps(this.id.substring(0, 2)) },
    ["x1N", "x1extent", "x1min", "x1max", "x2N", "x2extent", "x2min", "x2max", "x3N", "x3extent", "x3min", "x3max"]
)
register_events("input", calc_cps_all, ["aspect-ratio", "flaring-index", "radius"]
)

var grid_type = "spherical";
register_events("click", function (e) { grid_type = "spherical"; set_labels_spherical(); set_grid_description(); calc_cps_all(); }, ["button-spherical-grid"]);
register_events("click", function (e) { grid_type = "cylindrical"; set_labels_cylindrical(); set_grid_description(); calc_cps_all(); }, ["button-cylindrical-grid"]);

var spacing_type = "log"
register_events("click", function (e) { spacing_type = "log"; set_grid_description(); calc_cps_all(); }, ["button-log-spacing"]);
register_events("click", function (e) { spacing_type = "uniform"; set_grid_description(); calc_cps_all(); }, ["button-uniform-spacing"]);


function calc_cps_all() {
    calc_cps("x1");
    calc_cps("x2");
    calc_cps("x3");
}

function calc_cps(axis) {
    var domain_extent = get_number_from_input(axis + "extent");
    var number_of_cells = get_number_from_input(axis + "N");
    var aspect_ratio = get_number_from_input("aspect-ratio");
    var radius = get_number_from_input("radius");
    if (!domain_extent || !number_of_cells || !aspect_ratio || !radius) {
        set_element_value(axis + "cps", null);
        return;
    }
    var H = aspect_ratio * radius;
    var dx = calc_dx(radius, axis);
    var cps = H / dx;
    set_element_value(axis + "cps", cps);
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
    if (!xmin || !xmax || xmin == xmax) {
        return;
    }
    var extent = Math.abs(xmax - xmin);
    set_element_value(axis + "extent", extent);
}

function get_number_from_input(id) {
    var element = document.getElementById(id);
    var value = element.value;
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



function set_labels_spherical() {
    get_elem("label-x1N").innerHTML = "N r";
    get_elem("label-x1min").innerHTML = "r min";
    get_elem("label-x1max").innerHTML = "r max";
    get_elem("label-x1extent").innerHTML = "r extent";
    get_elem("label-x1cps").innerHTML = "cps r";

    get_elem("label-x2N").innerHTML = "N phi";
    get_elem("label-x2min").innerHTML = "phi min";
    get_elem("label-x2max").innerHTML = "phi max";
    get_elem("label-x2extent").innerHTML = "phi extent";
    get_elem("label-x2cps").innerHTML = "cps phi";

    get_elem("label-x3N").innerHTML = "N theta";
    get_elem("label-x3min").innerHTML = "theta min";
    get_elem("label-x3max").innerHTML = "theta max";
    get_elem("label-x3extent").innerHTML = "theta extent";
    get_elem("label-x3cps").innerHTML = "cps theta";
}

function set_labels_cylindrical() {
    get_elem("label-x1N").innerHTML = "N r";
    get_elem("label-x1min").innerHTML = "r min";
    get_elem("label-x1max").innerHTML = "r max";
    get_elem("label-x1extent").innerHTML = "r extent";
    get_elem("label-x1cps").innerHTML = "cps r";

    get_elem("label-x2N").innerHTML = "N phi";
    get_elem("label-x2min").innerHTML = "phi min";
    get_elem("label-x2max").innerHTML = "phi max";
    get_elem("label-x2extent").innerHTML = "phi extent";
    get_elem("label-x2cps").innerHTML = "cps phi";

    get_elem("label-x3N").innerHTML = "N z";
    get_elem("label-x3min").innerHTML = "z min";
    get_elem("label-x3max").innerHTML = "z max";
    get_elem("label-x3extent").innerHTML = "z extent";
    get_elem("label-x3cps").innerHTML = "cps z";
}


function set_grid_description() {
    get_elem("description-grid").innerHTML =
        grid_type + " grid with " + spacing_type + " spacing";
}

function get_elem(id) {
    return document.getElementById(id);
}