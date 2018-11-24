
function setQuery(q, name, v) {
	var reg = new RegExp("(^|&)" + name + "=[^&]*(&|$)");
	if (v === null) {
		q = q.replace(reg, "&");
	} else if (q.length && reg.test(q)) {
		q = q.replace(reg, "$1" + name + "=" + v + "$2");
	} else {
		q += q.length ? "&": "";
		q += encodeURIComponent(name) + "=" + encodeURIComponent(v);
	}
	q = q.replace("&&", "&");
	if (q.slice( - 1) == "&") q = q.slice(0, -1);
	if (q.slice(0, 1) == "&") q = q.slice(1);
	return q;
}

function getRequestParam(name) {
	var url = location.search; //获取url中"?"符后的字串
	if (url.indexOf("?") != -1) {    //判断是否有参数
		var str = url.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
		strs1 = str.split("&");
		var param = {};
		for (var i = 0; i < strs1.length; i++) {
			var keyValue = strs1[i].split("=");
			param[keyValue[0]] = keyValue[1];
		}
		return param[name];
	} else {
		return '';
	}
}

function getHash(name) {
	var url = location.hash; 		//获取url中"#"符后的字串
	if (url) {
		var str = url.substr(1);
		strs1 = str.split("&");
		var param = {};
		for (var i = 0; i < strs1.length; i++) {
			var keyValue = strs1[i].split("=");
			param[keyValue[0]] = keyValue[1];
		}
		return param[name];
	} else {
		return '';
	}
}


function formatDate(str, d) {
	if (!str) str = new Date().getTime() / 1000;
	obj = new Date(str * 1000)
	var year = obj.getFullYear(),
		month = obj.getMonth() + 1,
		date = obj.getDate(),
		hour = obj.getHours(),
		minute = obj.getMinutes(),
		second = obj.getSeconds();
		month = month < 10 ? '0' + month : month;
		date = date < 10 ? '0' + date : date;
		hour = hour < 10 ? '0' + hour : hour;
		minute = minute < 10 ? '0' + minute : minute;
		second = second < 10 ? '0' + second : second;
	if (d==1) return year + "-" + month + "-" + date;
	if (d==2) return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
	return year + "-" + month + "-" + date + " " + hour + ":" + minute ;
}

function fordate(date) {
	if(!date) return date
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	var h = date.getHours();
	var minute = date.getMinutes();
	minute = minute < 10 ? ('0' + minute) : minute;
	var s = date.getSeconds();
	s = s < 10 ? ('0' + s) : s;
	return y + '-' + m + '-' + d;
}

/**
 ids转成对应的values
 */
function ids2names(ids, arr) {
	if(!arr) return;
	var ret = [];
	var ida = ids.split(',');
	for(var i=0, len=ida.length; i<len; i++) {
		ret[i] = arr[ida[i]];
	}
	return ret.join(",");
}

function find_json_by_key(arr, key, val) {
	if(!arr || !key) {
		return;
	}

	for(var k in arr) {
		if(arr[k][key] == val) {
			return arr[k];
		}
	}
}

function get_json_by_key(jstr, sit) {
	var i = 0;
	for(var k in jstr) {
		if(i==sit) {
			return jstr[k]
		}
		i++
	}
}


function set_back_hash(jso, page, pagesize)
{
	var s = "#p=" + page;
	if(pagesize) s += "&ps=" + pagesize;
	for(var k in jso) {
		if(k=="page" || k=="row_num" || !jso[k]) {
			continue;
		}

		// console.log(typeof jso[k], ', ',k,  ': ' , jso[k]);
		if(typeof jso[k] == "object") {
			continue;
		}

		s +=  "&" + k + '=' + jso[k];
	}
	return s;
}

function before_today(sdate) {
	if(!sdate) return;
	var today = (new Date());
	today.setHours(0, 0, 0, 0)

	if(!sdate.getTime) {
		return;
	}

	return (sdate && (sdate.getTime() < today.getTime()))
}

function loadKE1(w, h, key) {
	w = w || "85%";
	h = h || "450px";
	var K = KindEditor;
	var key = key || "textarea[ke=1]";
	var editor = K.create(key, {
		cssPath: '/assets/kindeditor/plugins/code/prettify.css',
		uploadJson: '/keditor/index',
		fileManagerJson: '/keditor/list',
		themeType: "simple",
		resizeType: 2,
		allowFileManager: true,
		filterMode: true,
		bodyClass: "content",
		allowFlashUpload: false,
		pasteType: 2,
		width: w,
		height: h,
		items: ['formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist', 'insertunorderedlist', '|', 'emoticons', 'image', 'link', 'unlink', '|', 'clearhtml', 'quickformat', 'preview', 'source', 'fullscreen'],
		afterChange: function(e) {
			this.sync()
		}
	});
	return editor;
}

function fix_remote_query(ele) {

	ele.on("focus",function () {
		remote_query = true;
	}).on("blur",function () {
		remote_query = false;
	})
}

/**
 * 定义Vue公共方法、变量
 * 2018/2/11 10:23
 */
var myMixin = {
	data: function () {
		return {
			getRequestParam: getRequestParam,
			getHash: getHash,
			formatDate: formatDate,
			total: 0,
			pageSize: parseInt(getHash('ps')) || 10,
			currentPage: parseInt(getHash('p')) || 1,
			page_sizes:[10,20,30,50,100,200,500],
			
			back: location.hash,
			
			loading: false,
			fullscreenLoading: false,
			multipleSelection: '',
			role: 0,
			selRow: {},
			
			editVisible: false,
			addVisible: false,
			tableData: [],
			
			importVisible: false,
			fileList:[],
			
			brands: {},
			users:[],
			stores:[],
			stores1:[],
			cats_options: '',
		}
	},
	methods: {

		success: function (msg, dutime) {
			this.$notify({
				title: '成功',
				duration: dutime * 1000 || '2000',
				message: msg,
				type: 'success'
			});
		},
		error: function (msg, dutime) {
			this.$notify({
				title: '错误',
				duration: dutime * 1000 || '3000',
				message: msg,
				type: 'error'
			});
		},
		open5: function (msg, dutime) {
			this.$notify.info({
				title: '消息',
				duration: dutime * 1000 || '5000',
				message: msg,
			});
		},
		open2: function (message) {
			this.$message({
				message: message,
				type: 'success'
			});
		},
		open3: function (message) {
			this.$message({
				message: message,
				type: 'warning'
			});
		},
		open4: function (message) {
			this.$message({
				message: message,
				type: 'error'
			});
		},
		
		trim: function (str) {
			return str.replace(/(^\s*)|(\s*$)/g, "");
		},
		
		handleSizeChange: function (val) {
			this.pageSize = val;
			this.formData.currentPage = this.currentPage;
			this.formData.pageSize = val;
			this.getList();
		},
		
		handleCurrentChange: function (val) {
			this.currentPage = val;
			this.formData.currentPage = val;
			this.formData.pageSize = this.pageSize;
			this.getList();
		},
		
		handleSelectionChange: function(val) {
			this.multipleSelection = val;
		},
		
		resetForm: function (formName) {
			this.addVisible = false
			this.$refs[formName].resetFields();
		},
		
		importorder:function(){
			this.importVisible = true;
			this.fileList = [];
		},
		
		upload_progress: function (response, file, fileList) {
			this.loading = true;
		},
		
		upload_successe: function (response, file, fileList) {
			this.loading = false;
			this.getList();
			this.open5(response.msg, 600);
			this.importVisible = false;
			this.fileList = [];
			
			if(response.error == 0 && response.data.file) {
				window.location.href = response.data.file;
			}
		},
		
		sortChange:function ( column, prop, order )
		{
			this.formData.sortby = [column.prop, column.order]
			this.getList();
		},
		
		doDelete: function (url, row) {
			var that = this;
			this.$confirm('确定要删除吗?', '提示', {
				type: 'warning',
			}).then(function() {
				Vue.http.get(url + '?id=' + row.id).then(function (response) {
					if (response.body.error == 0) {
						that.success('删除成功');
						that.getList();
					} else {
						that.error(response.body.msg);
					}
				}, function (response) {
					that.error(response.body.msg);
				});
			}).catch(function () {});
		},
		
		delAll: function (url) {
			var that = this;
			this.$confirm('确定要删除吗?', '提示', {
				type: 'warning'
			}).then(function() {
				var ids =[];
				for(var i in that.multipleSelection) {
					ids.push(that.multipleSelection[i].id);
				}
				if(!ids.length) return;
				Vue.http.post(url,{ids:ids},{emulateJSON: true}).then(function (response) {
					if (response.body.error == 0) {
						that.success(response.body.msg);
						that.getList();
					} else {
						that.error(response.body.msg);
					}
				}, function (response) {
					that.error(response.body.msg);
				});
			}).catch(function () {});
		},
		
		onSearch: function () {
			this.currentPage = 1
			this.formData.currentPage = this.currentPage;
			this.formData.pageSize = this.pageSize;
			
			if(this.formData.dates && this.formData.dates.length && typeof this.formData.dates[0] !== 'string'){
				this.formData.dates[0] = fordate(this.formData.dates[0]);
				this.formData.dates[1] = fordate(this.formData.dates[1]);
			}
			
			if(this.formData.dates1 && this.formData.dates1.length && typeof this.formData.dates1[0] !== 'string'){
				this.formData.dates1[0] = fordate(this.formData.dates1[0]);
				this.formData.dates1[1] = fordate(this.formData.dates1[1]);
			}
			
			this.getList()
		},
		
		remoteMethod: function(query) {
			if(!remote_query) return;
			if (!query)	{
				this.cats_options = []
				return
			}
			
			var that = this
			
			setTimeout(function() {
				Vue.http.get('/product/search_cat?kw=' + query).then(function (response) {
					if (response.body) {
						that.cats_options = response.body.data
					}
				}, function (response) {
					that.error(response.body.msg);
				});
				
			}, 300);
			
		},
		
		updated: function () {

			// if (!$(".el-pager li.active")[0] || !this.formData.page) {
			// 	return;
			// }
			// location.hash = setQuery(location.hash.substr(1), "p", this.formData.page);
			// location.hash = "" ;
			// location.hash = "p=" + (this.formData.page||1);
			// this.back = set_back_hash(this.formData, this.formData.page, this.formData.row_num || this.formData.pageSize || 10);

		},

	}

}
