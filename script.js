var button = document.getElementById("button-calc");

button.onclick = calc_cps;

register_events("input", calc_cps, ["domain-extent", "Ncells", "aspect-ratio", "radius"]);
register_events("input", calc_domain_extent, ["xmin", "xmax"])


function calc_cps() {
    var domain_extent = get_number_from_input("domain-extent");
    var number_of_cells = get_number_from_input("Ncells");
    var aspect_ratio = get_number_from_input("aspect-ratio");
    var radius = get_number_from_input("radius");
    if (!domain_extent || !number_of_cells || !aspect_ratio || !radius) {
        set_element_value("cps", null);
        return;
    }
    var cps = aspect_ratio * radius * number_of_cells / domain_extent;
    set_element_value("cps", cps);
}

function calc_domain_extent() {
    var xmin = get_number_from_input("xmin");
    var xmax = get_number_from_input("xmax");
    if (!xmin || !xmax || xmin == xmax) {
        return;
    }
    var extent = Math.abs(xmax - xmin);
    set_element_value("domain-extent", extent);
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