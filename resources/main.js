var port="http://localhost:83";
var name="steven";
document.title=name+"的行事曆";
function UserDevice() {
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		//console.log("使用行動裝置!");
		//$("#calendar").css("display", "none");
		return true;
	}
	else {
	document.addEventListener('DOMContentLoaded', function() {
		//console.log("非使用行動裝置!");
		$(".container").css("display", "none");
		return false;
	});
	}
}
var data=[];

if(!UserDevice()){ //use PC
	document.addEventListener('DOMContentLoaded', function() {
		setTitle(); //假資料
		
		var calendarEl = document.getElementById('calendar');
		var Calendar = FullCalendar.Calendar;
		
		var today = new Date().toISOString().split("T")[0]; //yyyy-MM-dd
		//var today = new Date().toISOString().substr(0,10); //yyyy-MM-dd
		//var today = new Date().toISOString().substr(0,19); //yyyy-MM-ddThh:mm:ss
		var twoMonth = new Date().addMonths().toISOString().split("T")[0];

		var loadReady = false; //to limit "events:" resend ajax
		
		var calendar = new FullCalendar.Calendar(calendarEl, {
			//plugins: [ 'interaction', 'dayGrid', 'timeGrid','bootstrap' ],
			plugins: [ 'interaction', 'dayGrid', 'timeGrid' ],
			defaultView: 'timeGridWeek',
			defaultDate: today,
			locale: 'zh-tw', //換成中文
			//themeSystem: 'bootstrap', //改主題
			navLinks: true, // can click day/week names to navigate views
			//editable: true, // can scroll the items
			eventLimit: true, // allow "more" link when too many events
			views: {
				timeGrid: {
				  eventLimit: 3 // allday for timeGridWeek/timeGridDay
				}
			},
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'dayGridMonth,timeGridWeek,timeGridDay'
			},
			selectable: true,
			/* 不開放新增&刪除 (to line 103)*/
			//點擊新增 開始
			select: function(e) {
				var t = prompt("新增一個事件，從 " + e.startStr.substr(0,16).split("T") + " 到 " + e.endStr.substr(0,16).split("T") + " \n請輸入標題:");
				if(t != null){
					if( t.length != 0){ //有輸入標題
						data.push({
						title: t,
						start: e.startStr.substr(0,19),
						end: e.endStr.substr(0,19)
						}); //存進Ndata
						console.log("add title: "+t);
						console.log("add start: "+e.startStr.substr(0,19));
						console.log("add end: "+e.endStr.substr(0,19));
						console.log(data);
						(t || e.view.type.match(/^timeGrid/)) && calendar.unselect(), t && calendar.addEvent({
							title: t,
							start: e.startStr.substr(0,19),
							end: e.endStr.substr(0,19),
							color: 'black',     // an option!
							textColor: 'yellow' // an option!
						})
					}
				}
			},
			//點擊日期
			dateClick: function(info) {
				// 點擊後動作
				//alert('Clicked on: ' + info.dateStr);
				//alert('Current view: ' + info.view.type);
				// change the day's background color just for fun
				//info.dayEl.style.backgroundColor = 'red';
			},
			//點擊事件
			eventClick: function (info) {
				var date = info.event.start; //開始時間
				var date2 = info.event.end; //結束時間
				//判斷開始&結束時間 是否皆為 yyyy-MM-dd >是的話:整天活動 (必須有start&end 不然line:99會報錯)
				if(date.yyyymmdd().split("T")[1]== "00:00:00" && date2.yyyymmdd().split("T")[1]== "00:00:00"){
					date = date.yyyymmdd().split("T")[0];
				}
				else{
					date = date.yyyymmdd();
				}
				console.log("click time: "+date);
				var time = info.event.start.yyyymmdd().substr(0,16).split("T")[1]; //hh:mm
				if (confirm("確認刪除: " +time+"-"+ info.event.title + " ?")) {
					info.event.remove(); //刪除該事件
					removeData(info.event.title,date);
					console.log(data);
				} else {
					// Do nothing!
				} 
			},
			events:data
			/*eventClick: function (info) {
				var time = info.event.start.yyyymmdd().substr(0,16).split("T")[1]; //hh:mm
				alert(time+"-"+info.event.title);
			},
			events: function(timezone, callback) {
				if(loadReady == false){
					$.ajax({
						//url: "http://localhost:58229/api/Default",
						url: port+"/api/Default?UserName="+name+"&StartDate="+today+" 00:00:00&EndDate="+twoMonth+" 23:59:00",
						type : "GET",
						dataType : "json",  
						//contentType : 'application/json; charset=utf-8',
						//xhrFields: {withCredentials: true},
						data: {
						},
						success: function(doc) {
							//type of doc : string
							//console.log(doc);
							doc = JSON.parse(doc); //doc:string to json
							//save doc to data
							var start = new Date();
							var end = new Date().addHours(1);
							for(key in doc.Table) {
								//console.log(doc.Table[key].UserName);
								data.push({
									title: doc.Table[key].UserName+" "+doc.Table[key].PatName+" "+doc.Table[key].Notes,
									//start: start.yyyymmdd(),
									start: doc.Table[key].StartDate,
									//end : end.yyyymmdd()
									end: doc.Table[key].EndDate
								});
								start.setDate(start.getDate()+1); 
								end.setDate(end.getDate()+1); 
							}
							//console.log(data);
							callback(data);
							loadReady = true;						
						}
					});
				}
				//loadReady = true > to allow dayGridMonth callback data
				else{
					callback(data);
				}
			}*/
		});
		calendar.render();
	});

	function setTitle(){
		//title: "1234", start: "2019-11-04", end: "2019-11-05"
		var start = new Date();
		var end = new Date().addHours(3);
		//yesterday
		var yes = new Date().addDays(-1);
		var yes2 = new Date().addDays(-1).addHours(5);
		for(var i=0;i<=2;i++){
			data.push({
				"title": "胖虎 吃飯",
				"start": yes,
				"end": yes2
			});
		}
		//today
		for(var i=0;i<=2;i++){
			data.push({
				"title": "大熊 讀書",
				"start": start,
				"end": end
			});
		}
		//tomorrow
		var date = new Date().addDays(1);
		for(var i=0;i<=2;i++){
			data.push({
				"title": "靜香 逛街",
				"start": date,
				"end": date
			});
		}
		
	}
	// date to yyyy-MM-ddThh:mm:00
	Date.prototype.yyyymmdd = function() {
		var mm = this.getMonth() + 1; // getMonth() is zero-based
		var dd = this.getDate();
		var hh = this.getHours();
		var m  = this.getMinutes();

		return [this.getFullYear(),
			  "-"+(mm>9 ? '' : '0') + mm,
			  "-"+(dd>9 ? '' : '0') + dd,
			  "T"+(hh>9 ? '' : '0') + hh,
			  ":"+(m>9 ? '' : '0') + m +":00"
			 ].join('');
	};
	// add h day
	Date.prototype.addDays = function(h) {
		this.setTime(this.getTime() + (h*24*60*60*1000));
		return this;
	};
	// add h hour
	Date.prototype.addHours = function(h) {
		this.setTime(this.getTime() + (h*60*60*1000));
		return this;
	};
	// add 2 months
	Date.prototype.addMonths = function() {
		this.setMonth(this.getMonth() + 2);
		return this;
	};

	//remove data
	function removeData(title,start) {
		console.log("delete title: "+title);
		console.log("delete start: "+start);
		for (var i = 0; i < data.length; i++) {
			if (data[i].title == title && data[i].start == start) {
				data.splice(i, 1);
			}
		}
	}
}
else{ //use phone
	//window.console.error = function(){} //disable console.error
	//window.console.log = function(){} //disable console.log
	function HideContent(d) {
		document.getElementById(d).style.display = "none";
	}
	function ShowContent(d) {
		document.getElementById(d).style.display = "block";
	}
	
	window.onload = function() { 	
		$.datepicker.setDefaults( $.datepicker.regional[ "zh-TW" ] ); //若有使用中文
		$("#date").datepicker({dateFormat: 'yy-mm-dd'}); //選用日期格式
		//初始化
		var today = new Date().toISOString().split("T")[0]; //typeof:string
		document.getElementById("test").value=today;
		//日期改變
		$("#date").change(function(){
			var select = $("#date").datepicker({ dateFormat: 'yy-mm-dd' }).val(); //取值
			document.getElementById("test").value=select;
			getData(select);
		});
		//日期text改變
		$("#test").change(function(){
		var test = document.getElementById("test").value;
		var testL = test.length;
			if(testL=="10"){ //輸入正確 yyyy-MM-dd 才改變日曆
				showDay(test);
				getData(test);
			}
		});
		//ajax 組data
		getData(today);
	}
	/*加減日期*/
	//前一天
	function preDay(){
		var date = $("#date").datepicker('getDate'); //typeof:object
		date.setDate(date.getDate()-1); 
		$("#date").datepicker('setDate', date);
		var select = $("#date").datepicker({ dateFormat: 'yy-mm-dd' }).val(); //取值
		document.getElementById("test").value=select;
		getData(select);
	}
	//後一天
	function nextDay(){
		var date = $("#date").datepicker('getDate'); //typeof:object
		date.setDate(date.getDate()+1); 
		$("#date").datepicker('setDate', date);
		var select = $("#date").datepicker({ dateFormat: 'yy-mm-dd' }).val(); //取值
		document.getElementById("test").value=select;
		getData(select);
	}
	//改變日曆
	function showDay(test){
		$("#date").datepicker("setDate", test); //改變日曆
		//$("#date").datepicker("setDate",$.datepicker.parseDate("yy-mm-dd", test)); //改變日曆
	}
	// date to yyyy-MM-ddThh:mm:00
	Date.prototype.yyyymmdd = function() {
		var mm = this.getMonth() + 1; // getMonth() is zero-based
		var dd = this.getDate();
		var hh = this.getHours();
		var m  = this.getMinutes();

		return [this.getFullYear(),
			  "-"+(mm>9 ? '' : '0') + mm,
			  "-"+(dd>9 ? '' : '0') + dd,
			  "T"+(hh>9 ? '' : '0') + hh,
			  ":"+(m>9 ? '' : '0') + m +":00"
			 ].join('');
	};
	// add 2 months
	Date.prototype.addMonths = function() {
		this.setMonth(this.getMonth() + 2);
		return this;
	};
	
	//var data=[];
	//loadDataTable();
	function getData(day) {		
		data.length=0;
		setData(day); //假資料
		queryTable();
		/*$.ajax({
			url: port+"/api/Default?UserName="+name+"&StartDate="+day+" 00:00:00&EndDate="+day+" 23:59:00",
			type : "GET",
			dataType : "json",
			xhrFields: {
				withCredentials: true
			},
			data : {
			},
			success : function(doc) {
				//type of doc : string
				//console.log(doc);
				doc = JSON.parse(doc); //doc:string to json
				//save doc to data
				for(key in doc.Table) {
					//console.log(doc.Table[key].UserName);
					data.push({
						"醫師姓名": doc.Table[key].UserName,
						"預約時間": doc.Table[key].StartDate.substr(0,16).split("T")[1],
						"預約病患姓名": doc.Table[key].PatName,
						"預約內容": doc.Table[key].Notes
					});
				}
				//console.log(data);
				//顯示表格
				queryTable();
			},
			complete : function() {
				//$('#loadering_bottom').hide();
			},
			error : function(xhr, ajaxOptions, errorThrown) {
				console.log("E");
			}
		});*/
	}
	function setData(day){
		for(var i=0;i<=2;i++){
			data.push({
				//"醫師姓名": "多拉A夢",
				"預約時間": day,
				"預約病患姓名": "大熊",
				"預約內容": "OD"
			});
		}
	}

	//查詢 : 結果以DataTable顯示
	var disTable;
	function queryTable(){
		disTable = $("#DataTable").DataTable({
			destroy: true,
			responsive: true,
			lengthMenu: [[10, 20, 30, 50, -1], [10, 20, 30, 50, '全部']],
			ordering: true,
			paging: false,
			scrollCollapse: true,
			scrollY:'59vh',
			info: true,
			filter: true,
			fixedHeader: true,
			order: [1, 'asc'], //排序 0開始
			bAutoWidth: true,
			sAjaxSource: '',
	//		fnServerParams: function ( aoData ) {
	//			aoData.push( {"name": "q_DistrictID", "value": $('#q_DistrictID').val()} );
	//			aoData.push( {"name": "q_DistrictName", "value": $('#q_DistrictName').val()} );
	//			},
			"aoColumns": [
				/* { "mDataProp": "預約時間", "mRender": function(oObj, type, full){
				return "<label class='pos-rel'><input type='checkbox' name='check' value='" + oObj +
						"' class='ace' id=\"" + oObj + "\" /><span class='lbl'></span></label>"},
					"sWidth":"0%", "bSortable":false, "sDefaultContent": '' }, */
				//{ "mDataProp": "醫師姓名", "sDefaultContent": '' },	//醫師姓名
				{ "mDataProp": "預約時間", "sDefaultContent": '' },	//預約時間
				{ "mDataProp": "預約病患姓名", "sDefaultContent": '' },	//預約病患姓名
				{ "mDataProp": "預約內容", "sDefaultContent": '' }	//預約內容
			],
			scrollX: true,
			iDisplayLength: 100,
			language: {
				lengthMenu: '顯示 _MENU_ 項结果',
				zeroRecords: '沒有匹配結果',
				info: '顯示前 _END_ 項结果，共 _TOTAL_ 項',
				infoEmpty: '顯示第 0 至 0 項结果，共 0 項',
				infoFiltered: '(由 _MAX_ 項结果過濾)',
				search: '搜尋 :',
				paginate: {
					previous: '上頁',
					next: '下頁',
				}
			}
		});
		$('#DataTable').DataTable().clear(); //清空table
		if(data.length!=0){
			$('#DataTable').dataTable().fnAddData(data); //前端新增資料
		}
		ShowContent('queryResult');

		$('.CheckboxGroup').on('click', function ()
		{
			var rows = disTable.rows({ 'search': 'applied' }).nodes();
			$('input[type="checkbox"]', rows).prop('checked', this.checked);
		});
		disTable.columns.adjust().draw();
	}
}
