#!/bin/bash
echo "========begin======"
echo $PATH
node -v

# 当前脚本目录
currentDir=$(cd `dirname $0`; pwd)
echo $0
echo $1


# 创建目录
cd Desktop 
mkdir newFloder

if [ $? -ne 0 ]; then
	echo =Error:目录创建失败
	exit 1
else
    echo "====目录创建成功===="
fi


echo "开始构建 $1"
