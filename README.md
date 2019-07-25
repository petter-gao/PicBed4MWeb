# MWeb自定义GitHub图床

## 设计初衷 && 用途：

在Mac上一直用MWeb记录一些东西，使用的是markdown格式，里面有一些图片，默认是在本地的media目录下，如果要发布，图片需要发布到公网上。
MWeb支持的图床有`imgur`、`七牛云存储`、`又拍云`、`腾讯云`，后面三个需要购买服务和域名。之前写过[一片文章](https://www.jianshu.com/p/980fcf97ddea)可以使用Github当图床。

Github需要用PUT方法提交文件，而MWeb只能使用POST方法，所以就有了这个项目，本地启动一个服务，接受请求，转换后转发给github。

## 用法

1. `git clone https://github.com/gaopeng-hz/PicBed4MWeb.git ` 克隆项目
2. `yarn（or npm install）` 安装依赖
3. 修改config.json
4. `node index.js` 运行server
5. 在MWeb中添加发布服务（or 其他用途）

## `config.json` 说明

```json
{
	"repo": "gaopeng-hz/images",  // 仓库名称
	"token": "xxxx",  // token，不能公开，获取方式参考上面那篇文章
	"port": 8081,  // node服务器监听端口，默认8080
	"url": "/upload"  // 服务上传url，默认/upload
}
```

## 服务管理

`node index.js`可以启动服务进行调试，关闭终端后服务就停了，我想要一种`关闭终端后服务依然可以运行的方式`，这就是`nohup`，使用`nohup node index.js &`这个命令就可以保证服务在后台运行。这种方式启动服务后是不可以通过`CTRL+C`的方式关闭服务的，需要通过`ps | grep index.js`来查找服务的pid，输入的内容第一列就是pid，使用`kill -9`命令关闭服务。

![](https://raw.githubusercontent.com/gaopeng-hz/images/master/20190725145219.jpg)

## MWeb中的配置

在MWeb的偏好设置中，选择发布服务页面，在下方的图片上传服务中选择自定义，新弹出的配置页面中，名称自己定，API地址根据`config.json`中的配置，前面加上本地地址，POST文件名和图片URL路径固定为`file`和`url`。

![](https://raw.githubusercontent.com/gaopeng-hz/images/master/20190725135134.jpg)

## 开机启动

所有的调试都完成了之后我希望把这个服务加入到开机启动，新增一个文件`run.sh`，内容如下

```bash
#!/usr/bin/env bash

# 修改成自己的目录
nohup node /Users/gaopeng/PicBed4MWeb/index.js &
```

为文件增加权限

```bash
sudo chmod 777 run.sh
```

修改文件打开方式为终端

![](https://raw.githubusercontent.com/gaopeng-hz/images/master/20190725144711.jpg)

打开Mac的系统偏好设置，进入用户与群组的登录项Tab，添加`run.sh`

![](https://raw.githubusercontent.com/gaopeng-hz/images/master/20190725144716.jpg)

重启后可以直接使用MWeb上传图片了。

## 参考

[sinaPicHostingApi](https://github.com/J3n5en/sinaPicHostingApi)

[利用 github 和 python3 以及 MWeb 打造自己的博文图床](https://blog.csdn.net/FungLeo/article/details/80706829)


