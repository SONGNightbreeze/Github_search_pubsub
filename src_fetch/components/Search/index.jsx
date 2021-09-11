import React, { Component } from 'react'
import PubSub from 'pubsub-js'
// import axios from 'axios'

export default class Search extends Component {

	search = async()=>{
		//获取用户的输入(连续解构赋值+重命名)
		const {keyWordElement:{value:keyWord}} = this
		//发送请求前通知List更新状态
		PubSub.publish('atguigu',{isFirst:false,isLoading:true})
		//#region 发送网络请求---使用axios发送
		/* axios.get(`/api1/search/users2?q=${keyWord}`).then(
			response => {
				//请求成功后通知List更新状态
				PubSub.publish('atguigu',{isLoading:false,users:response.data.items})
			},
			error => {
				//请求失败后通知App更新状态
				PubSub.publish('atguigu',{isLoading:false,err:error.message})
			}
		) */
		//#endregion
			
		//发送网络请求---使用fetch发送（未优化）
		/* fetch(`/api1/search/users2?q=${keyWord}`).then(
			response => {
				console.log('联系服务器成功了');
				return response.json()  返回值是一个Promise实例，想要的数据就在 Promise 实例里
										.then()所指向的成功的回调就有了返回值
										
										.then()之所以能链式调用因为返回依然是一个promise实例
										如果.then()所指定的成功的回调或者失败的回调的返回值是
											一个实例对象，那么就把该实例对象作为整个.then()
											方法的返回值

										是一非Promise值，外侧的.then()所返回的Promise实例状态
										就是成功的，值就是返回的非Promise值
										
										如果.then()返回的本身就是一个Promise值，就把这个值作为
										外侧then所返回的Promise实例的值
										
										如果返回的是一个pending状态的实例，外侧的状态也是pending
										
										如果成功的回调抛异常，.then()状态就为失败的
										失败的原因就是抛出的异常
				},
			//error => {
			//	console.log('联系服务器失败了',error);
			//	return new Promise(()=>{})  初始化一个promise实例来中断promise链
			//}
		再次.then()取出数据
		).then(
			response => {console.log('获取数据成功了',response);},
			//error => {console.log('获取数据失败了',error);}
		).catch(
			(error)=>{console.log(error);}
		) 
		*/

		//发送网络请求---使用fetch发送（优化）
		// 可以不使用 .then()因为删除掉error统一用catch()回调失败的情况 
		// 利用await 只取成功的结果，用try{} catch(error){} 来回调当出错的情况
		try {
			const response= await fetch(`/api1/search/users2?q=${keyWord}`)
			const data = await response.json()
			console.log(data);
			PubSub.publish('atguigu',{isLoading:false,users:data.items})
		} catch (error) {
			console.log('请求出错',error);
			PubSub.publish('atguigu',{isLoading:false,err:error.message})
		}
	}

	render() {
		return (
			<section className="jumbotron">
				<h3 className="jumbotron-heading">搜索github用户</h3>
				<div>
					<input ref={c => this.keyWordElement = c} type="text" placeholder="输入关键词点击搜索"/>&nbsp;
					<button onClick={this.search}>搜索</button>
				</div>
			</section>
		)
	}
}

