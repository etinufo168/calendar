	var disTable;
    var opt={	
   			"oLanguage":{"sProcessing":"處理中...",
                        "sLengthMenu":"顯示 _MENU_ 項結果",
                        "sZeroRecords":"查無資料...",
                        "sInfo":"顯示第 _START_ 至 _END_ 項結果，共 _TOTAL_ 項",
                        "sInfoEmpty":"顯示第 0 至 0 項結果，共 0 項",
                        "sInfoFiltered":"(從 _MAX_ 項結果過濾)",
                        "sSearch":"搜索:",
                        "oPaginate":{"sFirst":"首頁",
                                     "sPrevious":"上頁",
                                     "sNext":"下頁",
                                     "sLast":"尾頁"}
	            }
       };

	function initTables(){
		disTable = $("#table1").dataTable(opt); 
	}
      	
	function queryTable(){	
		var i=1;	
		disTable.fnDestroy();
		disTable = $("#table1").dataTable({
  			"oLanguage":{"sProcessing":"處理中...",
                "sLengthMenu":"顯示 _MENU_ 項結果",
                "sZeroRecords":"查無資料...沒有匹配結果",
                "sInfo":"顯示第 _START_ 至 _END_ 項結果，共 _TOTAL_ 項",
                "sInfoEmpty":"顯示第 0 至 0 項結果，共 0 項",
                "sInfoFiltered":"(從 _MAX_ 項結果過濾)",
                "sSearch":"搜索:",
                "oPaginate":{"sFirst":"首頁",
                             "sPrevious":"上頁",
                             "sNext":"下頁",
                             "sLast":"尾頁"}
  				},
			"bJQueryUI":false,
			"bServerSide":false,
			"sAjaxSource": './queryDept',
			"fnServerParams": function ( aoData ) {
				$.merge(aoData, $("#queryFrom").serializeArray());
				},
			"aoColumns": [
					{ "mDataProp": null, 
						"bSortable":false,
						"sWidth":"1%", 
						"mRender": function(oObj, type, full){
							return i++;}
						 },
					{ "mDataProp": "deptid", "sDefaultContent": '' },
					{ "mDataProp": "deptname", "sDefaultContent": '' },
					{ "mDataProp": "orgtype", "sDefaultContent": '' },
					{ "mDataProp": "usestatus", "sDefaultContent": '' },
					{ "mDataProp": "deptid", 
						"bSortable":false,
						"mRender": function(oObj, type, full){ 
							return "<a href=\"#\" onclick=\"openEdit(\'" + oObj + "\');\"><img src=\"resources/img/icon_edit.gif\" alt=\"Edit\"></a>"+
							 "<a href=\"#\" onclick=\"deleteHrdept(\'" + oObj + "\');\"><img src=\"resources/img/icon_trashcan.gif\" alt=\"Delete\"></a>";
							}
					}
				]
		});   
		
	}
	
	function saveHrdept(){

	    $.post("./saveHrdept", 
	    		$("#queryFrom").serialize(),
	    	    function(data, status){
	    	        //alert("Data: " + data + "\nStatus: " + status);
	    			queryTable()
	    	    });
	}
	
	function deleteHrdept(deptID){
	     var delNode = confirm('確認刪除?'+deptID);   
	     if (delNode) {
		     var newwin	= window.open("deleteHrdept?deptId="+deptID,"deleteHrdept");	
		     //alert("刪除成功!");
		     newwin.close();
		     queryTable();
	     }	
	}
	
	function openEdit(deptId){							
		window.open("deptEdit?q_deptID="+deptId,"deptEdit");
	}

