register_events("input", function (e) { calc_domain_extent(this.id.substring(0, 2)) },
    ["x1min", "x1max", "x2min", "x2max", "x3min", "x3max"]
)
register_events("input", function (e) { calc_cps(this.id.substring(0, 2)) },
    ["x1N", "x1extent", "x1min", "x1max", "x2N", "x2extent", "x2min", "x2max", "x3N", "x3extent", "x3min", "x3max"]
)
register_events("input", calc_cps_all, ["aspect-ratio", "flaring-index", "radius"]
)

var grid_type = "spherical";
register_events("click", function (e) { grid_type = "spherical"; update_selection(); }, ["button-spherical-grid"]);
register_events("click", function (e) { grid_type = "cylindrical"; update_selection(); }, ["button-cylindrical-grid"]);

var spacing_type = "log"
register_events("click", function (e) { spacing_type = "log"; update_selection(); }, ["button-log-spacing"]);
register_events("click", function (e) { spacing_type = "uniform"; update_selection(); }, ["button-uniform-spacing"]);

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


function calc_cps_all() {
    calc_cps("x1");
    calc_cps("x2");
    calc_cps("x3");
}

function calc_cps(axis) {
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