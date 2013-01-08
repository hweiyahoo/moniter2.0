/**
 * 格式化 监控设备树节点
 * @param {} nodeId
 * @return {}
 */
function formatNodeId(nodeId) {
   var nodeType = nodeId.split('_')[0];
   var noteInfo = {};
   if (nodeType == 'province') {
   }
   else if (nodeType == 'city') {
   }
   else if (nodeType == 'station') {
      noteInfo.id = nodeId.split('_')[3];
      noteInfo.type = 'host';
      noteInfo.stationid = nodeId.split('_')[1];
   }
   else if (nodeType == 'substation') {
      noteInfo.id = nodeId.split('_')[3];
      noteInfo.type = 'sub'
      noteInfo.stationid = nodeId.split('_')[1];
   }
   else if (nodeType == 'notclass|station') {
      noteInfo.id = nodeId.split('_')[3];
      noteInfo.type = 'notclass'
      noteInfo.stationid = nodeId.split('_')[1];
   }
   return noteInfo;
}

/**
 * 格式化ItemSelector控件value
 * @param {} firstValue
 * @param {} separator
 * @return {}
 */
function formatItemSelectorValue(firstValue, separator) {
   if (separator == null || separator == undefined) {
      separator = ";";
   }
   var separator_ = /\%2C/g;
   firstValue = firstValue.replace(separator_, separator);
   firstValue = firstValue.substring(firstValue.indexOf('=') + 1);
   firstValue = firstValue.substring(0, firstValue.length);
   return firstValue;
}