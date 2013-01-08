Ext.namespace("complete");

complete.complete=function(str,str1,length){
	if(str.toString().length>=length){
		//alert("xxx");
		return str;
	}
	else{
		var diff=length-str.toString().length;
		var temp;
		for(i=0;i<diff;i++){
			temp=str1+str;
		}
		//alert(temp);
		return temp;
	}
}