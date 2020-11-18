const path = require('path');

var ROOT_PATH = path.resolve(__dirname, '../');
var SRC_PATH = path.resolve(ROOT_PATH, 'src');
module.exports = {

    context: ROOT_PATH,

    mode: 'production',

    entry: {

        main: path.join(SRC_PATH,'index.js')
    },

    output: {
        filename: '[name].build.js',
        path : path.join(ROOT_PATH,'src/')
        //1.webpack-dev-server并不能读取webpack.config.js的配置output
        //2.webpack.config.js里面的配置output属性是用webpack打包时候才起作用的，对webpack-dev-server并不起作用
        //3.启动webpack-dev-server目标文件夹中是看不到编译后的文件的,实时编译后的文件都保存到了内存当中。因此使用webpack-dev-server进行开发的时候都看不到编译后的文件
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [ SRC_PATH ],
                options: {
                    presets: ['env']
                }
            }
        ]
    },

    devServer: {
        contentBase: path.join(ROOT_PATH),
        port: 3001,
        //useLocalIp: true,
        //host: '0.0.0.0',
        openPage:"views/pie.html",
        hot : true,
        proxy: {
            "/api": "http://localhost:3001"
        }
    }
}