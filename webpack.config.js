const path=require('path')
const UglifyWebpackPlugin =require('uglifyjs-webpack-plugin')
module.exports={
    entry:{
        index:path.resolve(__dirname,'src/index.js')
    },
    devtool:"sourcemap",
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:"[name].js"
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                use:['babel-loader']
            }
        ]
    },
    optimization: {
        minimizer: [
          new UglifyWebpackPlugin({
            uglifyOptions: {
                ie8:true,
                ecma:7,
                compress:false
              },
          })
        ],
      }
}
