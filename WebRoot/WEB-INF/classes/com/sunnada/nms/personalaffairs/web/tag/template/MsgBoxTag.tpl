<!-- 由标签生成的代码 -->
		<table border="0" width="100%" height="100%">
			#set($isShow = 0)
			#foreach($notice in $noticeList)
			#set($isShow = 1)
			<tr>
				<td width="50%">
					<b>${notice.type_name}</b>
				</td>
				<td width="20%">
					<font color='red'>${notice.stats}</font> 条
				</td>
				<td width="30%">
					<div id="${notice.type_code}Detail">
						<a href="javascript:void(0);">详情</a>
					</div>
				</td>
			</tr>
			#end
			#if(${isShow}!=1)
			<tr>
				<td width="100%" align="center">
					<b>无消息</b>
				</td>
			</tr>
			#end
		</table>
			