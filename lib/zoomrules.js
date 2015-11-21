function zoomrules (z) {
    var kmh;
    var clazz;
    switch (z) {
        case 7:
            kmh = 130;
            clazz = 4;
            break;
        case 8:
            kmh = 110;
            clazz = 5;
            break;
        case 9:
            kmh = 100;
            clazz = 6;
            break;
        case 10:
            kmh = 90;
            clazz = 8;
            break;
        case 11:
            kmh = 80;
            clazz = 10;
            break;
        case 12:
            kmh = 70;
            clazz = 12;
            break;
        case 13:
            kmh = 60;
            clazz = 20;
            break;
        case 14:
            kmh = 50;
            clazz = 40;
            break;
        case 15:
            kmh = 40;
            clazz = 50;
            break;
        case 16:
            kmh = 30;
            clazz = 60;
            break;
        case 17:
            kmh = 20;
            clazz = 80;
            break;
        case 18:
            kmh = 10;
            clazz = 90;
            break;
        default:
            kmh = 150;
            clazz = 3;
            break;
    };
    return {
        kmh : kmh,
        clazz : clazz
    };
}
exports.zoomrules = zoomrules;