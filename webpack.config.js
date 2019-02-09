const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) =>{
	const isProduction = env ==='production';
	const CSSExtract = new MiniCssExtractPlugin({ filename: 'styles.css' });
	return {
		entry : {
			index : ['@babel/polyfill','./src/js/index.js'],
		},
	
		output:{
			// path: path.join(__dirname, 'public', 'dist' ),
			path: path.join(__dirname, 'public'),
			filename:'bundle.js',
			publicPath: '/',
		},
		
		devServer: {
			contentBase: path.join(__dirname, './public'),
			historyApiFallback:true,
			publicPath:'/'
		},
	
		plugins:[
			new HtmlWebpackPlugin({
				template: './src/index.html'
			}),
			
			CSSExtract,	
		],
	
		devtool:isProduction ? 'source-map' : 'inline-source-map',
		
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
				 	use:{
				 		loader:'babel-loader',
				 	}
				},{
					test:/\.s?css$/,
					use: [
					     MiniCssExtractPlugin.loader,
					     {
					         loader: 'css-loader',
					         options: {
					             sourceMap: true
					         }
					     },
					     {
					         loader: 'sass-loader',
					         options: {
					             sourceMap: true
					         }
					     }
					 ]
				}
			]//end rules
		} //end module
	};
};

