var searchRemender = {
	remenderList: ["aaa", "popapp", "bbb", "aailalal", "bbbsbsbsb", "啦啦啦", "沙卡拉卡"]
}

var App = React.createClass({
	getInitialState: function () {
		return {
			matchedResultList: [],
			searchKey: "",
			isClose: false
		}
	},

	getTheRemenderByKey: function (key) {
		if(key.trim() === "") return [];
		let result = [];
		searchRemender.remenderList.map(function (item) {
			if (item.indexOf(key) === 0 && item.length > key.length) result.push(item);
		});
		console.log(result);
		return result;
	},

	clearRemenderHandler: function () {
		return function () {
			let matchedResultList = {matchedResultList: []};
			searchRemender.remenderList = [];
			this.setState(matchedResultList);
		}.bind(this);
	},

	closeRemenderHandler: function () {
		return function () {
			this.setState({matchedResultList: [], isClose: true});
		}.bind(this);
	},

	searchHandler: function () {
		let inV = this.refs.searchIn;
		if (inV.value.trim() === "") {
			console.log("empty input");
			return false;
		}
		searchRemender.remenderList.push(inV.value);
		return false;
	},

	searchInChangeHandler: function () {
		let inV = this.refs.searchIn.value;
		this.setState({matchedResultList: this.getTheRemenderByKey(inV), searchKey: inV});
	},

	selectRemenderHandler: function () {
		return function(index, event){
			this.setState({searchKey: event.target.innerHTML, matchedResultList: []});
		}.bind(this);
	},

	render: function () {
		var matchedResultList = this.state.matchedResultList,
			footer = matchedResultList.length ? <Footer clear={this.clearRemenderHandler()}
					close={this.closeRemenderHandler()} /> : "";
		return <section className="container">
			<input type="text" ref="searchIn" onChange={this.searchInChangeHandler} value={this.state.searchKey} />
			<input type="button" value="搜索&添加智能提示" onClick={this.searchHandler} />
			<div className="remenderContainer">
				<RemenderList matchedResultList={matchedResultList} selectRemender={this.selectRemenderHandler()} />

				{footer}
			</div>
		</section>
	}

});


//提示list
var RemenderList = React.createClass({
	render: function () {
		let that = this;
		
		//bug
		
		return <ul className="remenderList">
				{
					this.props.matchedResultList.map(function (item, i) {
						return <li onClick={that.props.selectRemender.bind(null, i)} key={i}>{item}</li>
					})
				}
		</ul>
	}

});


//底部操作区
var Footer = React.createClass({
	render: function () {
		return <div className="operate-area">
				<a href="javascript: void(0)">设置</a>
				<a href="javascript: void(0)" onClick={this.props.clear}>清空</a>
				<a href="javascript: void(0)" onClick={this.props.close}>×</a>
		</div>
	}
});

ReactDOM.render(
  <App />,
  document.getElementById("mainI")
);