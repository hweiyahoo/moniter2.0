<!-- 由标签生成的代码 -->
		<form id="form">
			<div style="width: ${cmpwidth}px;" class=" x-panel x-grid-panel">
			<div class="x-panel-tl">
				<div class="x-panel-tr">
					<div class="x-panel-tc">
						<div style="-moz-user-select: none;" id="ext-gen11" class="x-panel-header x-unselectable x-panel-icon icon-grid">
							<span class="x-panel-header-text">状态信息设置</span>
						</div>
					</div>
				</div>
			</div>
			<div class="x-panel-bwrap">
				<div class="x-panel-ml">
					<div class="x-panel-mr">
						<div class="x-panel-mc">
							#set($width = ${cmpwidth} - 12)
							<div style="width: ${width}px;" class="x-panel-tbar">
								#set($width = ${cmpwidth} - 18)
								<div style="width: ${width}px;" class="x-toolbar x-small-editor x-toolbar-layout-ct">
									<table class="x-toolbar-ct" cellspacing="0">
										<tbody>
											<tr>
												<td class="x-toolbar-left" align="left">
													<table cellspacing="0">
														<tbody>
															<tr class="x-toolbar-left-row">
																<td class="x-toolbar-cell">
																	<div class="x-btn x-btn-text-icon">
																		<input type="checkbox" value="1" id="isoper" checked />是否允许操作
																	</div>
																</td>
																<td class="x-toolbar-cell">
																	<span class="xtb-sep"></span>
																</td>
																<td class="x-toolbar-cell">
																	<div class="x-btn x-btn-text-icon">
																		<input type="button" value="实时查询" id="btn_query" />
																	</div>
																</td>
																<td class="x-toolbar-cell">
																	<span class="xtb-sep"></span>
																</td>
																<td class="x-toolbar-cell">
																	<div class="x-btn x-btn-text-icon">
																		<input type="button" value="实时保存" id="btn_save" />
																	</div>
																</td>
																<td class="x-toolbar-cell">
																	<span class="xtb-sep"></span>
																</td>
																<td class="x-toolbar-cell">
																	<div class="x-btn x-btn-text-icon">
																		<input type="button" value="实时设置" id="btn_submit" />
																	</div>
																</td>
																<td class="x-toolbar-cell">
																	<span class="xtb-sep"></span>
																</td>
																<td class="x-toolbar-cell">
																	<div class="x-btn x-btn-text-icon">
																		<input type="checkbox"  id="reflesh_ckb"  #if(${isautoreflesh}=="1") checked #end/>自动
                                                						<input type="text" value="${invaltime}" id="invaltime" style="width:30px" title="系统默认20秒" onkeyup="replaceChar(this);" />
                                                						秒刷新列表【 <font color='red'><label id="time_div">${invaltime}</label></font> 】
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							#set($width = ${cmpwidth} - 14)
							#set($height = ${cmpheight} - 63)
							<div style="width: ${width}px; height: ${height}px;" class="x-panel-body">
								<div style="width: ${width}px; height: ${height}px;" class="x-grid3" hidefocus="true">
									<div class="x-grid3-viewport">
										<div class="x-grid3-header">
											<div style="width: ${width}px;" class="x-grid3-header-inner">
												#set($width = ${cmpwidth} - 15)
												<div style="width: ${width}px;" class="x-grid3-header-offset">
													#set($width = ${cmpwidth} - 33)
													<table style="width: ${width}px;" border="0" cellpadding="0" cellspacing="0">
														<thead>
															<tr class="x-grid3-hd-row">
																<td style="width: 25px;">
																	<div class="x-grid3-hd-inner x-grid3-hd-numberer">
																		No
																	</div>
																</td>
																<td style="width: 18px;" class="x-grid3-td-checker">
																	<div class="x-grid3-hd-numberer">
																			<input type="checkbox" id="selectAll" title="全选/反选" />
																	</div>
																</td>
																<td style="width: ${cmpwidth_1}px;">
																	<div class="x-grid3-hd-inner " >
																		参数名称																		
																	</div>
																</td>
																<td style="width: ${cmpwidth_2}px;">
																	<div class="x-grid3-hd-inner " >
																		当前状态																	
																	</div>
																</td>
																<td style="width: ${cmpwidth_3}px;">
																	<div class="x-grid3-hd-inner " >
																		告警使能																
																	</div>
																</td>
																<td style="width: ${cmpwidth_4}px;">
																	<div class="x-grid3-hd-inner " >
																		远程值																		
																	</div>
																</td>
																<td style="width: ${cmpwidth_5}px;">
																	<div class="x-grid3-hd-inner " >
																		更新时间																		
																	</div>
																</td>
															</tr>
														</thead>
													</table>
												</div>
											</div>
											<div class="x-clear"></div>
										</div>
										#set($width = ${cmpwidth} - 14)
										#set($height = ${cmpheight} - 86)
										<div style="overflow-x: hidden;width: ${width}px; height: ${height}px;" class="x-grid3-scroller">
											#set($width = ${cmpwidth} - 33)
											<div style="width: ${width}px;" class="x-grid3-body" >
											#foreach($bean in $beanList)
												<div style="width: ${width}px;" class="x-grid3-row x-grid3-row-first" >
													<table style="width: ${width}px;" border="0" cellpadding="0" cellspacing="0">
														<tbody>
															<tr>
																<td style="width: 25px;">
																	<div class="x-grid3-cell-inner x-grid3-td-numberer">
																		${velocityCount}
																	</div>
																</td>
																<td style="width: 18px;" class="x-grid3-td-checker">
																		<input type="checkbox" id="ckb_${bean.recid}_${velocityCount}" name="selects" value="${bean.recid}_${bean.paramcode}" hasEditor="${bean.editortype}" validatClass="required"/>
																</td>
																<td style="width: ${cmpwidth_1}px;">
																	<div class="x-grid3-cell-inner ">
																		&nbsp;${bean.paramname}
																	</div>
																</td>
																<td style="width: ${cmpwidth_2}px;">
                                    								#if(${bean.rval1}=="" || ${bean.rval1}=="0") 
                                    									<font color="green">正常</font>
                                    								#elseif(${bean.rval1}=="1")
                                    									<font color="red">告警</font>
                                    								#end
																	</div>
																</td>
																<td style="width: ${cmpwidth_3}px;" id="td_item">
																	<div class="x-grid3-cell-inner ">
																		<input type="hidden" name="h_val1" value="${bean.val1_able}" />
                                        								<input type="radio" id="radio_${bean.recid_able}_${bean.paramcode_able}_${velocityCount}" name="val1_able_${velocityCount}" value="1" #if(${bean.val1_able}=="1") checked #end/>允许
                                        								<input type="radio" id="radio_${bean.recid_able}_${bean.paramcode_able}_${velocityCount}" name="val1_able_${velocityCount}" value="0" #if(${bean.val1_able}=="0" || ${bean.val1_able}=="") checked #end/>禁止
																	</div>
																</td>
																<td style="width: ${cmpwidth_4}px;" >
																	<div class="x-grid3-cell-inner " >
																		&nbsp;
                                        								#if(${bean.rval1_able}=="" || ${bean.rval1_able}=="0") 
                                        									<font color="red">禁止</font>
                                        								#elseif(${bean.rval1_able}=="1")
                                        									允许
                                        								#end
																	</div>
																</td>
																<td style="width: ${cmpwidth_5}px;" >
																	<div class="x-grid3-cell-inner " >
																		&nbsp;${bean.uptime}
																	</div>
																</td>
															</tr>
														</tbody>
													</table>
												</div>		
											#end			
											</div>											
										</div>
									</div>									
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="x-panel-bl x-panel-nofooter">
					<div class="x-panel-br">
						<div class="x-panel-bc"></div>
					</div>
				</div>
			</div>
		</div>
		</form>
