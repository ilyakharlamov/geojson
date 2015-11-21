function zoomrules (z) {
    var kmh;
    switch (z) {
        case 7:
            kmh = 120;
            break;
        case 8:
            kmh = 110;
            break;
        case 9:
            kmh = 100;
            break;
        case 10:
            kmh = 90;
            break;
        case 11:
            kmh = 80;
            break;
        case 12:
            kmh = 70;
            break;
        case 13:
            kmh = 60;
            break;
        case 14:
            kmh = 50;
            break;
        case 15:
            kmh = 40;
            break;
        case 16:
            kmh = 30;
            break;
        case 17:
            kmh = 20;
            break;
        case 18:
            kmh = 10;
            break;
        default:
            kmh = 150;
            break;
    };
    return {
        kmh : kmh
    };
}
exports.zoomrules = zoomrules;