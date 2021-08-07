const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');

module.exports = {
	mode: 'development',
	entry: {
		snakeEating: path.resolve(__dirname, 'src/snakeEating/snakeEating.js'),
		swipe: path.resolve(__dirname, 'src/swipe/swipe.js'),
		shopCart: path.resolve(__dirname, 'src/shopCart/shopCart.js'),
		todoList: path.resolve(__dirname, 'src/todoList/todoList.js'),
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name]/[name].js',
	},
	devtool: 'source-map',
	devServer: {
		contentBase: path.resolve(__dirname, 'src'),
		port: 8080,
		index: './snakeEating/snakeEating.html',
		hot: true,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'px2rem-loader',
						options: {
							remUnit: 16,
							remPrecision: 8,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [['postcss-preset-env']],
							},
						},
					},
				],
			},
			{
				test: /\.(sass|scss)$/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'px2rem-loader',
						options: {
							remUnit: 16,
							remPrecision: 8,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [['postcss-preset-env']],
							},
						},
					},
					'sass-loader',
				],
			},
			{
				test: /\.less$/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'px2rem-loader',
						options: {
							remUnit: 16,
							remPrecision: 8,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [['postcss-preset-env']],
							},
						},
					},
					'less-loader',
				],
			},
			{
				test: /\.html$/,
				use: ['html-loader'],
			},
			// {
			// 	test: /\.art$/,
			// 	use: ['art-template-loader'],
			// },
			{
				// 处理css/less等文件中的图片  处理成base64的图片
				test: /\.(png|woff|woff2|eot|ttf|otf|svg|jpg|jpeg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 8192, //文件小于 8(8192) kb 会把图片编译成base64字符串
						},
					},
				],
			},
		],
	},
	plugins: [
		// 贪吃蛇
		new HtmlWebpackPlugin({
			template: path.resolve(
				__dirname,
				'src/snakeEating/snakeEating.html'
			),
			filename: 'snakeEating/snakeEating.html',
			chunks: ['snakeEating'],
		}),
		// 轮播图
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src/swipe/swipe.html'),
			filename: 'swipe/swipe.html',
			chunks: ['swipe'],
		}),
		// 购物车
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src/shopCart/shopCart.html'),
			filename: 'shopCart/shopCart.html',
			chunks: ['shopCart'],
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src/todoList/todoList.html'),
			filename: 'todoList/todoList.html',
			chunks: ['todoList'],
		}),
		// 全局输出
		new Webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			template: 'art-template/lib/template-web',
		}),
	],
};
