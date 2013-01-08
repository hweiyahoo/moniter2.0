var ${code}Store = new Ext.data.SimpleStore({
  fields : ['value', 'text'],
  data : [
  #set($size = $codeList.size())
  #foreach($code in $codeList)
      #if($velocityCount == $size)
        ['${code.value}', '${code.text}']
	  #else
		['${code.value}', '${code.text}'],
      #end
  #end
  ]
});