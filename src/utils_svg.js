var _attr = function(elm, name, value) {
    elm.setAttribute(name, value);
}
var _attrs = function(elm, attrsMap) {
    Object.keys(attrsMap).forEach(attrName => _attr(elm, attrName, attrsMap[attrName]));
}
var createSvgElm = function(ele){
    return document.createElementNS("http://www.w3.org/2000/svg", ele); 
}
var _showTianZiGe = function(){
    const width = 1024;
    const height = 1024;
    const color = "#F6E4B8";
    let path1 = createSvgElm("path");
    let path2 = createSvgElm("path");
    
    _attrs(path1, {
        fill: "none",
        stroke: color,
        "stroke-width": 10,
        "stroke-linecap": "round",
        "stroke-dasharray": "15, 25",
        d: `M 5 ${width / 2} L ${height - 5}, ${width / 2}`
    });
    _attrs(path2, {
        fill: "none",
        stroke: color,
        "stroke-width": 10,
        "stroke-linecap": "round",
        "stroke-dasharray": "15, 25",
        d: `M ${height / 2} 5 L ${height / 2}, ${width - 5}`
    });
    const tianZiGeGroup = createSvgElm("g");
    tianZiGeGroup.appendChild(path1);
    tianZiGeGroup.appendChild(path2);
    svg.appendChild(tianZiGeGroup);
}
