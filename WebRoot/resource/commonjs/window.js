function OpenNewWindow(strUrl, IsMax,widthPx,lengthPx)
{
	if (typeof(widthPx) == "undefined")
	{
		var widthPx=700;
	}
	
	if (typeof(lengthPx) == "undefined")
	{
		var lengthPx=400;
	}
	var strFeatures ="width="+widthPx+",height="+lengthPx+",scrollbars=1,status=1,center=1";
	newwin=window.open("","",strFeatures)
	if(IsMax)
	{
		if (document.all)
		{
		newwin.moveTo(0,0)
		newwin.resizeTo(screen.width,screen.height)
		}
	}
	var intSite=strUrl.lastIndexOf("/")
	newwin.location=strUrl
}
//���ݲ���IsMax�����Ƿ��ȫ������:IsMaxΪtrue��ȫ��
function OpenNewWindow(strUrl, IsMax,widthPx,lengthPx)
{
	if (typeof(widthPx) == "undefined")
	{
		var widthPx=700;
	}
	
	if (typeof(lengthPx) == "undefined")
	{
		var lengthPx=400;
	}
	var strFeatures ="width="+widthPx+",height="+lengthPx+",scrollbars=1,status=1,center=1";
	newwin=window.open("","",strFeatures)
	if(IsMax)
	{
		if (document.all)
		{
		newwin.moveTo(0,0)
		newwin.resizeTo(screen.width,screen.height)
		}
	}
	var intSite=strUrl.lastIndexOf("/")
	newwin.location=strUrl
}
//==========================================================================
//
//  ������������һ���µ���״̬�������������˵�������λ����
//            ���Ըı��С����λ�þ��е��´���
//  
//  ���������pageURL - ��������
//            innerWidth - ������Ҫ���´��ڵĿ��
//            innerHeight - ������Ҫ���´��ڵĸ߶�
//  
//  ���ز�������
//
//  �޸ļ�¼������              ����                 ����
//           wxf            2003/06/24             ����
//
//==========================================================================
function g_OpenSizeWindow(pageURL, innerWidth, innerHeight)
{	
	var ScreenWidth = screen.availWidth
	var ScreenHeight = screen.availHeight
	var StartX = (ScreenWidth - innerWidth) / 2
	var StartY = (ScreenHeight - innerHeight) / 2 - 50
	window.open(pageURL, '', 'left='+ StartX + ', top='+ StartY + ', Width=' + innerWidth +', height=' + innerHeight + ', resizable=yes, scrollbars=yes, status=yes, toolbar=yes, menubar=yes, location=no')

}
//==========================================================================
//
//  ������������һ���µ�û��״̬�������������˵�������λ����
//            ���ܸı��С����λ�þ��е��´���
//  
//  ���������pageURL - ��������
//            innerWidth - ������Ҫ���´��ڵĿ��
//            innerHeight - ������Ҫ���´��ڵĸ߶�
//  
//  ���ز�������
//
//  �޸ļ�¼������              ����                 ����
//           wxf           2003/06/24             ����
//
//==========================================================================
function g_OpenWindow(pageURL, innerWidth, innerHeight)
{	
	var ScreenWidth = screen.availWidth
	var ScreenHeight = screen.availHeight
	var StartX = (ScreenWidth - innerWidth) / 2
	var StartY = (ScreenHeight - innerHeight) / 2
	window.open(pageURL, '', 'left='+ StartX + ', top='+ StartY + ', Width=' + innerWidth +', height=' + innerHeight + ', resizable=no, scrollbars=yes, status=no, toolbar=no, menubar=no, location=no')
}

//==========================================================================
//
//  ������������һ���µ�û��״̬�������������˵�������λ����
//            ���ܸı��С����λ�þ��е��´���
//       
//  
//  ���������pageURL - ��������
//            innerWidth - ������Ҫ���´��ڵĿ��
//            innerHeight - ������Ҫ���´��ڵĸ߶�
//  
//  ���ز��������ص���ֵ
//
//  �޸ļ�¼������              ����                 ����
//            wxf            2003/06/24             ����
//
//==========================================================================
function g_OpenReturnWindow(pageURL, innerWidth, innerHeight)
{	
	var ScreenWidth = screen.availWidth
	var ScreenHeight = screen.availHeight
	var StartX = (ScreenWidth - innerWidth) / 2
	var StartY = (ScreenHeight - innerHeight) / 2
	window.open(pageURL, '', 'left='+ StartX + ', top='+ StartY + ', Width=' + innerWidth +', height=' + innerHeight + ', resizable=no, scrollbars=yes, status=no, toolbar=no, menubar=no, location=no')
	return false
}

function g_OpenReturnWindowNoScrollbars(pageURL, innerWidth, innerHeight)
{	
	var ScreenWidth = screen.availWidth
	var ScreenHeight = screen.availHeight
	var StartX = (ScreenWidth - innerWidth) / 2
	var StartY = (ScreenHeight - innerHeight) / 2
	window.open(pageURL, '', 'left='+ StartX + ', top='+ StartY + ', Width=' + innerWidth +', height=' + innerHeight + ', resizable=no, scrollbars=no, status=no, toolbar=no, menubar=no, location=no')
	//return false
}


//==========================================================================
//
//  ������������һ���µ�û��״̬�������������˵�������λ����
//            ���ܸı��С����λ�þ��е��´���
//  
//  ���������pageURL - ��������
//  
//  ���ز�������
//
//  �޸ļ�¼������              ����                 ����
//            wxf            2003/11/14           ����
//
//==========================================================================
function g_OpenReturnWindowPrint(pageURL)
{	
	var ScreenWidth = screen.availWidth
	var ScreenHeight = screen.availHeight
	//var StartX = (ScreenWidth - innerWidth) / 2
	//var StartY = (ScreenHeight - innerHeight) / 2
	var Win = window.open(pageURL, '','Width=' + ScreenWidth +', height=' + ScreenHeight + ', resizable=no, scrollbars=no, status=no, toolbar=no, menubar=no, location=no, left=0, top=0')
	Win.moveTo(99999,99999)	
	return false
}



//==========================================================================================
//
// ������������ģʽ���ں�������һ��ģʽ���ڲ������˵���״̬��������������λ��
//
// ���������pageURL - ��������
//            innerWidth - ������Ҫ���´��ڵĿ��
//            innerHeight - ������Ҫ���´��ڵĸ߶�
// ���ز�������
//
// �޸ļ�¼������                ����                 ����
//           wxf             2003/06/25              ����
//
//==========================================================================================
function g_OpenModalWindow(pageURL, innerWidth, innerHeight)
{
	window.showModalDialog(pageURL, null, 'dialogWidth:' + innerWidth + 'px;dialogHeight:' + innerHeight + 'px;help:no;unadorned:no;resizable:no;status:no')
}

//==========================================================================================
//
// ������������ģʽ���ں�������һ��ģʽ���ڲ������˵���״̬��������������λ�������ҷ��ز���
//
// ���������pageURL - ��������
//            innerWidth - ������Ҫ���´��ڵĿ��
//            innerHeight - ������Ҫ���´��ڵĸ߶�
// ���ز�������
//
// �޸ļ�¼������                ����                 ����
//           wxf             2003/06/25               ����
//
//==========================================================================================
function g_OpenModalReturnWindow(pageURL, innerWidth, innerHeight)
{
	var ReturnValue = window.showModalDialog(pageURL, 'newWindows', 'dialogWidth:' + innerWidth + 'px;dialogHeight:' + innerHeight + 'px;help:no;unadorned:no;resizable:no;status:no');
	return ReturnValue;
}

//==========================================================================================
//
// ��������������returnValue
//
// ���������
// ���ز�����ҳ�淵��ֵ
//
// �޸ļ�¼������                ����                 ����
//           wxf             2005/06/25               ����
//
//==========================================================================================
function g_ReturnValue()
{
	var ReturnValue = window.returnValue;
	window.close ();
	return ReturnValue;
}

//==========================================================================================
//
// ������������ģʽ���ں�������һ��ģʽ���ڲ������˵���״̬��������������λ��
//
// ���������pageURL - ��������
//            innerWidth - ������Ҫ���´��ڵĿ��
//            innerHeight - ������Ҫ���´��ڵĸ߶�
// ���ز�������
//
// �޸ļ�¼������                ����                 ����
//           wxf             2003/06/25              ����
//
//==========================================================================================
function g_OpenReturnModalWindow(pageURL, innerWidth, innerHeight)
{
	window.showModalDialog(pageURL, null, 'dialogWidth:' + innerWidth + 'px;dialogHeight:' + innerHeight + 'px;help:no;unadorned:no;resizable:no;status:no');
	return false;
}

//==========================================================================================
//
// ������������ȫ����IE
//
// �����������
//
// ���ز�������
//
// �޸ļ�¼������                      ����                       ����
//           wxf                    2005/05/9                    ����
//
//==========================================================================================

function OpenFullSrceenForm(url)
{
	var newpage = window.open('index.htm','','toolbar=no,status=no,resizable=no,scrollbars=no'); 
	newpage.moveTo(0,0);
	newpage.resizeTo(screen.availWidth,screen.availHeight);
	newpage.focus();
	newpage.opener = null;
	window.close ();
	return true;
} 
//==========================================================================================
//
// �����������رմ���
//
// �����������
//
// ���ز�������
//
// �޸ļ�¼������                      ����                       ����
//           wxf                    2003/06/24                   ����
//
//==========================================================================================
function g_CloseWindow()
{
	window.close()
	return false
}
//==========================================================================================
//
// ������������ȫ������
//
// �����������
//
// ���ز�������
//
// �޸ļ�¼������                      ����                       ����
//           wxf                    2003/06/24                   ����
//
//==========================================================================================
function OpenScreenWindow(path)
{
	var newpage = window.open(path,'','toolbar=no,status=1,resizable=no,scrollbars=no'); 
	newpage.moveTo(0,0);
	newpage.resizeTo(screen.availWidth,screen.availHeight);
	newpage.focus();
	window.opener = null;
	window.close();
}
//==========================================================================================
//
// ����������ȥ�ո�
//
// �����������
//
// ���ز�������
//
// �޸ļ�¼������                      ����                       ����
//           xb                    2006/05/24                   ����
//
//==========================================================================================
String.prototype.trim = function()
{
    return this.replace(/(^\s*)|(\s*$)/g, "");
}


function ConfrimForm (ConfrimMessage,Action,Form)
{
   if (confirm (ConfrimMessage)) 
   {
		Form.action = Action;
		Form.submit();	
        return true;
   } 
   else 
   {
      return false;
     }
}

function jsLTrim(str)
{
	var rtnStr;
	rtnStr=""
	for (var i = 0; i < str.length; i ++)
	{
		if (str.charAt(i) != " ")
		{
			rtnStr = str.substr(i);
			break;
		}
	}
	return rtnStr;
}


function jsRTrim(str)
{
	var rtnStr;
	rtnStr = ""
	for (var i = str.length-1; i >= 0; i --)
	{
		if (str.charAt(i) != " ")
		{
			rtnStr = str.substring(0,i+1);
			break;
		}
	}
	return rtnStr;
}


function Trim(str)
{
	return(jsLTrim(jsRTrim(str)));
}

//gaoliang
function highlight(obj){
        var hightlightBgColor = '#F0F2DC'; //
		
        obj.onmouseover = function(){
                var o = event.srcElement;
                if(o.tagName == "TD"){
                        o.parentElement.style.backgroundColor = hightlightBgColor;
                }
        }
        
        obj.onmouseout = function(){
                var o = event.srcElement;
                if(o.tagName=="TD"){
                        o.parentElement.style.backgroundColor = '';
                        o.parentElement.height = "";
                }
        }
}

function checkNum(){
	if(event.keyCode < 45 || event.keyCode > 57){
		alert("ֻ������������!!");
		event.returnValue = false;
	}
}
/*��ѡ�Ͷ�ѡ*/
function checkAll(e, itemName)
{
  var aa = document.getElementsByName(itemName);
  for (var i=0; i<aa.length; i++)
   aa[i].checked = e.checked;
}
function checkItem(e, allName)
{
  var all = document.getElementsByName(allName)[0];
  if(!e.checked) all.checked = false;
  else
  {
    var aa = document.getElementsByName(e.name);
    for (var i=0; i<aa.length; i++)
     if(!aa[i].checked) return;
     all.checked = true;
  }
}


//�ַ����滻������str-��������ַ�����oldValue-Ҫ�滻���Ӵ���newValue-�滻���Ӵ���sw-�滻����ѡ��
//�����滻����ַ���
function StringReplace(str, oldValue, newValue, sw)
{
    if (typeof(sw) == "undefined")  sw = "gi";
    if (typeof(oldValue) == "undefined")  oldValue = "";
    if (typeof(newValue) == "undefined")  newValue = "";
    
    var re = new RegExp(oldValue+"", sw+"");
    
    return (str+"").replace(re, newValue+"");
}

//����׼��ʽ�������ַ���תΪ���ڶ���yyyy-mm-dd
function StrToDate(sDate)
{
    var aDate = sDate.split("-");
    if (aDate.length != 3)
        return;
        
    var y = aDate[0], m = aDate[1], d = aDate[2];
    //תΪmm-dd-yyyy
    aDate[0] = m;    
    aDate[1] = d;    
    aDate[2] = y;    
    return new Date(aDate.join("-"))
}
//����׼��ʽ�������ַ���תΪ���ڶ���yyyy-mm-dd
function StrToDateTime(sDate)
{
    var aDateTime = sDate.split(" ");
    if (aDateTime.length != 2)
        return;

    var aDate = aDateTime[0].split("-");
    if (aDate.length != 3)
        return;
        
    var aTime = aDateTime[1].split(":");
    if (aTime.length != 3)
        return false;

    var date = new Date(aDate[0], aDate[1]-1, aDate[2], aTime[0], aTime[1], aTime[2]);

    return date;
}
//�����ڶ���תΪ��׼��ʽ�������ַ���yyyy-mm-dd
function DateToStr(date)
{
    var yy = date.getFullYear();  
    var mm = date.getMonth()+1;
    if (mm<10) mm = "0" + mm;     
    var dd = date.getDate();  
    if (dd<10) dd = "0" + dd;
        
    return "" + yy + "-" + mm + "-" +dd;
}
//�����ڶ���תΪ��׼��ʽ�������ַ���yyyy-mm-dd hh:mi:ss
function DateTimeToStr(date)
{
    var yy = date.getFullYear();  
    var mm = date.getMonth()+1;
    if (mm<10) mm = "0" + mm;     
    var dd = date.getDate();  
    if (dd<10) dd = "0" + dd;
       
	var hh = date.getHours();  
	var mi = date.getMinutes();   
	var ss = date.getSeconds();  

    return "" + yy + "-" + mm + "-" +dd + " " + hh + ":"+ mi + ":"+ ss ;
}
//���ڱȽϣ������ǰ�棬DiffWhat��Y��M��D��H
function DateDiff(Date1, Date2, DiffWhat)
{
    var Diff = Date1 - Date2;

    var MinMilli = 1000 * 60;
    var HrMilli = MinMilli * 60;
    var DyMilli = HrMilli * 24;

    if (DiffWhat == "H")
    {
        Diff = Math.ceil(Math.abs(Diff / HrMilli));
        return Diff;
    }
    
    Diff = Math.ceil(Math.abs(Diff / DyMilli));
    
    if (DiffWhat == "D")
        return Diff;
      
    y1 = Date1.getFullYear();  
    m1 = Date1.getMonth()+1;  
    d1 = Date1.getDate();  

    y2 = Date2.getFullYear();  
    m2 = Date2.getMonth()+1;  
    d2 = Date2.getDate();  
        
    if (DiffWhat == "M")
    {
        Diff = (y1-y2)*12 + (m1-m2);
        if (d1 > d2)
            Diff += 1;
        return Diff;
    }
        
    if (DiffWhat == "Y")
    {
        Diff = (y1-y2);
        if (m1 > m2)
            Diff += 1;
        else
        {
            if ((m1 == m2) && (d1 > d2))
                Diff += 1;
        }
        
        return Diff;
    }    
}

//���ڱȽϣ������ǰ�棬DiffWhat��Y��M��D��H
function DateDifference(Date1, Date2, DiffWhat)
{
    var Diff = Date1 - Date2;

    var MinMilli = 1000 * 60;
    var HrMilli = MinMilli * 60;
    var DyMilli = HrMilli * 24;

    if (DiffWhat == "H")
    {
        Diff = Math.ceil(Diff / HrMilli);
        return Diff;
    }
    
    Diff = Math.ceil(Diff / DyMilli);
    
    if (DiffWhat == "D")
        return Diff;
      
    y1 = Date1.getFullYear();  
    m1 = Date1.getMonth()+1;  
    d1 = Date1.getDate();  

    y2 = Date2.getFullYear();  
    m2 = Date2.getMonth()+1;  
    d2 = Date2.getDate();  
        
    if (DiffWhat == "M")
    {
        Diff = (y1-y2)*12 + (m1-m2);
        if (d1 > d2)
            Diff += 1;
        return Diff;
    }
        
    if (DiffWhat == "Y")
    {
        Diff = (y1-y2);
        if (m1 > m2)
            Diff += 1;
        else
        {
            if ((m1 == m2) && (d1 > d2))
                Diff += 1;
        }
        
        return Diff;
    }    
}

//�ж��ַ����Ƿ�������(yyy-mm-dd)
function isDate(str)
{
    try
    {
        var aDate = str.split("-");
        if (aDate.length != 3)
            return false;

        var date = StrToDate(str);
        
        var yy = date.getFullYear();  
        var mm = date.getMonth()+1;   
        var dd = date.getDate();  
        //alert(str + " " + yy+"-"+mm+"-"+dd);
        
        if (aDate[0] != yy)
            return false;
        if (aDate[1] != mm)
            return false;
        if (aDate[2] != dd)
            return false;
        
        //alert(true);
        return true;
    }
    catch(e)
    {
        return false;
    }
}
//�ж��ַ����Ƿ�������(yyy-mm-dd hh:MM:ss)
function isDateTime(str)
{
    try
    {
        var aDateTime = str.split(" ");
        if (aDateTime.length != 2)
            return false;

        if (!isDate(aDateTime[0]))
        {
           return false;
        }
            
        var aTime = aDateTime[1].split(":");
        if (aTime.length != 3)
            return false;

        var aDate = aDateTime[0].split("-");
        var date = new Date(aDate[0], aDate[1], aDate[2], aTime[0], aTime[1], aTime[2]);
        
        var hh = date.getHours();  
        var MM = date.getMinutes();   
        var ss = date.getSeconds();  
        //alert(hh+":"+MM+":"+ss);
        
        if (aTime[0] != hh)
            return false;
        if (aTime[1] != MM)
            return false;
        if (aTime[2] != ss)
            return false;
        
        return true;
    }
    catch(e)
    {
        return false;
    }
}

function flexNode(dvID)//��չ�ڵ�
	{
		if (document.all("dv"+dvID).style.display =="none")
		{
			document.all("th"+dvID).style.display = "";
			document.all("dv"+dvID).style.display = "";
			document.all("tabchildtd"+dvID).background = document.all("sbg"+dvID).value;
		} 
		else 
		{
			document.all("th"+dvID).style.display = "none";
			document.all("dv"+dvID).style.display="none";
			document.all("tabchildtd"+dvID).background = document.all("bg"+dvID).value;
		}
	}
	function setbg(whichtd)//����TD����
	{
		var s
		
		for(var i=0;i<document.all.length;i++)
		{
			s=document.all(i).id;
			if (s.substr(0,2)=="td") document.all(i).background=document.all("bg"+s.substr(2)).value;
		}
		s=whichtd.id;
		document.all(s).background=document.all("sbg"+s.substr(2)).value;
		window.parent.main.location=document.all("url"+s.substr(2)).value;
	}
	
	//==========================================================================================
//
// �����������ж����ڵĴ�С,end���ڵ���beginʱ�򷵻�true
//
// �����������
//
// ���ز�������
//
// �޸ļ�¼������                      ����                       ����
//                              2007/06/25                 ����
//
//==========================================================================================

function dateNew(begin,end){
	if(begin==0||end==0||begin==""||end==""){return true;}
	if(end>begin){
		return true;
	}else{
		return false;
	}
}

function dateTrust(begin,end){
	//begin =  StringToDate(begin);
	//end = StringToDate(end);
	if(begin==0||end==0||begin==""||end==""){return true;}
	if(end>=begin){
		return true;
	}else{
		return false;
	}

}

	//�ַ���ת��Ϊ����
	function StringToDate(DateStr)   
	{
   		 var converted = Date.parse(DateStr);   
    	var myDate = new Date(converted);   
   		 if (isNaN(myDate))   
    	{    
        //var delimCahar = DateStr.indexOf('/')!=-1?'/':'-';   
        var arys= DateStr.split('-');   
        myDate = new Date(arys[0],--arys[1],arys[2]);   
    	}   
  	  return myDate;   
	}   
//==========================================================================================
//
// ������������ؼ�   Ctrl+1 ����. /  Ctrl+2   �޸�  /  Ctrl+3   ɾ��     /Ctrl+4 ˢ��
//					Ctrl+ s  ����	/  Ctrl+ d   ����
//
// �����������
//
// ���ز�������
//
// �޸ļ�¼������                      ����                       ����
//           hyj                   2007/07/03                ����
//
//==========================================================================================	
	function akey()
	{
		if(event.ctrlKey)
		{ 
			if(event.keyCode==97)   //Ctrl+1 
			{
				try
				{
					document.all("btnAdd").click();
				}
				catch(e)
				{
					alert(e);
				}
			}
			if(event.keyCode==98)
			{
				try
				{
				document.all("btnEdit").click();
				//alert("�޸�!");				
				}
				catch(e)
				{
					alert(e);
				}

			}
			if(event.keyCode==99)
			{
				try
				{	
					document.all("btnDel").click();
				//alert("ɾ��!");
				}
				catch(e)
				{
					alert(e);
				}
			}
			if(event.keyCode==100)
			{
				try
				{
					document.all("btnReload").click();
				}
				catch(e)
				{
						alert(e);
				}
				//alert("ˢ��!");
			}
			
			if(event.keyCode==83)
			{
				try
				{
					document.all("btnSave").click();
				}
				catch(e)
				{
						alert(e);
				}
				//alert("����!");
			}
           	if(event.keyCode==68)
			{
				try
				{
					document.all("btnReturn").click();
				}
				catch(e)
				{
						alert(e);
				}
				//alert("����!");
			}
			   if(event.keyCode==68)
			{
				try
				{
					document.all("btnReturn").click();
				}
				catch(e)
				{
						alert(e);
				}
				//alert("����!");
			}           
           }  
       } 
       
//==========================================================================================
//
// �����������ж��ı���ʹ��ı��ĳ���
//
// ���������������ѡ��
//
// ���ز�����������������ı�
//
// �޸ļ�¼������                      ����                       ����
//          ���վ�                    2007/07/12                ����
//
//==========================================================================================  
	function getselectText(obj)
		{
		   
		    for(var i=0;i<obj.options.length;i++)
		    {
		    	var option = obj.options[i];
		    	if(option.selected)
		    	{
		    		return option.text;
		    		
		    	}
		    }
		}
  //==========================================================================================
//
// �����������ж��ı���ʹ��ı��ĳ���
//
// �����������
//
// ���ز�������
//
// �޸ļ�¼������                      ����                       ����
//                              2007/07/7                ����
//
//========================================================================================== 
String.prototype.len=function(){  
return this.replace(/[^\x00-\xff]/g,"**").length;  
}  
 
//Set maxlength for multiline TextBox  
function setMaxLength(object,length)  
{ 
     
    var result = true;  
    var controlid = document.selection.createRange().parentElement().id;  
    var controlValue = document.selection.createRange().text;  
    var tempString=object.value; 
     
    var tt="";  
    for(var i=0;i<length;i++)  
        {  
            if(tt.len()<length)  
                tt=tempString.substr(0,i+1);  
            else  
                break;  
        }  
    if(tt.len()>length) 
        tt=tt.substr(0,tt.length-1); 
    object.value=tt; 
     
     
}  
 
//Check maxlength for multiline TextBox when paste  
function limitPaste(object,length)  
{  
        var tempLength = 0;  
        if(document.selection)  
        {  
            if(document.selection.createRange().parentElement().id == object.id)  
            {  
                tempLength = document.selection.createRange().text.len();  
            }  
        }  
        var tempValue = window.clipboardData.getData("Text");  
        tempLength = object.value.len() + tempValue.len() - tempLength;  
 
        if (tempLength > length)  
        {  
            tempLength -= length;  
            var tt="";  
            for(var i=0;i<tempValue.len()-tempLength;i++)  
                {  
                    if(tt.len()<(tempValue.len()-tempLength))  
                        tt=tempValue.substr(0,i+1);  
                    else  
                        break;  
                }  
            if(tt.len()<=0) 
            {     
                window.event.returnValue=false; 
                 
            } 
            else 
            { 
                tempValue=tt;  
                window.clipboardData.setData("Text", tempValue);  
                window.event.returnValue = true;  
            } 
        }  
     
 
}  
 
function PressLength() 
{ 
     
    if(event.srcElement.type=="text" || event.srcElement.type=="textarea" ) 
    { 
        if(event.srcElement.length!=null) 
            setMaxLength(event.srcElement,event.srcElement.length); 
         
    } 
} 
 
function LimitLength() 
{ 
 
    if(event.srcElement.type=="text" || event.srcElement.type=="textarea" ) 
    { 
        if(event.srcElement.length!=null) 
            limitPaste(event.srcElement,event.srcElement.length); 
    } 
} 
document.documentElement.attachEvent('onkeyup', PressLength);  
document.documentElement.attachEvent('onpaste', LimitLength); 

//�Ƚ�����,���date1<date2����-1,date1=date2����0,date1>date2����1
function compareDate(date1,date2){
	if(!date1 && !date2){
		return 0;
	}
	else if(!date1){
		return 1;
	}
	else if(!date2){
		return -1;
	}
	var type1 = typeof(date1);
	if(type1=="string"){ //��ʽ������yyyy-MM-dd
		var parts = date1.split("-");
		date1 = new Date(parts[0],parts[1],parts[2]);
	}
	else if(type1=="number") {
		date1 = new Date(date1);
	}
	var type2 = typeof(date2);
	if(type2=="string"){//��ʽ������yyyy-MM-dd
		var parts = date2.split("-");
		date2 = new Date(parts[0],parts[1],parts[2]);
	}
	else if(type2=="number") {
		date2 = new Date(date2);
	}
	ts = date2.getTime()-date1.getTime();
	if(ts>0)
		return -1;
	else if(ts<0)
		return 1;
	else
	    return 0;
}
  //==========================================================================================
//
// ������������������ʽ����EMAIL��URL
//
// �����������
//
// ���ز�������
//
// �޸ļ�¼������                      ����                       ����
//                              2007/07/7                ����
//
//========================================================================================== 
	//���� email
	function Chk_Email(txt_Email){
	 var Email = txt_Email;
	 var re = new RegExp(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/);
 	if (!re.test(Email)){
 	 return false;
 	} else {
 	 return true;
	 }
 
	}
	//����URL
	function Chk_Url(txt_Url){
 		var Url = txt_Url;
		 var re = new RegExp(/^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/);
	 if (!re.test(Url)){
 	 return false;
 	} else {
  	return true;
 	}
 	}
//==========================================================================================
//
// ��������������Ȩ������
//
// �����������
//
// ���ز�������
//
// �޸ļ�¼������                      ����                       ����
//                              2007/08/22                ����
//
//========================================================================================== 
 	function dealRight(document,colidlist){	
	document.all.addbtn.style.display = 'none';
	document.all.delbtn.style.display = 'none';
	var len = document.all.tabright.rows.length;  
	var colid = colidlist.split(",");    
    for (var i = 0 ; i < len ; i ++)
    {
    	for(var j=0; j<colid.length; j++){
    		document.all.tabright.rows[i].cells[colid[j]].style.display = "none";
    	}

     }
}
