<!-- 生成marker对象 -->
	var initPoint = "108.85636, 33.93572";
    var maplet = null;// 地图对象
    var marker = null;// 标记对象
    var le = 2;// 缩放级别
    var myEventListener = null;// 地图click事件句柄
	var updateModel = null;

      maplet = new Maplet("mapbar");
      // 初始化全国地图
      goInitArea();
      // 显式鱼骨工具
      // maplet.addControl(new MStandardControl());
      // 设置鱼骨工具位子
      // maplet.controlCanvas.setLocation({type : eval("Maplet.RIGHT_TOP")});
      // 设置鹰眼位子
      maplet.setOverviewLocation({
         type : eval("Maplet.RIGHT_TOP")
      });
      // 隐藏缩放面板-可用，最小化
      maplet.showOverview(true, false);
      // 初始化当前中心位子
      // Ext.getCmp('pid').setValue(maplet.getCenter().pid);
      // 添加鼠标点击地图，获取经纬度方法
      myEventListener = MEvent.bind(maplet, "click", this, getClickPointJWD);
	  
#foreach($point in $pointInfoList)
    var marker_${point.repeaterid} = new MMarker(new MPoint('${point.pid}'),
                                                    new MIcon("./resource/image/nms/mark.gif",24, 24),
                                                    null,
                                                    new MLabel('${point.stationname}'));
#end
#foreach($point in $pointInfoList)
	maplet.addOverlay(marker_${point.repeaterid});
#end