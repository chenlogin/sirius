#!/bin/bash
echo "========begin======"
echo $PATH
node -v

# 当前脚本目录
currentDir=$(cd `dirname $0`; pwd)
echo $0
echo $1

echo "开始构建 $1"
